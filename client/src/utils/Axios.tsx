import  axios from 'axios';

import { store } from '../app/store';
// import {setTokens } from '../features/auth/authSlice';
import { setTokens } from '../features/auth/authSlice';

const api = axios.create({
//   baseURL: 'http://localhost:4001',
});

api.interceptors.request.use( (config) => {
    config.headers['Authorization'] = `Bearer ${store.getState().auth.access_token}`;
    return config;
})


api.interceptors.response.use((response) => {
    return response
}, async(error) => {
    const config = error.config;
    if (error.response && error.response.status === 401) {
        let res: any = await updateToken();
        if (res.data.access_token) {
            store.dispatch(setTokens(res.data));
            return api(config);
        };
    }
})
  
const updateToken = async () => {
   return await axios({
    url: `http://localhost:4001/auth/refresh`,
    method: "POST",
    headers:{
        Authorization: `Bearer ${store.getState().auth.refresh_token}`
    },
   })
}


export default api;