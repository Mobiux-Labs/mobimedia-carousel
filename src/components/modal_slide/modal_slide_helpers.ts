import Swiper from 'swiper';
import {SlideResponse} from '../../types';
import muteIcon from '../../../assets/images/mute.svg';
import unmuteIcon from '../../../assets/images/unmute.svg';
import {IngestCall} from '../../helpers/utils';

let isFirstRun = true;

export function playActiveSlideVideo(
  swiper: Swiper,
  slides: SlideResponse,
  mute = false,
  playlistId: string,
  sessionId: string,
  userId: string
) {
  // This function plays the active video and pauses the next and prev videos
  console.log('sessionId in fun', sessionId);

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

  const prevVideo: HTMLIFrameElement = prevReelSlide.querySelector(
    '.video-player'
  ) as HTMLIFrameElement;
  const nextVideo = nextReelSlide.querySelector(
    '.video-player'
  ) as HTMLIFrameElement;
  const video = reelSlide.querySelector('.video-player') as HTMLIFrameElement;

  const isNextAvailable = swiper.slides.length - 1 > swiper.activeIndex;
  const isPrevAvailable = swiper.activeIndex >= 1;

  const params = new URLSearchParams({
    autoplay: String(true),
    controls: String(false),
    loop: String(true),
    aspectRatio: '9:16',
  });

  const shared = new URLSearchParams(window.location.search).get('shared');
  const currentVideoId = slides.videos[swiper.activeIndex].uuid;
  const nextVideoId = slides.videos[swiper.activeIndex + 1]?.uuid;
  const prevVideoId = slides.videos[swiper.activeIndex - 1]?.uuid;

  // Providing src to the video
  if (!video.src) {
    const videoUrl =
      slides.videos[swiper.activeIndex].url + '?' + params.toString();
    video.src = videoUrl;

    if (!shared) {
      setTimeout(() => {
        if (isCurrentVideoPlaying(currentVideoId)) {
          playPauseToggle(video, false, mute);
        }
      }, 1500);
    }
  }

  // Providing src to the next video
  if (
    !nextVideo.src &&
    (swiper.previousIndex < swiper.activeIndex || swiper.activeIndex == 0)
  ) {
    const nextVideoUrl =
      slides.videos[isNextAvailable ? swiper.activeIndex + 1 : 0].url +
      '?' +
      params.toString();
    nextVideo.src = nextVideoUrl;

    nextVideo.addEventListener('load', () => {
      setTimeout(() => {
        if (!isCurrentVideoPlaying(nextVideoId)) {
          playPauseToggle(nextVideo, true, mute);
        }
      }, 1500);
    });
  }
  // Providing src to the prev video
  if (
    !prevVideo.src &&
    (swiper.previousIndex > swiper.activeIndex ||
      swiper.previousIndex == 0 ||
      swiper.activeIndex == swiper.slides.length - 1)
  ) {
    const prevVideoUrl =
      slides.videos[
        isPrevAvailable ? swiper.activeIndex - 1 : slides.videos.length - 1
      ].url +
      '?' +
      params.toString();
    prevVideo.src = prevVideoUrl;

    prevVideo.addEventListener('load', () => {
      setTimeout(() => {
        if (!isCurrentVideoPlaying(prevVideoId)) {
          playPauseToggle(prevVideo, true, true);
        }
      }, 1500);
    });
  }

  // If the iframes are loaded this will work to pause the next and prev videos
  // and play the current active video
  // TODO: need to fix this with some event to check when the iframe is loaded instead of timeout
  if (prevVideo.src) {
    playPauseToggle(prevVideo, true, true);
  }

  if (nextVideo.src) {
    playPauseToggle(nextVideo, true, true);
  }

  if (video.src && !shared) {
    const parts = video.src.split('/media/');
    const videoId = parts[1]?.split('/')[0] || null;
    if (videoId) {
      setTimeout(() => {
        IngestCall('video_clicked', videoId, playlistId, sessionId, userId);
      }, 1500);
    }
    playPauseToggle(video, false, mute);
  }
}

const isCurrentVideoPlaying = (videoId: string) => {
  return videoId == new URLSearchParams(window.location.search).get('video_id');
};

export const playPauseToggle = (
  ModalSlideItemVidEl: HTMLIFrameElement,
  pause = false,
  mute = false
) => {
  // Toggle play state . TODO should relay on data-[state] - DONE
  // Storing the play/pause state in the data attribute of the DOM element
  if (pause === true) {
    // Sending the pause event to the player through iframe
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'pause',
      'https://video.dietpixels.net'
    );
    // ModalSlideItemVidEl.dataset.play = 'false';
    // Clearing the fetching of the played duration when video pauses.
    // We have started it using setInterval below.
    clearInterval(Number(ModalSlideItemVidEl.dataset.intervalID));
  } else if (pause === false) {
    // Sending the play event to the player through iframe
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'play',
      'https://video.dietpixels.net'
    );
    // ModalSlideItemVidEl.dataset.play = 'true';

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

  if (isFirstRun) {
    setInterval(() => {
      ModalSlideItemVidEl.contentWindow?.postMessage(
        'userSession',
        'https://video.dietpixels.net'
      );
    }, 1000);

    setTimeout(() => {
      muteVideo(ModalSlideItemVidEl, mute); // Execute logic with delay
      isFirstRun = false; // Mark first run as completed
    }, 800);
  } else {
    muteVideo(ModalSlideItemVidEl, mute); // Execute logic immediately
  }
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
  } else {
    ModalSlideItemVidEl.contentWindow?.postMessage(
      'unmute',
      'https://video.dietpixels.net'
    );
  }
  // Toggling between mute and unmute icons
  muteBtn.src = mute ? muteIcon : unmuteIcon;
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
  muteBtn.src = muteState ? muteIcon : unmuteIcon;
};
