import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import {getSlides} from './helpers/data';
import {SlideResponse} from './types';

import './components/carousel/carousel';
import './components/modal/modal';
import {Carousel} from './components/carousel/carousel';

import {SlideClickEvent} from './helpers/events';
import {Modal} from './components/modal/modal';

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
    if (modal) modal.visible = true;
  }

  override async firstUpdated() {
    this.data = await getSlides();
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
        <carousel-modal id="modalView"></carousel-modal>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mobi-carousel': MobiCarousel;
    'carousel-root': Carousel;
    'carousel-modal': Modal;
  }
}
