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
        logOut: builder.mutation({
            query: cred => ({
                url: '/auth/Logout',
                method: 'POST',
                body: { ...cred },
                credentials: 'include',
            }),
        })
    })
})

export const {
    useSignupMutation, useSigninMutation, useLogOutMutation
} = authApiSlice