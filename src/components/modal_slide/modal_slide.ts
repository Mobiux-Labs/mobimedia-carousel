import {LitElement, html} from 'lit';
import {customElement, query, property} from 'lit/decorators.js';

import {
  playActiveSlideVideo,
  toggleMute,
  playPauseToggle,
} from './modal_slide_helpers';
import {styleSheet} from './modal_slide-style';
import {styleSheet as swiperStyleSheet} from '../shared_styles/swiper-styles';
import {SlideResponse, Video} from '../../types';

import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';
import {IngestCall} from '../../helpers/utils';

import {changeActiveReelParam} from '../../helpers/utils';
import '../card/card';

import muteIcon from '../../../assets/images/mute.svg';
import unmuteIcon from '../../../assets/images/unmute.svg';
import sendIcon from '../../../assets/images/send.svg';
import heartOutlinedIcon from '../../../assets/images/heart-outlined.svg';
import heartFilledIcon from '../../../assets/images/heart-filled.svg';

@customElement('carousel-modal-slide')
export class ModalSlide extends LitElement {
  static override styles = [swiperStyleSheet, styleSheet];

  playlistId = '';
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

  @property({type: Boolean})
  loadFromUrl!: boolean;

  // @state()
  swiperInitialized: boolean;
  currentProgress: number;
  sessionId: string;
  userId: string;

  private _mute: boolean;

  set mute(value: boolean) {
    this._mute = value;
  }

  get mute() {
    return this._mute;
  }

  constructor() {
    super();
    this.swiperInitialized = false;
    this._mute = false;
    this.currentProgress = 0;
    this.sessionId = '';
    this.userId = '';
  }

  override firstUpdated() {
    this.initSwiper();
    setTimeout(() => {
      this.loadFromUrl = false;
    }, 0);
  }

  override updated() {
    if (!this.swiperInitialized && this.swiper?.destroyed) {
      this.initSwiper();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('message', (e) => this._handleMessageFromPlayer(e));
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
          playActiveSlideVideo(swiper, this.data, this.mute);
          changeActiveReelParam(
            'video_id',
            this.data.videos[swiper.activeIndex].uuid
          );
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
            playActiveSlideVideo(swiper, this.data, this._mute); // Play video on slide change
          }
          if (swiper.originalParams.initialSlide !== swiper.activeIndex) {
            changeActiveReelParam(
              'video_id',
              this.data.videos[swiper.activeIndex].uuid,
              true
            );
          } else {
            changeActiveReelParam(
              'video_id',
              this.data.videos[swiper.activeIndex].uuid,
              false
            );
          }
          // Changes the query param in the URL to make it sharable
          // TODO: move the carouselVid param name to constants
        },
      },
    });
  }

  _handleMessageFromPlayer(e: MessageEvent) {
    if (
      typeof e.data.userId != 'undefined' &&
      e.data.sessionId != 'undefined'
    ) {
      this.sessionId = e.data.sessionId;
      this.userId = e.data.userId;
      return;
    }

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
        if (progressWidth < this.currentProgress)
          progressBar.classList.add('no-transition');
        else progressBar.classList.remove('no-transition');

        this.currentProgress = progressWidth;
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
      IngestCall(
        'video_liked',
        vidObj.uuid,
        this.playlistId,
        this.sessionId,
        this.userId
      );
      localStorage.setItem(
        'likedVideos',
        JSON.stringify([...likedList, vidObj.uuid])
      );
      likeButton.src = heartFilledIcon;
    }
    // If liked, they are removed from the liked array in the localstorage
    else if (vidObj) {
      localStorage.setItem(
        'likedVideos',
        JSON.stringify([
          ...likedList.filter((uuid: string) => uuid !== vidObj.uuid),
        ])
      );
      likeButton.src = heartOutlinedIcon;
    }
  }
  _handleVideoShare(e: Event) {
    e.stopPropagation();
    const params = new URLSearchParams(window.location.search);
    params.append('shared', 'true');
    const activeIndex = this.swiper?.activeIndex;
    const vidObj =
      activeIndex !== undefined ? this.data.videos[activeIndex] : null;
    if (vidObj) {
      IngestCall(
        'video_shared',
        vidObj.uuid,
        this.playlistId,
        this.sessionId,
        this.userId
      );
    }
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
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const newUrl = `${origin}${pathname}?${params}`;
      navigator.clipboard.writeText(newUrl);
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
    toggleMute(
      videoPlayer,
      this.mute,
      (currentState: boolean) => (this.mute = !currentState)
    );
    muteButton.src = this.mute ? muteIcon : unmuteIcon;
  }

  render_slide(videoItem: Video) {
    const filteredItem = this.data.videos.filter(
      (item) => item.uuid === videoItem.uuid
    )[0];
    return html`
      <div class="swiper-slide modal-swiper-slide">
        <div class="video-player-wrapper">
          <img
            id="muteButton"
            src=${this.mute ? muteIcon : unmuteIcon}
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
            src=${heartOutlinedIcon}
            @click=${this._handleVideoLike}
          />
          <img
            id="Share"
            class="share"
            src=${sendIcon}
            @click=${this._handleVideoShare}
          />
          <iframe
            class="video-player"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowfullscreen
            data-play="false"
          ></iframe>
          ${filteredItem?.products.length > 0
            ? html`
                <div class="card-container">
                  ${filteredItem.products.map(
                    (item, _, array) => html` <card-slide
                      .product="${item}"
                      .isSingleProduct="${array.length === 1}"
                    >
                    </card-slide>`
                  )}
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="swiper swiper-modal-container">
        <div class="swiper-wrapper" id="modal-slides">
          <!-- Slides will be added dynamically -->
          ${this.data.videos.map((_item, _idx) => this.render_slide(_item))}
        </div>
      </div>

      <!-- Swiper controls -->
      <div class="swiper-button-prev modal-prev"></div>
      <div class="swiper-button-next modal-next"></div>
    `;
  }
}
