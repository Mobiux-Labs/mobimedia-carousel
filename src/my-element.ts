import {LitElement, html, css, PropertyValues, render} from 'lit';
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
        height: 110%;
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
        opacity: 1;
      }
      .glide__slide {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        /* width: 300px !important; */
        height: 100%;
        max-height: 75vh;
      }
      .glide__slide .slide-video {
        height: 95%;
        border: 1px solid black;
        transition: height 0.2s;
      }
      .glide__slide--active {
        z-index: 999;
      }
      .glide__slide--active + .glide__slide {
        z-index: 998;
      }
      .glide__slide--active .slide-video {
        height: 100%;
      }
      .glide__arrows {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .glide__arrow {
        background-color: black;
        color: white;
        padding: 20px 10px;
        font-size: 2em;
        border: none;
      }

      /* Other styles */
      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      #modal {
        position: absolute;
        top: 0;
      }
      .modal-container {
        position: absolute;
        height: 100vh;
        width: 100vw;
        z-index: 99999;
        display: flex;
        justify-content: center;
      }
      .modal-carousel {
        display: flex;
        align-items: center;
        z-index: 99999;
        position: absolute;
        height: 100vh;
        width: 75vw;
      }
      .modal-background {
        position: absolute;
        opacity: 0.8;
        inset: 0;
        height: 100vh;
        width: 100vw;
        background-color: black;
        z-index: 99998;
      }
      .modal-close {
        z-index: 999999;
        color: white;
        position: absolute;
        background-color: black;
        border: none;
        cursor: pointer;
        right: 0;
        height: 20px;
        width: 20px;
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
  count: Number = 0;

  @property()
  playlist: String = '';

  @state()
  videos: Video[] = [];

  @state()
  loading = false;

  protected override updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('videos') && this.videos.length > 0) {
      const root = this.shadowRoot?.querySelector('.glide');
      new Glide(root, {
        type: 'carousel',
        perView: 5,
        focusAt: 'center',
        peek: 50,
        breakpoints: {
          768: {perView: 3, peek: 25},
        },
      }).mount();
    }
  }

  private async getData(): Promise<void> {
    this.loading = true;
    const response = await fetch(
      `https://app.dietpixels.com/api/v1/public/playlists/${this.playlist}`
    );
    const res = await response.json();
    this.videos = sampleResponse;
    this.loading = false;
  }
  private onItemClick(index: Number) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'modal';
    this.shadowRoot?.appendChild(modalDiv);
    const root = this.shadowRoot?.querySelector('#modal');

    const modal = html`<div class="modal-container">
      <button
        class="modal-close"
        @click=${() => {
          this.shadowRoot.removeChild(modalDiv);
          root.classList.remove('glide--ltr');
          root.classList.remove('glide--swipeable');
          root.classList.remove('glide--carousel');
        }}
      >
        X
      </button>
      <div class="modal-carousel">
        ${this.showCarouselComponent({mode: 'modal'})}
      </div>
      <div class="modal-background"></div>
    </div>`;
    render(modal, this.shadowRoot?.querySelector('#modal'));
    try {
      const perView = window.innerWidth < 768 ? 1 : 3;
      new Glide(root, {
        type: 'carousel',
        perView: perView,
        focusAt: 'center',
        // gap: -200,
        startAt: index,
      }).mount();
    } catch (e) {
      console.log(e);
    }
    // document.body.append(modal);
  }
  private showCarouselItem(video: Video, index: Number, options: object) {
    const ratioSplit = video.aspect_ratio.split(':');
    const aspectRatio = `${ratioSplit[0]}/${ratioSplit[1]}`;
    return html`<li
      class="glide__slide"
      style=${`aspect-ratio:${aspectRatio};`}
      @click=${() =>
        !options ? this.onItemClick(index) : options.mode === 'model' ? '' : ''}
    >
      <img
        src=${video.thumbnail}
        class="slide-video"
        style="aspect-ratio:${aspectRatio};"
      />
    </li>`;
  }
  private showCarouselSlides(options: object) {
    return html`<ul class="glide__slides main-slider">
      ${this.videos.length > 0
        ? this.videos.map((video, index) =>
            this.showCarouselItem(video, index, options)
          )
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
  private showCarouselComponent(options: object) {
    return html`<div class="glide">
      <div class="glide__track" data-glide-el="track">
        ${this.loading ? this.showLoader() : this.showCarouselSlides(options)}
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
      <!-- <div id="modal"></div> -->
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
