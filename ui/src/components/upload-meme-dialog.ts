import { html, css, LitElement, PropertyValueMap } from "lit";
import { state, query, property } from "lit/decorators.js";

import { contextProvided } from "@lit-labs/context";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { Dialog, TextField, Button } from "@scoped-elements/material-web";
import { SelectAvatar } from "@holochain-open-dev/elements";

//import { matrixContext } from "../../context";
//import { MatrixStore } from "../../matrix-store";
import { sharedStyles } from "../sharedStyles";
import { resizeAndExport } from "../../../node_modules/@holochain-open-dev/elements/dist/image";

/**
 * @element we-applet
 */
export class UploadMemeDialog extends ScopedElementsMixin(LitElement) {
  /** Dependencies */
  //@contextProvided({ context: matrixContext, subscribe: true })
  //_matrixStore!: MatrixStore;

  async open() {
    this._name = "";
    this._logoSrc = "";
    this._dialog.show();
  }

  /** Private properties */
  @query("#dialog")
  _dialog!: Dialog;
  @query("#name-field")
  _nameField!: HTMLInputElement;
  @query("#select-avatar")
  _avatarField!: SelectAvatar;
  @state()
  _name: string | undefined;
  @state()
  _logoSrc: string | undefined;

  private async handleOk(e: any) {
    // if statement is required to prevent ENTER key to close the dialog while the button is disabled
    if (this._name && this._logoSrc) {
      this._dialog.close();
      this.dispatchEvent(new CustomEvent("uploading-meme", {})); // required to display loading screen in the dashboard
      const newValue = this._name;
      //const new_meme_image_src = this.meme_image_src;
      //console.log("new meme image src is + this.meme_image_src");
      //console.log("new value is " + this._name);
      if (newValue) {
          const options = {
              detail: {
                  newValue: newValue,
                  new_meme_image_src: this._logoSrc,
              }
                  , 
              bubbles: true,
              composed: true
          };
          this.dispatchEvent(new CustomEvent('new-item', options))
          this._name = ''
          this._logoSrc = ''
      }
      //const weId = await this._matrixStore.createWeGroup(this._name!, this._logoSrc!);

      this.dispatchEvent(
        new CustomEvent("meme-added", {
          /*detail: weId,
          bubbles: true,
          composed: true,*/
        })
      );
      this._nameField.value = "";
      this._avatarField.clear();
    }
  }

  private async resizeImg(e: any) {
    //this._logoSrc = e.detail.avatar;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
            /*const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, img.width, img.height);*/
            // return the .toDataURL of the temp canvas
            this._logoSrc = resizeAndExport(img);
    };
    img.src = e.detail.avatar;
  }

  render() {
    return html`
      <mwc-dialog id="dialog" heading="Upload Meme">
        <div class="row" style="margin-top: 16px">
          <select-avatar
            id="select-avatar"
            @avatar-selected=${(e:any) => (this.resizeImg(e))}
          ></select-avatar>

          <mwc-textfield
            @input=${(e:any) => (this._name = e.target.value)}
            style="margin-left: 16px"
            id="name-field"
            label="Caption"
            autoValidate
            required
            outlined
          ></mwc-textfield>
        </div>

        <mwc-button slot="secondaryAction" dialogAction="cancel">
          cancel
        </mwc-button>
        <mwc-button
          id="primary-action-button"
          slot="primaryAction"
          .disabled=${!this._name || !this._logoSrc}
          @click=${this.handleOk}
        >
          ok
        </mwc-button>
      </mwc-dialog>
    `;
  }
  static get scopedElements() {
    return {
      "select-avatar": SelectAvatar,
      "mwc-button": Button,
      "mwc-dialog": Dialog,
      "mwc-textfield": TextField,
    };
  }
  static get styles() {
    return [
      sharedStyles,
      css`
        mwc-textfield {
          margin-top: 10px;
        }
      `,
    ];
  }
}
