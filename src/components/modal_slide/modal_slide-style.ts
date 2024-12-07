import {css} from 'lit';

export const styleSheet = css`
  .video-player-wrapper {
    position: relative;
  }
  #muteButton {
    height: 25px;
    width: auto;
    position: absolute;
    right: 15px;
    top: 25px;
    cursor: pointer;
    opacity: 0;
  }
  @media screen and (max-width: 640px) {
    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }
    .video-player-wrapper {
      width: calc(var(--image-aspect-ratio) * 100vh);
      height: 100vh;
    }
    .video-player {
      height: 100%;
      width: 100%;
      pointer-events: none;
      border-color: black;
      border: 0;
      box-sizing: border-box;
    }
    #muteButton {
      right: 58px;
      top: 28px;
      width: 30px;
      height: 30px;
    }
  }
  @media screen and (min-width: 640px) {
    .modal-swiper-slide {
      transform: translateZ(0) scale(90%) !important;
    }
    .modal-swiper-slide.swiper-slide-active {
      transform: translateZ(0) scale(100%) !important;
    }
    .video-player-wrapper {
      aspect-ratio: 1080/1920;
    }
    .video-player {
      height: 100%;
      width: 100%;
      pointer-events: none;
      border-color: transparent;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
  .swiper-modal-container {
    /* sets height for entire slide or else have to override*/
    height: 100vh;
  }
  .modal-swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .progressbar {
    width: 0%;
    height: 2px;
    background: white;
    transition: progress 0.1s linear infinite;
  }
  .progressbar.no-transition {
    transition: none;
  }

  .like,
  .share {
    position: absolute;
    height: 25px;
    width: auto;
    right: 19px;
    bottom: 390px;
    cursor: pointer;
  }
  .share {
    bottom: 340px;
  }
  @media screen and (min-width: 640px) {
    .like {
      bottom: 210px;
    }
    .share {
      bottom: 170px;
    }
  }
  .swiper-slide-active #muteButton {
    opacity: 1;
  }

  .card-container {
    margin-right: 4px;
    margin-left: 4px;
    display: flex;
    overflow-x: scroll;
    margin-top: -140px;
    max-width: 304px;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;
    gap: 12px;
  }

  @media screen and (max-width: 640px) {
    .card-container {
      margin-left: 3%;
      margin-right: 1%;
      margin-top: -260px;
      max-width: 360px;
    }
  }
`;
