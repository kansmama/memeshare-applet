import { Task, WrappedEntry, WrappedTaskWithAssessment } from "./types";
import { Assessment } from "@neighbourhoods/sensemaker-lite-types";
import { encodeHashToBase64 } from "@holochain/client";

// this function is used to add assessments by the current agent to the tasks so that the 
// UI can display if the task has been assessed by the user
function addMyAssessmentsToTasks(myPubKey: string, tasks: WrappedEntry<Task>[], assessments: { [entryHash: string]: Array<Assessment> }): WrappedTaskWithAssessment[] {
  console.log("inside addMyAssessmentsToTasks tasks[0] is " + tasks[0])  
  if (tasks[0]) {
    console.log("inside addMyAssessmentsToTasks tasks[0].entry.description is " + tasks[0].entry.description)
    console.log("inside addMyAssessmentsToTasks tasks[0].entry.meme_image_srcis " + tasks[0].entry.meme_image_src)   
  }
  console.log("inside addMYAssessmentsToTasks");
  const tasksWithMyAssessments = tasks.map(task => {
      const assessmentsForTask = assessments[encodeHashToBase64(task.entry_hash)]
      console.log("inside addMyAssessmentsToTasks task meme image src is " + task.entry.meme_image_src)
      console.log("inside addMyAssessmentsToTasks task description is " + task.entry.description)
      let myAssessment
      if (assessmentsForTask) {
        myAssessment = assessmentsForTask.find(assessment => encodeHashToBase64(assessment.author) === myPubKey)
      }
      else {
        myAssessment = undefined
      }
      return {
        ...task,
        assessments: myAssessment,
      }
    })
    return tasksWithMyAssessments
  }

  export { addMyAssessmentsToTasks }