import Swiper from 'swiper';
import {SlideResponse} from '../../types';

export function playActiveSlideVideo(swiper: Swiper, slides: SlideResponse) {
  // This function plays the active video and pauses the next and prev videos

  const prevReelSlide =
    swiper.slides[
      swiper.activeIndex <= 0
        ? swiper.slides.length - 1
        : swiper.activeIndex - 1
    ];
  const nextReelSlide =
    swiper.slides[
      swiper.activeIndex >= swiper.slides.length - 1
        ? 0
        : swiper.activeIndex + 1
    ];
  const reelSlide = swiper.slides[swiper.activeIndex];

  // Setting global active reel slide reference
  window.activeReelSlide = reelSlide;

  const prevVideo = prevReelSlide.querySelector(
    '.video-player'
  ) as HTMLIFrameElement;
  const nextVideo = nextReelSlide.querySelector(
    '.video-player'
  ) as HTMLIFrameElement;
  const video = reelSlide.querySelector('.video-player') as HTMLIFrameElement;

  const isNextAvailable = swiper.slides.length - 1 > swiper.activeIndex;
  const isPrevAvailable = swiper.activeIndex >= 1;

  // Providing src to the video
  if (!video.src) {
    video.src = slides.videos[swiper.activeIndex].url;
  }

  // Providing src to the next video
  if (
    !nextVideo.src &&
    (swiper.previousIndex < swiper.activeIndex || swiper.activeIndex == 0)
  ) {
    nextVideo.src =
      slides.videos[isNextAvailable ? swiper.activeIndex + 1 : 0].url;
  }
  // Providing src to the prev video
  if (
    !prevVideo.src &&
    (swiper.previousIndex > swiper.activeIndex ||
      swiper.previousIndex == 0 ||
      swiper.activeIndex == swiper.slides.length - 1)
  ) {
    prevVideo.src =
      slides.videos[
        isPrevAvailable ? swiper.activeIndex - 1 : slides.videos.length - 1
      ].url;
  }

  // If prev video iframe is not loaded then pause after load
  prevVideo.addEventListener('load', (e) => {
    setTimeout(() => {
      playPauseToggle(prevVideo, true);
      playPauseToggle(nextVideo, true);
    }, 100);
  });

  // If next video iframe is not loaded then pause after load
  nextVideo.addEventListener('load', () => {
    setTimeout(() => {
      playPauseToggle(prevVideo, true);
      playPauseToggle(nextVideo, true);
    }, 100);
  });

  // If the iframes are loaded this will work to pause the next and prev videos
  // and play the current active video
  // TODO: need to fix this with some event to check when the iframe is loaded instead of timeout
  if (prevVideo) {
    playPauseToggle(prevVideo, true);
  }
  if (nextVideo) {
    playPauseToggle(nextVideo, true);
  }
  if (video) {
    setTimeout(() => {
      playPauseToggle(video, false);
    }, 300);
  }
}

export const playPauseToggle = (
  ModalSlideItemVidEl: HTMLIFrameElement,
  pause = false
) => {
  // Toggle play state . TODO should relay on data-[state] - DONE
  // Storing the play/pause state in the data attribute of the DOM element
  if (ModalSlideItemVidEl.dataset.play === 'true' || pause === true) {
    // Sending the pause event to the player through iframe
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'pause',
      'https://video.dietpixels.net'
    );
    ModalSlideItemVidEl.dataset.play = 'false';
    // Clearing the fetching of the played duration when video pauses.
    // We have started it using setInterval below.
    clearInterval(Number(ModalSlideItemVidEl.dataset.intervalID));
  } else if (ModalSlideItemVidEl.dataset.play === 'false') {
    // Sending the play event to the player through iframe
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'play',
      'https://video.dietpixels.net'
    );
    ModalSlideItemVidEl.dataset.play = 'true';

    // Fetching played duration
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'duration',
      'https://video.dietpixels.net'
    );
    // When the video starts playing, we are fetching the played duration
    // after every 1 second using this setInterval
    const flag = setInterval(() => {
      ModalSlideItemVidEl.contentWindow?.postMessage(
        'duration',
        'https://video.dietpixels.net'
      );
    }, 1000);
    // Setting the intervalID to the data attribute to clear it later when the
    // video pauses.
    ModalSlideItemVidEl.dataset.intervalID = flag.toString();
  }
  // Unmuting the video when we play it.
  muteVideo(ModalSlideItemVidEl, false);
};

// Changes the mute state with given state
export const muteVideo = (
  ModalSlideItemVidEl: HTMLIFrameElement,
  mute = false
) => {
  const muteBtn = ModalSlideItemVidEl.parentElement?.querySelector(
    '#muteButton'
  ) as HTMLImageElement;
  if (mute) {
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'mute',
      'https://video.dietpixels.net'
    );
    // Storing the mute state to window object to use it globally.
    window.mute = true;
  } else {
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'unmute',
      'https://video.dietpixels.net'
    );
    window.mute = false;
  }
  // Toggling between mute and unmute icons
  muteBtn.src = window.mute
    ? '/assets/images/mute.png'
    : '/assets/images/unmute.png';
};

// Toggles mute state
export const toggleMute = (
  ModalSlideItemVidEl: HTMLIFrameElement,
  muteState: boolean,
  toggle: (state: boolean) => void
) => {
  // Here we are storing the mute state in the window object
  if (muteState == false || muteState === undefined) {
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'mute',
      'https://video.dietpixels.net'
    );
    toggle(muteState);
  } else if (muteState == true) {
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'unmute',
      'https://video.dietpixels.net'
    );
    toggle(muteState);
  }
  const muteBtn = ModalSlideItemVidEl.parentElement?.querySelector(
    '#muteButton'
  ) as HTMLImageElement;
  // Toggling between mute and unmute icons
  muteBtn.src = window.mute
    ? '/assets/images/mute.png'
    : '/assets/images/unmute.png';
};
