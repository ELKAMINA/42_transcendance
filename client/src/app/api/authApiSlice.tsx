import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        signup: builder.mutation({  
            query: cred => ({
                url: '/auth/Signup',
                method: 'POST',
                body: { ...cred },
                credentials: 'include',
            }),
        }),
        signin: builder.mutation({  
            query: credentials => ({
                url: '/auth/Signin',
                method: 'POST',
                body: { ...credentials }
            }),
        }),
        checkPwd: builder.mutation({  
            query: credentials => ({
                url: '/auth/checkPwd',
                method: 'POST',
                body: { ...credentials }
            }),
        }),
        logOut: builder.mutation({
            query: cred => ({
                url: '/auth/Logout',
                method: 'POST',
                body: { ...cred },
                credentials: 'include',
            }),
        }),
        tfaAuthenticate: builder.mutation({  
            query: credentials => ({
                url: '/auth/2fa/authenticate',
                method: 'POST',
                body: { ...credentials }
            }),
        }),
    })
})

export const {
    useSignupMutation, useSigninMutation, useLogOutMutation, useTfaAuthenticateMutation, useCheckPwdMutation
} = authApiSlice