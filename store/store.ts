import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from '@reduxjs/toolkit/query'
import { eagleAPI } from "@/services/eagle/jobs"
import { eagleReportAPI } from "@/services/eagle/reports"
import { ensemblGeneAnnotationAPI } from "@/services/annotation/gene"
import { authAPI } from "@/services/auth"

import authSlice from "./auth/auth-slice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authSlice,
            [eagleAPI.reducerPath]: eagleAPI.reducer,
            [eagleReportAPI.reducerPath]: eagleReportAPI.reducer,
            [ensemblGeneAnnotationAPI.reducerPath]: ensemblGeneAnnotationAPI.reducer,
            [authAPI.reducerPath]: authAPI.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat([
                eagleAPI.middleware,
                eagleReportAPI.middleware,
                ensemblGeneAnnotationAPI.middleware,
                authAPI.middleware
            ]),
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

setupListeners(makeStore().dispatch)