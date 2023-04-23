import { contextProvided } from "@lit-labs/context";
import { property, state } from "lit/decorators.js";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { LitElement, html, css } from "lit";
import { WrappedTaskWithAssessment } from "../types";
import { Checkbox, ListItem, CheckListItem } from '@scoped-elements/material-web'
import { sensemakerStoreContext } from "../contexts";
import { SensemakerStore } from "@neighbourhoods/nh-we-applet";

export class TaskItem extends ScopedElementsMixin(LitElement) {
    @contextProvided({ context: sensemakerStoreContext, subscribe: true })
    @property({attribute: false})
    public  sensemakerStore!: SensemakerStore

    @property()
    completed: boolean = false

    @property()
    @state()
    task!: WrappedTaskWithAssessment

    @property()
    @state()
    taskIsAssessed = false

    static styles = css`
          .task-item-container {
            display: flex;
            flex-direction: column;
          }
        `;

    render() {
        //console.log("inside task item - completed: " + this.completed)
        //console.log("inside task item - task description: " + this.task.entry.description)
        //console.log("inside task item - task meme image src: " + this.task.entry.meme_image_src)
        return html`
            <head>    
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <style>
            .fa-thumbs-down {
            font-size: 40px;
            cursor: pointer;
            user-select: none;
            color: red;
            }


            .fa-thumbs-down:hover {
            color: green;
            }
            .fa-thumbs-up {
                font-size: 40px;
                cursor: pointer;
                user-select: none;
                color: green;
                }
            </style>
            </head>
            <body>
            <div class="task-item-container">
            <!--mwc-check-list-item left ?selected=${this.completed} @click=${this.dispatchToggleStatus}>${this.task.entry.description}</mwc-check-list-item-->
            <label>${this.task.entry.description}</label><br/>
            <img src="${this.task.entry.meme_image_src}"/>
            </div>
            ${this.taskIsAssessed
                ? html`<i ?disabled=${this.taskIsAssessed} ?checked=${this.taskIsAssessed} @click=${this.dispatchAssessTask} class="fa fa-thumbs-up"></i>`
                : html`<i ?disabled=${this.taskIsAssessed} ?checked=${this.taskIsAssessed} @click=${this.dispatchAssessTask} class="fa fa-thumbs-down"></i>`
            }
            </body>
        `
    }
    dispatchToggleStatus() {
        const task = this.task;
        if (task) {
            const options = {
                detail: {
                    task,
                },
                bubbles: true,
                composed: true
            };
            this.dispatchEvent(new CustomEvent('toggle-task-status', options))
        }
    }
    dispatchAssessTask() {
        console.log('clicked!', this.taskIsAssessed)
        /*var icon = this.querySelector("i");
        icon?.classList.toggle('fa-thumbs-up');
        icon?.classList.toggle('fa-thumbs-down');*/
        if(!this.taskIsAssessed) {
            const task = this.task;
            var taskIsAssessedInput:Boolean = this.taskIsAssessed;
            if (task) {
                const options = {
                    detail: {
                        task,
                        taskIsAssessedInput,
                    },
                    bubbles: true,
                    composed: true
                };
                this.dispatchEvent(new CustomEvent('assess-task-item', options))
            }
            this.taskIsAssessed = !this.taskIsAssessed
            console.log('taskisAssessed changed to', this.taskIsAssessed);
            //x.classList.toggle("fa-thumbs-down");
        }
    }

    static get scopedElements() {
        return {
            'mwc-checkbox': Checkbox,
            'mwc-list-item': ListItem,
            'mwc-check-list-item': CheckListItem,
        }
    }
}
