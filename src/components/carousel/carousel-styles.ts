import {css} from 'lit';

export const styleSheet = css`
  @media screen and (max-width: 640px) {
    .swiper-mobimedia-container {
      /* height: var(--mobimedia-slide-height-mobile); */
      height: auto;
    }
    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }

    .main-swiper-slide {
      transform: translateZ(0) scale(90%) !important;
    }
    .main-swiper-slide.swiper-slide-active {
      transform: translateZ(0) scale(100%) !important;
    }
    .main-swiper-slide video {
      width: calc(var(--image-aspect-ratio) * 200px);
    }
  }

  @media screen and (min-width: 640px) {
    .swiper-mobimedia-container {
      /* height: var(--mobimedia-slide-height); */
      height: auto;
      padding: 0 30px;
    }

    .main-swiper-slide video {
      width: calc(var(--image-aspect-ratio) * var(--mobimedia-slide-height));
    }
  }

  .main-swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    /* width: fit-content !important; */
    height: max-content;
  }
  .main-swiper-slide video {
    flex-shrink: 0;
    aspect-ratio: 1080/1920;
    object-fit: cover;
    width: 100% !important;
  }
  .main-swiper-slide.swiper-slide-active {
    transform: translateZ(0) scale(100%) !important;
  }
`;
