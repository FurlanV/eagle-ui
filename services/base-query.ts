import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { setAuthCookie } from '@/lib/cookies'
import { loggedOut } from '@/store/auth/auth-slice'
const mutex = new Mutex()

export function createBaseQueryWithReauth(
    baseUrl: string,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
    const baseQuery = fetchBaseQuery({ baseUrl })
    const refreshQuery = fetchBaseQuery({ baseUrl: "/eagle/api/", method: "POST" })
    return async (args, api, extraOptions) => {
        await mutex.waitForUnlock()
        let result = await baseQuery(args, api, extraOptions)
        if (result.data?.error_code === "UNAUTHORIZED" || result.error?.status === 401) {
            if (!mutex.isLocked()) {
                const release = await mutex.acquire()
                try {
                    const refreshResult = await refreshQuery(
                        'auth/refresh',
                        api,
                        extraOptions
                    )
                    if (refreshResult.data && !refreshResult.error) {
                        setAuthCookie(refreshResult.data.token, 'AUTH_TOKEN')
                        setAuthCookie(refreshResult.data.refresh_token, 'REFRESH_TOKEN')
                        result = await baseQuery(args, api, extraOptions)
                    } else {
                        api.dispatch(loggedOut())
                    }
                } finally {
                    release()
                }
            } else {
                await mutex.waitForUnlock()
                result = await baseQuery(args, api, extraOptions)
            }
        }
        return result
    }
}