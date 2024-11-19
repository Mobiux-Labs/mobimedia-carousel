import {LitElement, css, html} from 'lit';
import {customElement, query, property, state} from 'lit/decorators.js';

import {playActiveSlideVideo} from './modal_slide_helpers';
import {styleSheet} from './modal_slide-style';
import {styleSheet as swiperStyleSheet} from '../shared_styles/swiper-styles';
import {SlideResponse} from '../../types';

import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';

@customElement('carousel-modal-slide')
export class ModalSlide extends LitElement {
  static override styles = [
    // css`
    //   :host {
    //     box-sizing: border-box;
    //     padding: 1rem 0;
    //   }
    // `,
    swiperStyleSheet,
    styleSheet,
  ];

  private swiper?: Swiper;

  @query('.swiper-modal-container')
  _ref_swiper_modal_container!: HTMLElement;

  @query('.modal-next')
  _ref_swiper_button_next!: HTMLElement;

  @query('.modal-prev')
  _ref_swiper_button_prev!: HTMLElement;

  @property({type: Object})
  data!: SlideResponse;

  @property({type: Number})
  initial_slide_index!: Number;

  @state()
  swiperInitialized: boolean;

  constructor() {
    super();
    this.swiperInitialized = false;
  }

  override firstUpdated() {
    this.initSwiper();
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('initial_slide_index')) {
      if (this.swiper) {
        // this.swiper.slideTo(Number(this.initial_slide_index), 500);
        this.swiper.destroy();
        this.initSwiper();
      }
    }
  }

  initSwiper() {
    this.swiper = new Swiper(this._ref_swiper_modal_container, {
      modules: [Navigation],
      // Config for smaller screens
      slidesPerView: 1,
      centeredSlides: true,
      direction: 'vertical',
      initialSlide: Number(this.initial_slide_index), // Set the starting slide based on the clicked index
      longSwipes: false,
      navigation: {
        nextEl: this._ref_swiper_button_next,
        prevEl: this._ref_swiper_button_prev,
      },
      loop: false,
      breakpoints: {
        // Config for bigger screens
        640: {
          // autoHeight: true,
          slidesPerView: 3,
          spaceBetween: 0,
          direction: 'horizontal',
          rewind: true,
          loop: false,
          allowTouchMove: false,
        },
      },
      // Events
      on: {
        init: (swiper) => {
          // Playing the clicked video on initialization
          // Play video on initial active slide
          console.log('Swiper Init');
          this.swiperInitialized = false;
          playActiveSlideVideo(swiper, this.data);
        },
        destroy: () => {
          console.log('Swiper Destroyed');
        },
        update: () => {
          console.log('Swiper Updated');
        },
      },
    });
  }

  _handleVideoLike() {}
  _toggleMute() {}
  _handleVideoShare() {}

  render_slide() {
    return html`
      <div class="swiper-slide modal-swiper-slide">
        <div class="video-player-wrapper">
          <img
            id="muteButton"
            src="/assets/images/mute.png"
            @click=${this._toggleMute}
          />
          <div
            id="progressbar"
            class="progressbar"
            style="position:absolute;top:0"
          ></div>
          <img
            id="Like"
            class="like"
            src="/assets/images/heart-outlined.png"
            @click=${this._handleVideoLike}
          />
          <img
            id="Share"
            class="share"
            src="/assets/images/send.png"
            @click=${this._handleVideoShare}
          />
          <iframe
            class="video-player"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowfullscreen
            data-play="false"
          ></iframe>
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="swiper swiper-modal-container">
        <div class="swiper-wrapper" id="modal-slides">
          <!-- Slides will be added dynamically -->
          ${this.data.videos.map(
            (_item, _idx) => this.render_slide()
            // html` <carousel-slide .item=${item} .idx=${_idx} class="swiper-slide main-swiper-slide"></carousel-slide> `
          )}
        </div>
      </div>

      <!-- Swiper controls -->
      <div class="swiper-button-prev modal-prev"></div>
      <div class="swiper-button-next modal-next"></div>
    `;
  }
}
