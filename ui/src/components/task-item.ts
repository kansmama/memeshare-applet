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
    
    @property()
    @state()
    memeLiked = false

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
        /* Earlier CSS code with single like button
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

            Earlier html code with single Like button
            ${this.taskIsAssessed
                ? html`<i ?disabled=${this.taskIsAssessed} ?checked=${this.taskIsAssessed} @click=${this.dispatchAssessTask} class="fa fa-thumbs-up"></i>`
                : html`<i ?disabled=${this.taskIsAssessed} ?checked=${this.taskIsAssessed} @click=${this.dispatchAssessTask} class="fa fa-thumbs-down"></i>`
            } 
            Earlier tag for mwc-check-list-item commented outs
            <!--mwc-check-list-item left ?selected=${this.completed} @click=${this.dispatchToggleStatus}>${this.task.entry.description}</mwc-check-list-item-->
            Earlier colo scheme for Like / Unlike
                          .active {
                color: #2EBDD1;
              }
        */
        return html`
            <head>    
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <style>
            .rating {
                display: inline-block;
                width: 100%;
                margin-top: 2px;
                padding-top: 2px;
                text-align: center;
              }
              
              .like,
              .dislike {
                display: inline-block;
                cursor: pointer;
                margin: 10px;
              }
              
              .dislike:hover {
                color: darkred;
                transition: all .2s ease-in-out;
                transform: scale(1.1);
              }
              .like:hover {
                color: darkgreen;
                transition: all .2s ease-in-out;
                transform: scale(1.1);
              }
              
              .activelike {
                color: darkgreen;
                display: inline-block;
                cursor: pointer;
                margin: 10px;
              }
              .activedislike {
                color: darkred;
                display: inline-block;
                cursor: pointer;
                margin: 10px;
              }
              .inactivelike {
                display: inline-block;
                cursor: pointer;
                margin: 10px;
              }
              .inactivedislike {
                display: inline-block;
                cursor: pointer;
                margin: 10px;
              }
            </style>
            </head>
            <body>
            <div class="task-item-container">
            
            <label>${this.task.entry.description}</label><br/>
            <img src="${this.task.entry.meme_image_src}"/>
            </div>
            ${(this.taskIsAssessed && this.memeLiked)
                ? html`
                <div class="rating">
                    <!-- Thumbs down -->
                    <div class="inactivedislike">
                    <i class="fa fa-thumbs-down fa-3x inactivedislike" aria-hidden="true"></i>
                    </div>
                    <!-- Thumbs up -->
                    <div class="activelike">
                    <i class="fa fa-thumbs-up fa-3x activelike" aria-hidden="true"></i>
                    </div>
                </div>
                `
                : html``
            }
            ${(this.taskIsAssessed && !this.memeLiked)
                ? html`
                <div class="rating">
                    <!-- Thumbs down -->
                    <div class="activedislike">
                    <i class="fa fa-thumbs-down fa-3x activedislike" aria-hidden="true"></i>
                    </div>
                    <!-- Thumbs up -->
                    <div class="inactivelike">
                    <i class="fa fa-thumbs-up fa-3x inactivelike" aria-hidden="true"></i>
                    </div>
                </div>
                `
                : html``
            }
            ${!this.taskIsAssessed
                ? html`
                <div class="rating">
                    <!-- Thumbs down -->
                    <div @click=${this.dispatchUnlikeMeme} class="dislike grow">
                    <i class="fa fa-thumbs-down fa-3x dislike" aria-hidden="true"></i>
                    </div>
                    <!-- Thumbs up -->
                    <div @click=${this.dispatchLikeMeme} class="like grow">
                    <i class="fa fa-thumbs-up fa-3x like" aria-hidden="true"></i>
                    </div>
                </div>
                `
                : html``
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
        console.log('clicked dispatchAssessTask!', this.taskIsAssessed)
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
    async dispatchUnlikeMeme() {
        console.log('clicked dispatchUnlikeMeme!', this.taskIsAssessed + "memeLiked?" + true)
        /*var icon = this.querySelector("i");
        icon?.classList.toggle('fa-thumbs-up');
        icon?.classList.toggle('fa-thumbs-down');*/
        if(!this.taskIsAssessed) {
            const task = this.task;
            const memeLikedInput = 0;
            if (task) {
                const options = {
                    detail: {
                        task,
                        memeLikedInput,
                    },
                    bubbles: true,
                    composed: true
                };
                await this.dispatchEvent(new CustomEvent('like-meme-item', options))
            }
            this.taskIsAssessed = !this.taskIsAssessed
            this.memeLiked = false
            console.log('dispatchUnlikeMeme taskisAssessed changed to', this.taskIsAssessed);
            //x.classList.toggle("fa-thumbs-down");
        }
    }    
    dispatchLikeMeme() {
        console.log('clicked dispatchLikeMeme!' + this.taskIsAssessed + "memeLiked?" + true)
        /*var icon = this.querySelector("i");
        icon?.classList.toggle('fa-thumbs-up');
        icon?.classList.toggle('fa-thumbs-down');*/
        const memeLikedInput = 1;
        if(!this.taskIsAssessed) {
            const task = this.task;
            if (task) {
                const options = {
                    detail: {
                        task,
                        memeLikedInput,
                    },
                    bubbles: true,
                    composed: true
                };
                this.dispatchEvent(new CustomEvent('like-meme-item', options))
            }
            this.taskIsAssessed = !this.taskIsAssessed
            this.memeLiked = true
            console.log('dispatchLikeMeme taskisAssessed changed to', this.taskIsAssessed);
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
