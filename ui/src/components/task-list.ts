import { contextProvided } from "@lit-labs/context";
import { property, query, state } from "lit/decorators.js";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { LitElement, html, css } from "lit";
import { TaskItem } from "./task-item";
import { sensemakerStoreContext, todoStoreContext } from "../contexts";
import { TodoStore } from "../todo-store";
import { get } from "svelte/store";
import { AddItem } from "./add-item";
import { List } from '@scoped-elements/material-web'
import { SensemakerStore } from "@neighbourhoods/nh-we-applet";
import { CreateAssessmentInput, RangeValueInteger,RangeValue } from "@neighbourhoods/sensemaker-lite-types";
import { addMyAssessmentsToTasks } from "../utils";
import { UploadMemeDialog } from "./upload-meme-dialog";
import {
    Fab
  } from "@scoped-elements/material-web";
import { SlTooltip } from "@scoped-elements/shoelace";


// add item at the bottom
export class TaskList extends ScopedElementsMixin(LitElement) {
    @contextProvided({ context: todoStoreContext, subscribe: true })
    @property({attribute: false})
    public  todoStore!: TodoStore

    @contextProvided({ context: sensemakerStoreContext, subscribe: true })
    @property({attribute: false})
    public  sensemakerStore!: SensemakerStore

    @property()
    isContext!: boolean

    @property()
    listName: string | undefined

    @state()
    tasks = html``

    @query("#upload-meme-dialog")
    _uploadMemeDialog!: UploadMemeDialog;

