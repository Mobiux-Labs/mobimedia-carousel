import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import {getSlides} from './helpers/data';
import {SlideResponse} from './types';

import './components/carousel/carousel';
import './components/modal/modal';
import './components/modal_slide/modal_slide';
import {Carousel} from './components/carousel/carousel';
import {Modal} from './components/modal/modal';
import {ModalSlide} from './components/modal_slide/modal_slide';

import {SlideClickEvent} from './helpers/events';

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

  _handleSlideClick(e: SlideClickEvent) {
    const modal = this.shadowRoot?.querySelector('#modalView') as Modal;

    if (modal) {
      modal.visible = true;

      // Create a new carousel-modal-slide element
      let slideElement = modal.querySelector(
        'carousel-modal-slide'
      ) as ModalSlide;
      if (!slideElement) {
        // Create a new carousel-modal-slide element if it doesn't exist
        slideElement = document.createElement(
          'carousel-modal-slide'
        ) as ModalSlide;
        slideElement.className = 'modal-carousal';
        slideElement.data = this.data;
        slideElement.initial_slide_index = e.detail.slide_index; // Set the initial slide index

        // Append the new slide element to the modal
        modal.appendChild(slideElement);
      } else {
        // Update the existing slide element's data and initial slide index
        slideElement.data = this.data;
        slideElement.initial_slide_index = e.detail.slide_index;
      }
    }
  }

  override async firstUpdated() {
    this.data = await getSlides();
  }

  _handleModalClose() {
    console.log('Modal Close recognised');
    const modalSlideElement = this.shadowRoot?.querySelector(
      'carousel-modal-slide'
    ) as ModalSlide;
    if (!modalSlideElement) return;
    modalSlideElement.swiper?.destroy();
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
