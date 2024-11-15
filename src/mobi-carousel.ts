import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import './components/carousel/carousel';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('mobi-carousel')
export class MobiCarousel extends LitElement {
  static override styles = css`
    :host {
      box-sizing: border-box;
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
