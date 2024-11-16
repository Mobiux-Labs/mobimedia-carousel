import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {getSlides} from './helpers/data';
import {SlideResponse} from './types';

import './components/carousel/carousel';

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

  override async firstUpdated() {
    this.data = await getSlides();
  }

  override render() {
    if (this.data.videos.length === 0) {
      return html``;
    }

    return html` <carousel-root .data=${this.data}></carousel-root> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mobi-carousel': MobiCarousel;
  }
}
