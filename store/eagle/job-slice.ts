import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { EagleJob } from '@/types/eagle-job'

const initialState: EagleJob[] = []

const eagleSlice = createSlice({
    name: 'eagleJobs',
    initialState,
    reducers: {
        setJobs(state, action: PayloadAction<EagleJob[]>) {
            return action.payload
        },
    },
})

export const { setJobs } = eagleSlice.actions

export default eagleSlice.reducer