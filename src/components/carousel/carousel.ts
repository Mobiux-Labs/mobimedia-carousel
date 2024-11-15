import {LitElement, css, html, CSSResultGroup} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {getSlides} from '../../helpers/data';
import {SlideResponse} from '../../types';

// eslint-disable-next-line prefer-const
let styleSheet: CSSResultGroup;

@customElement('carousel-root')
export class Carousel extends LitElement {
  static override styles = styleSheet;

  @property({type: Object})
  data: SlideResponse;

  constructor() {
    super();
    this.data = {
      uuid: '',
      display_title: '',
      description: '',
      thumbnail: '',
      videos: [],
    };
  }

  override async firstUpdated() {
    this.data = await getSlides();
  }

  override render() {
    // If list is empty
    if (this.data.videos.length === 0) {
      return html``;
    }

    return html`
      <div class="main-carousel-wrapper">
        <!-- Main Swiper -->
        <div class="swiper swiper-mobimedia-container">
          <div class="swiper-wrapper" id="mobimedia-slides">
            <!-- Slides will be added dynamically -->
            ${this.data.videos.map(
              (item, _idx) => html` <p>${_idx}. ${item.url}</p> `
            )}
          </div>
          <!-- Swiper controls -->
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    `;
  }
}

styleSheet = css`
  @media screen and (max-width: 640px) {
    .swiper-mobimedia-container {
      /* height: var(--mobimedia-slide-height-mobile); */
      height: auto;
    }
    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }
  }

  @media screen and (min-width: 640px) {
    .swiper-mobimedia-container {
      /* height: var(--mobimedia-slide-height); */
      height: auto;
      padding: 0 30px;
    }
  }
`;
