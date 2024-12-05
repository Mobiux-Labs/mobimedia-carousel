import {LitElement, html, css} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {cardStyles} from './card-styles';
import {ProductData} from '../../types';
import {formatPrice} from '../../helpers/utils';
import redirectIcon from '../../../assets/images/redirect.svg';

@customElement('card-slide')
export class Card extends LitElement {
  @property({type: Object}) product: ProductData | undefined;

  static override styles = [
    css`
      :host {
      }
    `,
    cardStyles,
  ];

  handleShopNowClick(link: URL) {
    window.open(link, '_blank');
  }

  override render() {
    console.log('this.product', this.product);
    return html`
      <div id="product-card" style="display: flex;">
        <img id="product-thumbnail" src=${this.product?.thumbnail} />
        <div class="product-info">
          <img class="redirectIcon" src=${redirectIcon} @click="" />
          <div class="product-title">${this.product?.display_title}</div>

          <div class="product-description">${this.product?.description}</div>
          <div class="product-pricing">
            &#8377;&nbsp;${formatPrice(this.product?.display_price ?? 0)}
            ${this.product?.display_price !== this.product?.compare_price
              ? html`
                  <span
                    class="line-through"
                    style="margin-left: 4px; color: grey; text-decoration: line-through;"
                  >
                    &#8377;&nbsp;${formatPrice(
                      this.product?.compare_price ?? 0
                    )}
                  </span>
                `
              : ''}
          </div>
          <div>
            <button
              class="product-shop-now"
              @click=${() =>
                this.handleShopNowClick(new URL(this.product?.link ?? ''))}
            >
              Shop Now
            </button>
            <div></div>
          </div>
        </div>
      </div>
    `;
  }
}

// <img
//   class="product-cart"
//   src=${cartIcon}
//   @click=""
// />