    render() {
        this.updateTaskList()
        if (this.isContext) {
            return html`

            <!--COMMENTED OUT------
             upload-meme-dialog
            @meme-added=${(e:any) => (this.listName = this.listName)/*this.handleWeGroupAdded(e)*/}
            @uploading-meme=${(e:any) => (this.listName = this.listName)/*this.showLoading()*/}
            @new-item=${this.addNewTask}
            id="upload-meme-dialog"
          ></upload-meme-dialog>
            <sl-tooltip placement="right" content="Upload Meme" hoist>
            <mwc-fab
              icon="group_add"
              @click=${() => this._uploadMemeDialog.open()}
              style="margin-top: 4px; --mdc-theme-secondary: #9ca5e3;"
            ></mwc-fab>
          </sl-tooltip 
          -------COMMENTED OUT-->

                <div class="home-page">
                    <mwc-list>
                        ${this.tasks}
                    </mwc-list>
                </div>
            `
        }
        else {
            if(this.listName) {
                return html`
                    <div class="task-list-container">
                        <add-item itemType="Meme Caption" @new-item=${this.addNewTask}></add-item>
                    </div>
                    <div class="home-page">
                        <mwc-list>
                            ${this.tasks}
                        </mwc-list>
                    </div>
                `                
            } else {
            return html`
                <div>select a meme category on the left!</div>
            `
            }
        }
    }
    async addNewTask(e: CustomEvent) {
       //console.log ("in add new task new meme image src is  + e.detail.new_meme_image_src")
       console.log("in add new task new value is " + e.detail.newValue)
        await this.todoStore.addTaskToList({
        input_meme_image_src: e.detail.new_meme_image_src,
        task_description: e.detail.newValue,
        list: this.listName!,
    })
        await this.todoStore.fetchAllTasks
        this.updateTaskList()
    }
    updateTaskList() {
        // check if displaying a context or not
        //console.log("inside updateTaskList");
        //<task-item .task=${task} .completed=${('Complete' in task.entry.status)} .taskIsAssessed=${task.assessments != undefined} @toggle-task-status=${this.toggleTaskStatus}  @assess-task-item=${this.assessTaskItem}></task-item> 
        //Below logic: Using myAssessment's assessment value to turn taskIsAssessed true or false. Doesn't work as assessment doesn't get updated.
        //<task-item .task=${task} .completed=${('Complete' in task.entry.status)} .taskIsAssessed=${(task.assessments != undefined)?(("Integer" in task.assessments.value)?(task.assessments.value.Integer != 0):false):false} @toggle-task-status=${this.toggleTaskStatus} @assess-task-item=${this.assessTaskItem}></task-item>
        //Below logic: prints the value of assessment value Integer current user gave.
        //<b>taskIsAssessed is ${(task.assessments != undefined)?(("Integer" in task.assessments.value)?(task.assessments.value.Integer):false):false} .</b>
        if (this.listName && !this.isContext) {
            const tasksWithAssessments = addMyAssessmentsToTasks(this.todoStore.myAgentPubKey, get(this.todoStore.listTasks(this.listName)), get(this.sensemakerStore.resourceAssessments()));
            this.tasks = html`
            ${tasksWithAssessments.map((task) => html`
                             
            <task-item .task=${task} .completed=${('Complete' in task.entry.status)} .taskIsAssessed=${task.assessments != undefined} @toggle-task-status=${this.toggleTaskStatus}  @assess-task-item=${this.assessTaskItem}></task-item> 
                <font color = #ffffff ><b>_________________________</b></font>
            `)}
            

          
            `
            /*console.log('tasks in list, with assessment', tasksWithAssessments)
                        <!--COMMENTED OUT------
             add-item itemType="Meme Caption" @new-item=${this.addNewTask}></add-item>
            <upload-meme-dialog
            @meme-added=${(e:any) => (this.listName = this.listName)/*this.handleWeGroupAdded(e)}
            @uploading-meme=${(e:any) => (this.listName = this.listName)/*this.showLoading()}
            @new-item=${this.addNewTask}
            id="upload-meme-dialog"
          ></upload-meme-dialog>
            <sl-tooltip placement="right" content="Upload Meme" hoist>
            <mwc-fab
              icon="group_add"
              @click=${() => this._uploadMemeDialog.open()}
              style="margin-top: 4px; --mdc-theme-secondary: #9ca5e3;"
            ></mwc-fab>
          </sl-tooltip 
          ---------COMMENTED OUT-->*/
        }
        else if (this.isContext) {
            console.log('context result', get(this.sensemakerStore.contextResults()))
            const tasksInContext = addMyAssessmentsToTasks(this.todoStore.myAgentPubKey, get(this.todoStore.tasksFromEntryHashes(get(this.sensemakerStore.contextResults())["most_important_tasks"])), get(this.sensemakerStore.resourceAssessments()));
            var zeroRangeValue:RangeValueInteger = {Integer:0};
            this.tasks = html`
            ${tasksInContext.map((task) => 
                /*{
                   console.log(typeof task.assessments?.value);
                    // const isRangeValueInteger = (r: RangeValue | RangeValueInteger): r is RangeValueInteger => 'Integer' in r;
                    const rangeValueVar = (task.assessments)?task.assessments.value:zeroRangeValue;*/
                   // const rangeValueIntVar: RangeValueInteger = ((task.assessments)?task.assessments.value:zeroRangeValue).filter( isRangeValueInteger );
                
                //var rangeValueIntVar:RangeValueInteger = (task.assessments)?task.assessments.value:zeroRangeValue;
                //<!--task-item .task=${task} .completed=${('Complete' in task.entry.status)} .taskIsAssessed=${(task.assessments != undefined)?(rangeValueVar):false} @toggle-task-status=${this.toggleTaskStatus}></task-item--> 
                //<task-item .task=${task} .completed=${('Complete' in task.entry.status)} .taskIsAssessed=${(task.assessments != undefined)} @toggle-task-status=${this.toggleTaskStatus}></task-item>
                //Below logic: Using myAssessment's assessment value to turn taskIsAssessed true or false. Doesn't work as assessment doesn't get updated.
                //<task-item .task=${task} .completed=${('Complete' in task.entry.status)} .taskIsAssessed=${(task.assessments != undefined)?(("Integer" in task.assessments.value)?(task.assessments.value.Integer != 0):false):false} @toggle-task-status=${this.toggleTaskStatus} @assess-task-item=${this.assessTaskItem}></task-item>
                //Below logic: prints the value of assessment value Integer current user gave.
                //<b>taskIsAssessed is ${(task.assessments != undefined)?(("Integer" in task.assessments.value)?(task.assessments.value.Integer):false):false} .</b>                
                html`
               
                <task-item .task=${task} .completed=${('Complete' in task.entry.status)} .taskIsAssessed=${(task.assessments != undefined)} @toggle-task-status=${this.toggleTaskStatus} @assess-task-item=${this.assessTaskItem}></task-item>
                <font color = #ffffff ><b>_________________________</b></font>
            `
                //}
            )}
            `
        }
    }
    async toggleTaskStatus(e: CustomEvent) {
        await this.todoStore.toggleTaskStatus(this.listName!, e.detail.task)
        this.updateTaskList()
    }
    async assessTaskItem(e: CustomEvent) {
        //console.log(e.detail.task)
        var assessmentValue:int = 1;
        if (e.detail.taskIsAssessedInput) {
            assessmentValue = 0
        }
        const assessment: CreateAssessmentInput = {
            value: {
                Integer: assessmentValue
            },
            // this is one of the main reasons we store the applet config in the sensemaker store, so that we can access
            // the entry hashes we need
            dimension_eh: get(this.sensemakerStore.appletConfig()).dimensions["importance"],
            subject_eh: e.detail.task.entry_hash,
            maybe_input_dataSet: null,

        }
        const assessmentEh = await this.sensemakerStore.createAssessment(assessment)
        const objectiveAssessmentEh = await this.sensemakerStore.runMethod({
            resource_eh: e.detail.task.entry_hash,
            method_eh: get(this.sensemakerStore.appletConfig()).methods["total_importance_method"],
        })
        console.log('created assessment with assessmentValue');
        console.log( ("Integer" in assessment.value)?assessment.value.Integer:4);
        //console.log('created objective assessment', objectiveAssessmentEh)
    }
    static get scopedElements() {
        return {
        'task-item': TaskItem,
        "upload-meme-dialog": UploadMemeDialog,
        "mwc-fab": Fab,
        'add-item': AddItem,
        'mwc-list': List,
        "sl-tooltip": SlTooltip,
        };
    }
    /*static styles = css`
    .task-list-container {
        display: flex;
        flex-direction: column;
    }
    `*/
    static styles = css`
    .task-list-container {
        display: flex;
        flex-direction: column;
    }
    .home-page {
    display: flex;
    flex-direction: row;
    }  

    :host {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-size: calc(10px + 2vmin);
    color: #1a2b42;
    max-width: 960px;
    margin: 0 auto;
    text-align: center;
    background-color: var(--lit-element-background-color);
    }

    main {
    flex-grow: 1;
    }

    .app-footer {
    font-size: calc(12px + 0.5vmin);
    align-items: center;
    }

    .app-footer a {
    margin-left: 5px;
    }
    `;
}
