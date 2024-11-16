import {LitElement, css, html} from 'lit';
import {customElement, query} from 'lit/decorators.js';

import {styleSheet} from './modal-styles';

@customElement('carousel-modal')
export class Modal extends LitElement {
  static override styles = [
    css`
      :host {
        box-sizing: border-box;
        padding: 1rem 0;
      }
    `,
    styleSheet,
  ];

  @query('.modal')
  _ref_modal!: HTMLElement;

  _closeModal() {
    this.dispatchEvent(
      new Event('modal-closed', {bubbles: true, composed: true})
    );
  }

  override render() {
    return html`
      <div id="myModal" class="modal">
        <div class="modal-overlay"></div>
        <slot class="modal-content"> </slot>
        <span class="close" @click="${this._closeModal}">&times;</span>
      </div>
    `;
  }
}
