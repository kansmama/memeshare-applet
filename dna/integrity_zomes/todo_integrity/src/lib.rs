use hdi::prelude::*;
use crate::holo_hash::AgentPubKeyB64;

#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
    #[entry_def()]
    Task(Task),
}
#[hdk_entry_helper]
#[derive(Clone)]
pub struct Task {
    pub meme_image_src: String,
    pub description: String,
    pub status: TaskStatus,
    pub author: AgentPubKeyB64
}

#[derive(Debug, Clone, Serialize, Deserialize, SerializedBytes)]
pub enum TaskStatus {
  Complete,
  Incomplete,
}

#[hdk_link_types]
pub enum LinkTypes {
    ListToTask,
    ListNamePath,
}

#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
    Ok(ValidateCallbackResult::Valid)
}
