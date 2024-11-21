import {html, LitElement} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { playSharedVideo } from "./script"


@customElement('mobimedia-carousel')
export class MobimediaCarousel extends LitElement {

 updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    playSharedVideo();
    console.log('playSharedVideo called in updated lifecycle method');
  }

  render() {
    return html`
     <link rel="stylesheet" href="./src/style.css">
     <main>
      <div class="main-carousal-wrapper">
          <!-- Main Swiper -->
          <div class="swiper swiper-mobimedia-container">
            <div class="swiper-wrapper" id="mobimedia-slides">
              <!-- Slides will be added dynamically -->
            </div>
            <!-- Swiper controls -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
        </div>

        <!-- Wrapper for the modal slider -->
        <div id="myModal" class="modal">
          <div class="modal-overlay"></div>
          <div class="modal-content">
            <div class="swiper swiper-modal-container">
              <div class="swiper-wrapper" id="modal-slides">
                <!-- Slides will be added dynamically -->
              </div>
            </div>
            <span class="close">&times;</span>

            <!-- Swiper controls -->
            <div class="swiper-button-prev modal-prev"></div>
            <div class="swiper-button-next modal-next"></div>
          </div>
        </div>
     </main>
    `;
  }
}
