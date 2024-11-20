import {LitElement, html} from 'lit';
import {customElement, query, property, state} from 'lit/decorators.js';

import {
  playActiveSlideVideo,
  toggleMute,
  playPauseToggle,
} from './modal_slide_helpers';
import {styleSheet} from './modal_slide-style';
import {styleSheet as swiperStyleSheet} from '../shared_styles/swiper-styles';
import {SlideResponse} from '../../types';

import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';

import {changeActiveReelParam} from '../../helpers/utils';

@customElement('carousel-modal-slide')
export class ModalSlide extends LitElement {
  static override styles = [swiperStyleSheet, styleSheet];

  public swiper?: Swiper;

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

  // @state()
  swiperInitialized: boolean;

  @state()
  private mute: boolean;

  constructor() {
    super();
    this.swiperInitialized = false;
    this.mute = false;
  }

  override firstUpdated() {
    this.initSwiper();
  }

  override updated() {
    if (!this.swiperInitialized && this.swiper?.destroyed) {
      this.initSwiper();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('message', this._handleMessageFromPlayer);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('message', this._handleMessageFromPlayer);
  }

  initSwiper() {
    if (this.swiperInitialized) return; // Prevent re-initialization
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
          this.swiperInitialized = true;
          playActiveSlideVideo(swiper, this.data);
        },
        destroy: (swiper) => {
          this.swiperInitialized = false;
          console.log('Swiper Destroyed');
          const currentVideo = swiper.slides[swiper.activeIndex].querySelector(
            '.video-player'
          ) as HTMLIFrameElement;
          if (currentVideo) {
            playPauseToggle(currentVideo, true);
            // currentVideo.pause(); // Pause the video on the current slide
          }
        },
        update: () => {
          console.log('Swiper Updated');
        },
        activeIndexChange: (swiper) => {
          // Pause next and prev videos and play the active one when next/prev is pressed.
          if (this.swiperInitialized) {
            playActiveSlideVideo(swiper, this.data); // Play video on slide change
          }
          // Changes the query param in the URL to make it sharable
          // TODO: move the carouselVid param name to constants
          changeActiveReelParam(
            'carouselVid',
            this.data.videos[swiper.activeIndex].uuid
          );
        },
      },
    });
  }

  _handleMessageFromPlayer(e: MessageEvent) {
    if (
      typeof e.data.currentDurationMs != 'undefined' &&
      typeof e.data.totalDurationMs != 'undefined'
    ) {
      // Setting the width of the progressbar
      if (window.activeReelSlide) {
        const progressBar = window.activeReelSlide.querySelector(
          '#progressbar'
        ) as HTMLElement;
        const progressWidth = Math.round(
          (e.data.currentDurationMs / e.data.totalDurationMs) * 100
        );
        progressBar.style.width = progressWidth + '%';
      }
    }
  }

  _handleVideoLike(e: PointerEvent) {
    e.stopPropagation();
    const likeButton = e.target as HTMLImageElement;
    // Fetching liked videos from the localStorage
    const likedList =
      JSON.parse(localStorage.getItem('likedVideos') || '[]') ?? [];
    const activeIndex = this.swiper?.activeIndex;
    const vidObj =
      activeIndex !== undefined ? this.data.videos[activeIndex] : null;
    // If not liked, they are stored in the liked array in the localstorage
    if (vidObj && !likedList.includes(vidObj.uuid)) {
      localStorage.setItem(
        'likedVideos',
        JSON.stringify([...likedList, vidObj.uuid])
      );
      likeButton.src = '/assets/images/heart-filled.png';
    }
    // If liked, they are removed from the liked array in the localstorage
    else if (vidObj) {
      localStorage.setItem(
        'likedVideos',
        JSON.stringify([
          ...likedList.filter((uuid: string) => uuid !== vidObj.uuid),
        ])
      );
      likeButton.src = '/assets/images/heart-outlined.png';
    }
  }
  _handleVideoShare(e: Event) {
    e.stopPropagation();

    // TODO: Need to detect the device instead of relying on the screen width
    // Open the native share popup in android/ios devices
    if (window.innerWidth < 1200)
      navigator
        .share({
          title: document.title,
          text: 'Have a look at this product!',
          url: window.location.href,
        })
        .then(() => {})
        .catch((err) => console.log('Error while sharing', err));
    // Or copy the link to the clipboard in computers
    else {
      navigator.clipboard.writeText(window.location.href);
      this._showNotification('Link copied to clipboard!');
    }
  }

  _showNotification(message: string) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    this.shadowRoot?.appendChild(notification);

    setTimeout(() => {
      this.shadowRoot?.removeChild(notification);
    }, 3000);
  }

  _toggleMute(e: PointerEvent) {
    const muteButton = e.target as HTMLImageElement;
    const videoPlayer = (e.target as HTMLElement)?.parentElement?.querySelector(
      '.video-player'
    ) as HTMLIFrameElement;
    toggleMute(videoPlayer, this.mute, (currentState: boolean) => {
      this.mute = !currentState; // Update local state
      window.mute = this.mute; // Update global state
    });
    muteButton.src = this.mute
      ? '/assets/images/mute.png'
      : '/assets/images/unmute.png';
  }

  render_slide() {
    console.log('we', this.mute);
    return html`
      <div class="swiper-slide modal-swiper-slide">
        <div class="video-player-wrapper">
          <img
            id="muteButton"
            src=${this.mute
              ? '/assets/images/mute.png'
              : '/assets/images/unmute.png'}
            @click=${this._toggleMute}
          />
          <div
            id="progressbar"
            class="progressbar"
            style="position:absolute;top:0;left:2px;"
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
