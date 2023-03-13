import { property, query, state } from "lit/decorators.js";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { LitElement, html } from "lit";
import { TextField, Button } from '@scoped-elements/material-web'

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
        return html`
            <span style="margin-top: 7px;">Upload Meme file:</span>
            <input
            style="margin-top: 7px;"
            type="file"
            id="filepicker"
            accept=".png"
            @change=${this.loadFileBytes}
            >
            ${this.meme_image_src
                ? html`<img src="${this.meme_image_src}"/>`
                : html`<div
                    class="default-font"
                    style="color: #b10323; font-size: 12px; margin-left: 4px;"
                >
                    No file selected.
                </div>`
            }
            <mwc-textfield id="new-item-input" placeholder=${`new ${this.itemType}`}></mwc-textfield>
            <mwc-button outlined=true @click=${this.dispatchNewItem}>add+</mwc-button>
        `
    }

    loadFileBytes(e: any) {
        const files: FileList = e.target.files;
    
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e) {
            console.log("e target result is + e.target?.result");
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                    /*const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, img.width, img.height);
                    // return the .toDataURL of the temp canvas
                    this.meme_image_src = canvas.toDataURL();*/
            };
            const imgSrcTemp = e.target?.result;
            img.src = imgSrcTemp?imgSrcTemp.toString():"";
            /*const canvas = document.createElement("canvas");
                    canvas.width = 300;
                    canvas.height = 300;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    // return the .toDataURL of the temp canvas
                    this.meme_image_src = canvas.toDataURL();*/
            console.log ("img dot src is  + img.src");
            this.meme_image_src = img.src;
            console.log ("this dot meme image src is " + this.meme_image_src);
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
        const newValue = this.input.value;
        //const new_meme_image_src = this.meme_image_src;
        console.log("new meme image src is + this.meme_image_src");
        console.log("new value is " + this.input.value);
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

    static get scopedElements() {
        return {
            'mwc-textfield': TextField,
            'mwc-button': Button,
        }
    }
}
