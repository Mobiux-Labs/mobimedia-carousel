import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
// import Glide from '@glidejs/glide';
import '../lib/glide/glide.min.js';

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
      /* Glide styles */
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
      /* Overridden glide styles */
      .glide__slides {
        align-items: center;
      }
      .glide__slide {
        border: 1px solid black;
        display: flex;
        justify-content: center;
        overflow: hidden;
        height: auto;
        /* max-height: 25vh; */
      }
      .glide__arrows {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      /* Other styles */
      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
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

  @state()
  loading = false;

  protected override updated(_changedProperties: PropertyValues): void {
    console.log('_changedProperties', _changedProperties);
    if (_changedProperties.has('videos') && this.videos.length > 0) {
      const root = this.shadowRoot?.querySelector('.glide');
      new Glide(root, {
        type: 'carousel',
        perView: this.videos.length > 4 ? 5 : this.videos.length > 2 ? 3 : 1,
        focusAt: 'center',
        peek: 50,
      }).mount();
    }
  }

  private async getData() {
    this.loading = true;
    const response = await fetch(
      `https://app.dietpixels.com/api/v1/public/playlists/${this.playlist}`
    );
    const res = await response.json();
    console.log('res', res);
    this.videos = sampleResponse;
    this.loading = false;
  }
  private showCarouselItem(video: Video) {
    const ratioSplit = video.aspect_ratio.split(':');
    const aspectRatio = `${ratioSplit[0]}/${ratioSplit[1]}`;
    return html`<li class="glide__slide" style="aspect-ratio:${aspectRatio};">
      <img
        src=${video.thumbnail}
        class="slide-video"
        style="aspect-ratio:${aspectRatio};"
      />
    </li>`;
  }
  private showCarouselSlides() {
    return html`<ul class="glide__slides main-slider">
      ${this.videos.length > 0
        ? this.videos.map((video) => this.showCarouselItem(video))
        : this.showEmptyMessage()}
    </ul>`;
  }
  private showLoader() {
    return html`<div class="loading-container"><span>Loading</span></div>`;
  }
  private showEmptyMessage() {
    return html`<span>No data!</span>`;
  }
  private showArrows() {
    return html`<button class="glide__arrow glide__arrow--left" data-glide-dir="<">
              <
            </button>
            <button class="glide__arrow glide__arrow--right" data-glide-dir=">">
              >
            </button>
          </div>`;
  }
  private showCarouselComponent() {
    return html`<div class="glide">
      <div class="glide__track" data-glide-el="track">
        ${this.loading ? this.showLoader() : this.showCarouselSlides()}
      </div>
      <div class="glide__arrows" data-glide-el="controls">
        ${this.showArrows()}
      </div>
    </div>`;
  }
  override connectedCallback(): void {
    super.connectedCallback();
    this.getData();
  }
  override render() {
    return html`
      ${this.showCarouselComponent()}
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
