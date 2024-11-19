import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {SlideResponse, Video} from '../../types';

import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';

import {styleSheet} from './carousel-styles';
import {styleSheet as swiperStyleSheet} from '../shared_styles/swiper-styles';

import '../slide';
import {SlideClickEvent} from '../../helpers/events';

@customElement('carousel-root')
export class Carousel extends LitElement {
  static override styles = [swiperStyleSheet, styleSheet];

  private swiper?: Swiper;

  @query('.swiper-mobimedia-container')
  _ref_swiper_mobimedia_container!: HTMLElement;

  @query('.swiper-button-next')
  _ref_swiper_button_next!: HTMLElement;

  @query('.swiper-button-prev')
  _ref_swiper_button_prev!: HTMLElement;

  @property({type: Object})
  data!: SlideResponse;

  constructor() {
    super();
    // this.data = {
    //   uuid: '',
    //   display_title: '',
    //   description: '',
    //   thumbnail: '',
    //   videos: [],
    // };
  }

  override disconnectedCallback() {
    this.swiper?.destroy();
  }

  override async firstUpdated() {
    // this.data = await getSlides();
    setTimeout(() => {
      this.initSwiper();
    }, 0);
  }

  initSwiper() {
    this.swiper = new Swiper(this._ref_swiper_mobimedia_container, {
      modules: [Navigation],
      // Small screens
      slidesPerView: 1.5,
      loop: true,
      centeredSlides: true,
      breakpoints: {
        // Big screens
        768: {
          spaceBetween: 30,
          slidesPerView: 5.5,
          centeredSlides: this.data.videos.length <= 5 ? true : false,
          rewind: true,
          loop: false,
          initialSlide:
            this.data.videos.length <= 5 ? this.data.videos.length / 2 : 0,
          enabled: this.data.videos.length <= 5 ? false : true,
        },
      },
      // Navigation arrows
      navigation: {
        nextEl: this._ref_swiper_button_next,
        prevEl: this._ref_swiper_button_prev,
      },
    });
  }

  _slideOnClick(e: Event) {
    const slide_id = Number(
      (e.target as HTMLElement).getAttribute('data-index')
    );
    this.dispatchEvent(SlideClickEvent(slide_id));
  }

  render_slide(item: Video, idx: Number) {
    return html`
      <div class="swiper-slide main-swiper-slide">
        <video
          src="${item.thumbnail}"
          autoplay
          muted
          loop
          data-index=${idx}
          @click=${this._slideOnClick}
        ></video>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="main-carousel-wrapper">
        <!-- Main Swiper -->
        <div class="swiper swiper-mobimedia-container">
          <div class="swiper-wrapper" id="mobimedia-slides">
            <!-- Slides will be added dynamically -->
            ${this.data.videos.map(
              (item, _idx) => this.render_slide(item, _idx)
              // html` <carousel-slide .item=${item} .idx=${_idx} class="swiper-slide main-swiper-slide"></carousel-slide> `
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
