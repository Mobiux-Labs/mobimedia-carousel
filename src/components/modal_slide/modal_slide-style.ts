import {css} from 'lit';

export const styleSheet = css`
  .video-player-wrapper {
    position: relative;
  }
  #muteButton {
    height: 25px;
    width: auto;
    position: absolute;
    right: 5px;
    top: 5px;
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
      right: 50px;
      top: 40px;
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
    bottom: 340px;
    cursor: pointer;
  }
  .share {
    bottom: 300px;
  }
  .swiper-slide-active #muteButton {
    opacity: 1;
  }
`;
