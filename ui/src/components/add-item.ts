import { property, query, state } from "lit/decorators.js";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { LitElement, html,css } from "lit";
import { TextField, Button } from '@scoped-elements/material-web'
import { resizeAndExport } from "../../../node_modules/@holochain-open-dev/elements/dist/image";
//import { resizeAndExport } from "../../../node_modules/dist/@holochain-open-dev/elements/image";

export class AddItem extends ScopedElementsMixin(LitElement) {
    @property()
    itemType!: string

    @property()
    @state()
    meme_image_src: string = ''

    @property()
    @state()
    inputValue: string = ''

    @query('#new-item-input')
    input!: HTMLInputElement;

    render() {
        /*if (this.itemType != "Meme Category") {
            const formConst = document.getElementById("form1");
            if (!(formConst instanceof HTMLFormElement)) 
            throw new Error(`Expected formConst to be an HTMLFormElement, was ${formConst && formConst.constructor && formConst.constructor.name || formConst}`);
            formConst.reset(); 
        }*/
        if (this.itemType == "Meme Caption") {
            return html`
            <div class="container">
            <br/>
            <mwc-button outlined=true @click=${this.dispatchNewItem}>add+</mwc-button>
            <br/>
            <mwc-textfield id="new-item-input" placeholder=${`New ${this.itemType}`}></mwc-textfield>
            <br/>
            <form id="form1">
            <!--span style="margin-top: 7px;">Meme+</span-->
            <input
            style="margin-top: 7px;"
            type="file"
            id="filepicker"
            accept=".png"
            @change=${this.loadFileBytes}
            >
            ${this.meme_image_src
                ? html`<br/><img src="${this.meme_image_src}"/>`
                : html`<div
                    class="default-font"
                    style="color: #b10323; font-size: 12px; margin-left: 4px;"
                >
                    No file selected.
                </div>`
            }
            </form>
            </div>
        `
        } else {
            return html`
            <div class="container">
            <mwc-textfield id="new-item-input" placeholder=${`New ${this.itemType}`}></mwc-textfield>
            <br/>
            <mwc-button outlined=true @click=${this.dispatchNewItem}>add+</mwc-button>
            </div>
        `
        }

    }

    loadFileBytes(e: any) {
        const files: FileList = e.target.files;
    
        const reader = new FileReader();
        reader.onload = (ee) => {
          if (ee) {
            //console.log("ee target result is + ee.target?.result");
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                    /*const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, img.width, img.height);*/
                    // return the .toDataURL of the temp canvas
                    this.meme_image_src = resizeAndExport(img);
            };
            const imgSrcTemp = ee.target?.result;
            img.src = imgSrcTemp?imgSrcTemp.toString():"";
            /*const formConst = document.getElementById("form1");
            if (!(formConst instanceof HTMLFormElement)) 
            throw new Error(`Expected formConst to be an HTMLFormElement, was ${formConst && formConst.constructor && formConst.constructor.name || formConst}`);
            formConst.reset(); */
            //e.target.files = [];
            //console.log(e.target.files);
            /*const canvas = document.createElement("canvas");
                    canvas.width = 300;
                    canvas.height = 300;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    // return the .toDataURL of the temp canvas
                    this.meme_image_src = canvas.toDataURL();*/
            //console.log ("img dot src is"  + img.src);
            //this.meme_image_src = img.src;
            //console.log ("this dot meme image src is " + this.meme_image_src);
        }
        }
        reader.readAsDataURL(files[0]);
        // TODO! make typing right here
        reader.onloadend = (_e) => {

        }
      }

    updateInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.inputValue = input.value;
    }
    
    dispatchNewItem() {
        if((this.input.value && this.meme_image_src && this.itemType == "Meme Caption") || (this.input.value && this.itemType == "Meme Category")) {
            const newValue = this.input.value;
            //const new_meme_image_src = this.meme_image_src;
            //console.log("new meme image src is + this.meme_image_src");
            //console.log("new value is " + this.input.value);
            if (newValue) {
                const options = {
                    detail: {
                        newValue: newValue,
                        new_meme_image_src: this.meme_image_src,
                    }
                        , 
                    bubbles: true,
                    composed: true
                };
                this.dispatchEvent(new CustomEvent('new-item', options))
                this.input.value = ''
                this.meme_image_src = ''
            }
        }
    }

    static get scopedElements() {
        return {
            'mwc-textfield': TextField,
            'mwc-button': Button,
        }
    }
    static styles = css`
    .container {
        display: flex;
        flex-direction: column;
    }
`
}
