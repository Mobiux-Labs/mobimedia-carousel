import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {cardStyles} from './card-styles';
import {ProductData} from '../../types';
import {formatPrice} from '../../helpers/utils';
import redirectIcon from '../../../assets/images/redirect.svg';
import {ingestCall} from '../../helpers/utils';

@customElement('card-slide')
export class Card extends LitElement {
  @property({type: Object}) product: ProductData;
  @property({type: Boolean}) isSingleProduct = false;
  @property({type: String}) playlistId = '';
  @property({type: String}) userId = '';
  @state() sessionId = '';

  constructor(product: ProductData) {
    super();
    this.product = product;
  }

  static override styles = [
    css`
      :host {
      }
    `,
    cardStyles,
  ];

  handleShopNowClick(
    sessionId: string,
    productId: string,
    comparePrice: number,
    displayPrice: number,
    link: URL
  ) {
    window.open(link, '_blank');
    ingestCall('buy_now', {
      playlist_id: this.playlistId,
      session_id: sessionId,
      user_id: this.userId,
      product_id: productId,
      display_price: displayPrice * 100,
      compare_price: comparePrice * 100,
    });
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
                  this.product.uuid,
                  this.product.compare_price,
                  this.product.display_price,
                  new URL(this.product.link)
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
