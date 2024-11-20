import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {getSlides} from './helpers/data';
import {SlideResponse} from './types';

import './components/carousel/carousel';
import './components/modal/modal';
import './components/modal_slide/modal_slide';
import {Carousel} from './components/carousel/carousel';
import {Modal} from './components/modal/modal';
import {ModalSlide} from './components/modal_slide/modal_slide';

import {SlideClickEvent} from './helpers/events';
import {removedURLParameter} from './helpers/utils';

@customElement('mobi-carousel')
export class MobiCarousel extends LitElement {
  static override styles = [
    css`
      :host {
        box-sizing: border-box;
        padding: 1rem 0;
      }
      .modal-carousal {
        width: min(100vw, 1080px);
      }
    `,
  ];

  @property({type: Object})
  data!: SlideResponse;

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

  override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('data')) {
      const params = new URLSearchParams(window.location.search);
      const videoID = params.get('carouselVid');
      const slide_index_of_video = this.data.videos.findIndex(
        (video) => video.uuid === videoID
      );
      if (videoID && slide_index_of_video >= 0)
        this._showModalWithSlide(slide_index_of_video);
    }
  }

  private _showModalWithSlide(slide_index: number) {
    const modal = this.shadowRoot?.querySelector('#modalView') as Modal;

    if (modal) {
      modal.visible = true;

      let slideElement = modal.querySelector(
        'carousel-modal-slide'
      ) as ModalSlide;
      if (!slideElement) {
        slideElement = document.createElement(
          'carousel-modal-slide'
        ) as ModalSlide;
        slideElement.className = 'modal-carousal';
        modal.appendChild(slideElement);
      }

      slideElement.data = this.data;
      slideElement.initial_slide_index = slide_index;
      slideElement.requestUpdate();
    }
  }

  _handleSlideClick(e: SlideClickEvent) {
    this._showModalWithSlide(e.detail.slide_index);
  }

  _handleModalClose() {
    console.log('Modal Close recognized');
    const modalSlideElement = this.shadowRoot?.querySelector(
      'carousel-modal-slide'
    ) as ModalSlide;
    if (!modalSlideElement) return;
    modalSlideElement.swiper?.destroy();
    const url = removedURLParameter(window.location.href, 'carouselVid');
    history.replaceState(null, '', url);
  }

  override render() {
    if (this.data.videos.length === 0) {
      return html``;
    }

    return html`
      <div>
        <carousel-root
          .data=${this.data}
          @onSlideClick=${this._handleSlideClick}
        ></carousel-root>
        <carousel-modal
          id="modalView"
          @modal-closed=${this._handleModalClose}
        ></carousel-modal>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mobi-carousel': MobiCarousel;
    'carousel-root': Carousel;
    'carousel-modal': Modal;
    'carousel-modal-slide': ModalSlide;
  }
}
