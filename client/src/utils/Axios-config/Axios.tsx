import  axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../../app/store';
// import {setTokens } from '../features/auth/authSlice';
import { setOnlyTokens } from '../../redux-features/auth/authSlice';
const api = axios.create({
    withCredentials: true
//   baseURL: 'http://localhost:4001',
});

api.interceptors.request.use( (config) => {
	if (store.getState().persistedReducer.auth.access_token){
        config.headers['Authorization'] = `Bearer ${store.getState().persistedReducer.auth.access_token}`;
        // console.log('Acces token ', store.getState().persistedReducer.auth.access_token)
	}
	return config;
})


api.interceptors.response.use((response) => {
    /* If the request is OK, return the response */
    // console.log('the response', response)
    return response
}, async(error) => {
    /* If the request is KO: 
        Retrieving the intial config of the request */
    const config = error.config;
        /* Checking if it's an Unauthorized status error */
    if (error.response && error.response.status === 401) {
        // console.log("Config ", config)
        let res: any = await updateToken();
        if (res.data.access_token) {
            store.dispatch(setOnlyTokens(res.data));
            const data = {
                nickname: store.getState().persistedReducer.auth.nickname,
                accessToken: res.data.access_token,
                refreshToken: res.data.refresh_token,
            }
            config.headers['Authorization'] = `Bearer ${data.accessToken}`;
            // console.log("Nickname ", store.getState().persistedReducer.auth.nickname);
            const serializeData = JSON.stringify(data);
            Cookies.set('Authcookie', serializeData, { path: '/' });
            // console.log("New config ", config)
            return api(config);
        };
    }
    // console.log('error ', error)
    return Promise.reject(error);
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