import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import {getSlides} from './helpers/data';
import {SlideResponse} from './types';

import './components/carousel/carousel';
import './components/modal';
import {Carousel} from './components/carousel/carousel';

import {SlideClickEvent} from './helpers/events';

@customElement('mobi-carousel')
export class MobiCarousel extends LitElement {
  static override styles = [
    css`
      :host {
        box-sizing: border-box;
        padding: 1rem 0;
      }
    `,
  ];

  @property({type: Object})
  data!: SlideResponse;

  @state()
  _isModalOpen = false;

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

  _handleModalClosed() {
    this._isModalOpen = false;
  }

  _handleSlideClick(e: SlideClickEvent) {
    this._isModalOpen = true;
  }

  override async firstUpdated() {
    this.data = await getSlides();
  }

  render_modal() {
    if (this._isModalOpen) return html` <carousel-modal></carousel-modal> `;
    else return;
  }

  override render() {
    if (this.data.videos.length === 0) {
      return html``;
    }

    return html`
      <div
        @modal-closed=${this._handleModalClosed}
        @onSlideClick=${this._handleSlideClick}
      >
        <carousel-root .data=${this.data}></carousel-root>
        ${this.render_modal()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mobi-carousel': MobiCarousel;
    'carousel-root': Carousel;
  }
}
