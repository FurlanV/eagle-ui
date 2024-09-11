export interface EagleJob {
  id: string
  job_id: string
  job_name: string
  status: string
  completed_at: string
  created_at: string
}

export interface Task {
  id: string
  task_id: string
  task_name: string
  status: string
  start_time: string
  end_time: string | null
  user_id: number
  progress_percentage: number
  current_service: string
  error_message: string | null
  steps: TaskStep[]
}

export interface TaskStep {
  id: string
  step_id: string
  step_name: string
  status: string
  output: string
  rating: number
}

export interface JobStatus {
  [service: string]: {
    status: string
    progress: number
  }
}

export interface FileStatus {
  [fileId: string]: {
    [service: string]: {
      status: string
      progress: number
    }
  }
}

export interface FileStep {
  name: string
  status: string
  output: string
  rating: number
  pipeline_run: {
    status: string
  }
}

export interface FileDetails {
  steps: FileStep[]
}