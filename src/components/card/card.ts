import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {cardStyles} from './card-styles';
import {ProductData} from '../../types';
import {formatPrice} from '../../helpers/utils';
import redirectIcon from '../../../assets/images/redirect.svg';
import {ingestCallBuyNow} from '../../helpers/utils';

@customElement('card-slide')
export class Card extends LitElement {
  @property({type: Object}) product: ProductData | undefined;
  @property({type: Boolean}) isSingleProduct = false;
  @property({type: String}) playlistId = '';
  @property({type: String}) userId = '';
  @state() sessionId = '';

  static override styles = [
    css`
      :host {
      }
    `,
    cardStyles,
  ];

  handleShopNowClick(
    sessionId: string,
    productVid: string,
    comparePrice: number,
    displayPrice: number,
    link: URL
  ) {
    window.open(link, '_blank');
    ingestCallBuyNow(
      this.playlistId,
      productVid,
      Math.floor(displayPrice),
      Math.floor(comparePrice),
      sessionId,
      this.userId
    );
  }

  override render() {
    return html`
      <div
        id="product-card"
        class="${this.isSingleProduct ? 'single-product' : ''}"
      >
        <img id="product-thumbnail" src=${this.product?.thumbnail} />
        <div class="product-info">
          <img class="redirectIcon" src=${redirectIcon} @click="" />
          <div class="product-title">${this.product?.display_title}</div>
          <div class="product-pricing">
            ${Number(this.product?.display_price) === 0.0
              ? html`<span class="free-text">Free</span>`
              : html`
                  <span class="">
                    &#8377;${formatPrice(this.product?.display_price ?? 0)}
                  </span>
                  ${this.product?.display_price !== this.product?.compare_price
                    ? html`
                        <span
                          class="line-through"
                          style="margin-left: 4px; color: grey; text-decoration: line-through;"
                        >
                          &#8377;${formatPrice(
                            this.product?.compare_price ?? 0
                          )}
                        </span>
                      `
                    : ''}
                `}
          </div>
          <div>
            <button
              class="product-shop-now"
              @click=${() => {
                this.handleShopNowClick(
                  this.sessionId,
                  this.product?.uuid ?? '',
                  this.product?.compare_price ?? 0,
                  this.product?.display_price ?? 0,
                  new URL(this.product?.link ?? '')
                );
              }}
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
