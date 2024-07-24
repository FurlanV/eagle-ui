import { createSlice } from '@reduxjs/toolkit'
import { removeCookies } from '@/lib/cookies';

import type { User } from '@/types/user'
import { RootState } from '../store'
import { setAuthCookie, isTokenExpiring } from '@/lib/cookies';
import { authAPI } from '@/services/auth';

type AuthState = {
    user: User | null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null } as AuthState,
    reducers: {
        loggedOut: (state) => {
            state.user = null
            removeCookies(['AUTH_TOKEN', 'REFRESH_TOKEN']);
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authAPI.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                const { user, token, refresh_token } = payload
                setAuthCookie(token, 'AUTH_TOKEN')
                setAuthCookie(refresh_token, 'REFRESH_TOKEN')
                return { user }
            },
        ),
            builder.addMatcher(
                authAPI.endpoints.verifyAuthentication.matchFulfilled,
                (state, { payload }) => {
                    if (!payload) {
                        authSlice.actions.loggedOut()
                    }
                    state.user = payload

                    if (isTokenExpiring()) {
                        //authAPI.endpoints.refresh.useMutation()
                    }
                },
            )
        builder.addMatcher(
            authAPI.endpoints.refresh.matchFulfilled,
            (state, { payload }) => {
                const { token, refresh_token } = payload
                setAuthCookie(token, 'AUTH_TOKEN')
                setAuthCookie(refresh_token, 'REFRESH_TOKEN')
            },
        )
    }
})

export const { loggedOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user