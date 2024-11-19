import {html, css, LitElement} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { playSharedVideo } from "../src/script"



@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {


  render() {
    return html`<p>Hello!</p>`;
  }
}
