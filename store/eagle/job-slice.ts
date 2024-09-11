import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { EagleJob } from '@/types/eagle-job'

interface EagleJobs {
    jobs: EagleJob[],
    selectedJob: EagleJob | null,
}

const initialState: EagleJobs = {
    jobs: [],
    selectedJob: null
}

const jobSlice = createSlice({
    name: 'eagleJobs',
    initialState,
    reducers: {
        setJobs(state, action: PayloadAction<EagleJob[]>) {
            return {
                ...state,
                jobs: action.payload
            }
        },
        setSelectedJob(state, action: PayloadAction<EagleJob>) {
            return {
                ...state,
                selectedJob: action.payload
            }
        }
    },
})

export const { setJobs, setSelectedJob } = jobSlice.actions

export default jobSlice.reducer