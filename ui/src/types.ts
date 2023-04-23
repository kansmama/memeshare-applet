import { ActionHash, EntryHash, AgentPubKeyB64 } from "@holochain/client"
import { Assessment } from "@neighbourhoods/sensemaker-lite-types"

interface Task {
    meme_image_src: string,
    description: string,
    status: TaskStatus,
    author: AgentPubKeyB64
}


type TaskStatus = TaskStatusComplete | TaskStatusIncomplete

interface TaskStatusComplete {
    Complete: null,
}

interface TaskStatusIncomplete {
    Incomplete: null,
}

interface TaskToListInput {
    input_meme_image_src: string,
    task_description: string,
    list: string,
    author: AgentPubKeyB64,
}

interface WrappedEntry<T> {
    action_hash: ActionHash,
    entry_hash: EntryHash,
    entry: T,
}
// defining a new type for including an assessment with the task
type WrappedTaskWithAssessment = WrappedEntry<Task> & {
    assessments: Assessment | undefined,
}

export {
    Task,
    TaskStatus,
    TaskStatusComplete,
    TaskStatusIncomplete,
    TaskToListInput,
    WrappedEntry,
    WrappedTaskWithAssessment,
}

export interface AppletConfig {
    dimensions: {
        [dimensionName: string]: EntryHash,
    },
    methods: {
        [methodName: string]: EntryHash,
    },
    contexts: {
        [contextName: string]: EntryHash,
    },
    contextResults: {
        [contextName: string]: Array<WrappedTaskWithAssessment>,
    }
}