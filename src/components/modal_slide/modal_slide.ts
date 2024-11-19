import {LitElement, css, html} from 'lit';
import {customElement, query, property} from 'lit/decorators.js';

import {styleSheet} from './modal_slide-style';
import {SlideResponse} from '../../types';

@customElement('carousel-modal-slide')
export class ModalSlide extends LitElement {
  static override styles = [
    css`
      :host {
        box-sizing: border-box;
        padding: 1rem 0;
      }
    `,
    styleSheet,
  ];

  @property({type: Object})
  data!: SlideResponse;

  constructor() {
    super();
  }

  _handleVideoLike() {}
  _toggleMute() {}
  _handleVideoShare() {}

  render_slide() {
    return html`
      <div class="swiper-slide modal-swiper-slide">
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
          class="video-player-wrapper"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowfullscreen
          data-play="false"
        ></iframe>
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
