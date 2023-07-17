import  axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../../app/store';
// import {setTokens } from '../features/auth/authSlice';
import { setOnlyTokens } from '../../redux-features/auth/authSlice';
const api = axios.create({
//   baseURL: 'http://localhost:4001',
});

api.interceptors.request.use( (config) => {
	// if (store.getState().persistedReducer.auth.access_token){
	// }
	config.headers['Authorization'] = `Bearer ${store.getState().persistedReducer.auth.access_token}`;
	return config;
})


api.interceptors.response.use((response) => {
    return response
}, async(error) => {
    const config = error.config;
    if (error.response && error.response.status === 401) {
        let res: any = await updateToken();
        if (res.data.access_token) {
            // console.log("la response data ", res.data)
            // console.log('old AT ', store.getState().persistedReducer.auth.access_token)
            // console.log('old RT ', store.getState().persistedReducer.auth.refresh_token)
            // console.log('new AT ', res.data.access_token)
            // console.log('new RT ', res.data.refresh_token)
            store.dispatch(setOnlyTokens(res.data));
            const data = {
                nickname: store.getState().persistedReducer.auth.nickname,
                accessToken: res.data.access_token,
                refreshToken: res.data.refresh_token,
            }

            // console.log("Nickname ", store.getState().persistedReducer.auth.nickname);
            const serializeData = JSON.stringify(data);
            Cookies.set('Authcookie', serializeData, { path: '/' });
            // console.log("new data when refreshing ", res.data)
            return api(config);
        };
    }
})
  
const updateToken = async () => {
   return await axios({
    url: `http://localhost:4001/auth/refresh`,
    method: "POST",
    headers:{
        Authorization: `Bearer ${store.getState().persistedReducer.auth.refresh_token}`
    },
   })
}


export default api;