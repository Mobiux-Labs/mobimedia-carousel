import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import './components/carousel/carousel';

@customElement('mobi-carousel')
export class MobiCarousel extends LitElement {
  static override styles = css`
    :host {
      box-sizing: border-box;
      padding: 1rem 0;
    }
  `;

  override render() {
    return html` <carousel-root></carousel-root> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mobi-carousel': MobiCarousel;
  }
}
