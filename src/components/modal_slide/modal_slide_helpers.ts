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
  ) as HTMLVideoElement;
  const nextVideo = nextReelSlide.querySelector(
    '.video-player'
  ) as HTMLVideoElement;
  const video = reelSlide.querySelector('.video-player') as HTMLVideoElement;

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
  // prevVideo.addEventListener("load", (e) => {
  //   setTimeout(() => {
  //     playPauseToggle(prevVideo, true)
  //     playPauseToggle(nextVideo, true)
  //   }, 100);
  // })

  // If next video iframe is not loaded then pause after load
  // nextVideo.addEventListener("load", () => {
  //   setTimeout(() => {
  //     playPauseToggle(prevVideo, true)
  //     playPauseToggle(nextVideo, true)

  //   }, 100);
  // })

  // If the iframes are loaded this will work to pause the next and prev videos
  // and play the current active video
  // TODO: need to fix this with some event to check when the iframe is loaded instead of timeout
  // if (prevVideo) {
  //   playPauseToggle(prevVideo, true)
  // } if (nextVideo) {
  //   playPauseToggle(nextVideo, true)
  // }
  // if (video) {
  //   setTimeout(() => {
  //     playPauseToggle(video, false)
  //   }, 300);
  // }
}
