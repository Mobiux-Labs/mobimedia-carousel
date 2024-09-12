import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import Glide from '@glidejs/glide';

import sampleResponse from '../public/sampleResponse.js';
interface Product {
  uuid: string;
  link: string;
  display_title: string;
  description: string;
  thumbnail: string;
  display_price: string;
  compare_price: string;
  is_out_of_stock: boolean;
}
interface Video {
  uuid: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;

  products: Product[];
  height: number;
  width: number;
  aspect_ratio: string;
}
/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static override styles = [
    css`
      :host {
      }
      .glide {
        position: relative;
        width: 100%;
        box-sizing: border-box;
      }
      .glide * {
        box-sizing: inherit;
      }
      .glide__track {
        overflow: hidden;
      }
      .glide__slides {
        position: relative;
        width: 100%;
        list-style: none;
        backface-visibility: hidden;
        transform-style: preserve-3d;
        touch-action: pan-Y;
        overflow: hidden;
        margin: 0;
        padding: 0;
        white-space: nowrap;
        display: flex;
        flex-wrap: nowrap;
        will-change: transform;
      }
      .glide__slides--dragging {
        user-select: none;
      }
      .glide__slide {
        width: 100%;
        height: 100%;
        flex-shrink: 0;
        white-space: normal;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      .glide__slide a {
        user-select: none;
        -webkit-user-drag: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      .glide__arrows {
        -webkit-touch-callout: none;
        user-select: none;
      }
      .glide__bullets {
        -webkit-touch-callout: none;
        user-select: none;
      }
      .glide--rtl {
        direction: rtl;
      }

      /*# sourceMappingURL=output.css.map */
    `,
  ];

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0;

  @property()
  playlist = '';

  @state()
  videos: Video[] = [];

  protected override updated(_changedProperties: PropertyValues): void {
    console.log('_changedProperties', _changedProperties);
    if (_changedProperties.has('videos') && this.videos.length > 0) {
      const root = this.shadowRoot?.querySelector('.glide');
      new Glide(root, {
        type: 'carousel',
        perView: 3,
      }).mount();
    }
  }

  private async getData() {
    const response = await fetch(
      `https://app.dietpixels.com/api/v1/public/playlists/${this.playlist}`
    );
    const res = await response.json();
    console.log('res', res);
    this.videos = sampleResponse;
  }
  private getVideoElement(video) {
    const slider = this.shadowRoot?.querySelector('.main-slider');
    const li = document.createElement('li');
    li.classList.add('glide__slide');
    li.textContent = video.title;
    slider?.appendChild(li);
    // <li class="glide__slide">${video.title}</li>
  }
  override connectedCallback(): void {
    super.connectedCallback();
    this.getData();
  }
  override render() {
    return html`
      <div class="glide">
        <div class="glide__track" data-glide-el="track">
          <ul class="glide__slides main-slider">
            ${this.videos.map(
              (video) => html`<li class="glide__slide">
                <!-- ${video.title} -->
                <img
                  src="https://cdn.printshoppy.com/image/cache/catalog/product-image/mobile-cases/google-pixel-xl/google-pixel-xl-304-600x800.jpg"
                />
              </li>`
            )}
            <!-- <li class="glide__slide">0</li>
            <li class="glide__slide">1</li>
            <li class="glide__slide">2</li> -->
          </ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
          <button class="glide__arrow glide__arrow--left" data-glide-dir="<">
            prev
          </button>
          <button class="glide__arrow glide__arrow--right" data-glide-dir=">">
            next
          </button>
        </div>
      </div>
      <slot></slot>
    `;
  }

  /**
   * Formats a greeting
   * @param name The name to say "Hello" to
   */
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
