import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from '@reduxjs/toolkit/query'
import { eagleAPI } from "@/services/eagle/jobs"
import { eagleReportAPI } from "@/services/eagle/reports"
import { eagleCasesAPI } from "@/services/eagle/cases"
import { ensemblGeneAnnotationAPI } from "@/services/annotation/gene"
import { curationReviewAPI } from "@/services/eagle/review"
import { authAPI } from "@/services/auth"
import { tasksAPI } from "@/services/tasks"
import jobSlice from "./eagle/job-slice"
import authSlice from "./auth/auth-slice"
import { geneAPI } from "@/services/gene/gene"
import { paperApi } from "@/services/paper/paper"
import { eagleRelationshipsAPI } from "@/services/eagle/relationships"

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authSlice,
            jobs: jobSlice,
            [eagleAPI.reducerPath]: eagleAPI.reducer,
            [eagleReportAPI.reducerPath]: eagleReportAPI.reducer,
            [eagleCasesAPI.reducerPath]: eagleCasesAPI.reducer,
            [ensemblGeneAnnotationAPI.reducerPath]: ensemblGeneAnnotationAPI.reducer,
            [authAPI.reducerPath]: authAPI.reducer,
            [tasksAPI.reducerPath]: tasksAPI.reducer,
            [curationReviewAPI.reducerPath]: curationReviewAPI.reducer,
            [geneAPI.reducerPath]: geneAPI.reducer,
            [paperApi.reducerPath]: paperApi.reducer,
            [eagleRelationshipsAPI.reducerPath]: eagleRelationshipsAPI.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat([
                eagleAPI.middleware,
                eagleReportAPI.middleware,
                eagleCasesAPI.middleware,
                ensemblGeneAnnotationAPI.middleware,
                authAPI.middleware,
                tasksAPI.middleware,
                curationReviewAPI.middleware,
                geneAPI.middleware,
                paperApi.middleware,
                eagleRelationshipsAPI.middleware
            ]),
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

setupListeners(makeStore().dispatch)