import {LitElement, css, html} from 'lit';
import {customElement, query, property} from 'lit/decorators.js';

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

  @property({type: Boolean}) visible: boolean | undefined;

  @query('.modal') _ref_modal!: HTMLElement;

  constructor() {
    super();
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('visible')) {
      this._ref_modal.style.display = this.visible ? 'block' : 'none';
    }
  }

  _closeModal() {
    this.visible = false;
    // this.dispatchEvent(
    //   new Event('modal-closed', {bubbles: true, composed: true})
    // );
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
