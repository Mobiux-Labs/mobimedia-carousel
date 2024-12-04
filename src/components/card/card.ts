import {LitElement, html, css} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {cardStyles} from './card-styles';
import {ProductData} from '../../types';

@customElement('card-slide')
export class Card extends LitElement {
  @property({type: Object}) product: ProductData | undefined;

  @query('#product-card') productCardElement!: HTMLElement;

  static override styles = [
    css`
      :host {
      }
    `,
    cardStyles,
  ];

  override render() {
    console.log('here22', this.product?.display_title);
    return html`
      <div id="product-card">
        <img id="product-thumbnail" src=${this.product?.thumbnail} />
        <div class="product-info">
          <div class="product-title">${this.product?.display_title}</div>
        </div>
      </div>
    `;
  }
}
