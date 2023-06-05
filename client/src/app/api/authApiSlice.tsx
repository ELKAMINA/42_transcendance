import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        signup: builder.mutation({  
            query: credentials => ({
                url: '/auth/Signup',
                method: 'POST',
                body: { ...credentials }
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
            query: credentials => ({
                url: '/auth/Logout',
                method: 'POST',
                body: { ...credentials }
            }),
        })
    })
})

export const {
    useSignupMutation, useSigninMutation, useLogOutMutation
} = authApiSlice