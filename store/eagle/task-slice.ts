import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Task } from '@/types/eagle-job'

interface Tasks {
    all: Task[],
    parent: Task | null,
    children: Task[],
    selectedChildren: Task | null,
}

const initialState: Tasks = {
    all: [],
    parent: null,
    children: [],
    selectedChildren: null
}

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks(state, action: PayloadAction<Task[]>) {
            return {
                ...state,
                all: action.payload
            }
        },
        setSelectedParent(state, action: PayloadAction<Task>) {
            return {
                ...state,
                parent: action.payload
            }
        },
    },
})

export const { setTasks, setSelectedParent } = taskSlice.actions

export default taskSlice.reducer