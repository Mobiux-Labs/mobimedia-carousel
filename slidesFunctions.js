import { playPauseToggle } from "./swiperFunctions.js";
import { changeActiveReelParam } from "./utils.js";

// Registering new swiper object and opening the modal with the clicked video playing.
export const itemOnClick = (initial_slide_index, modalSwiper, activeReelSlide, slides) => {
  // Fetching the modal DOM element and making it visible
  const modal = document.getElementById("myModal");
  modal.style.display = "block"; // Show modal
  let swiperInitialized = false

  // Registering new swiper object
  modalSwiper = new Swiper(".swiper-modal-container", {
    // Config for smaller screens
    slidesPerView: 1,
    centeredSlides: true,
    direction: "vertical",
    initialSlide: Number(initial_slide_index), // Set the starting slide based on the clicked index
    longSwipes: false,
    navigation: {
      nextEl: ".modal-next",
      prevEl: ".modal-prev",
    },
    loop: false,
    breakpoints: {
      // Config for bigger screens
      640: {
        // autoHeight: true,
        slidesPerView: 3,
        spaceBetween: 0,
        direction: "horizontal",
        rewind: true,
        loop: false,
        allowTouchMove: false,
      },
    },
    // Events
    on: {
      init: (swiper) => {
        // Playing the clicked video on initialization
        swiperInitialized = true
        playActiveSlideVideo(swiper, slides); // Play video on initial active slide

      },
      destroy: (swiper) => {
        // Pausing the video when we close the modal

        // Getting the current playing video using activeIndex
        const currentVideo =
          swiper.slides[swiper.activeIndex].querySelector(".video-player");
        if (currentVideo) {
          playPauseToggle(currentVideo, true)
          // currentVideo.pause(); // Pause the video on the current slide
        }
      },
      activeIndexChange: (swiper) => {
        // Pause next and prev videos and play the active one when next/prev is pressed. 
        if (swiperInitialized) {
          playActiveSlideVideo(swiper, slides); // Play video on slide change
        }
        // Changes the query param in the URL to make it sharable
        // TODO: move the carouselVid param name to constants
        changeActiveReelParam("carouselVid", slides.videos[swiper.activeIndex].uuid)
      },
    },
  });
  // Global modalSwiper instance
  window.modalSwiper = modalSwiper
}

// Function to play video on the active slide
export const playActiveSlideVideo = (swiper, slides) => {
  const videoOptions = "?controls=false&loop=true"
  // This function plays the active video and pauses the next and prev videos

  let prevReelSlide = swiper.slides[swiper.activeIndex <= 0 ? swiper.slides.length - 1 : swiper.activeIndex - 1];
  let nextReelSlide = swiper.slides[swiper.activeIndex >= swiper.slides.length - 1 ? 0 : swiper.activeIndex + 1];
  let reelSlide = swiper.slides[swiper.activeIndex];

  // Setting global active reel slide reference 
  window.activeReelSlide = reelSlide;

  const prevVideo = prevReelSlide.querySelector(".video-player");
  const nextVideo = nextReelSlide.querySelector(".video-player");
  const video = reelSlide.querySelector(".video-player");

  const isNextAvailable = swiper.slides.length - 1 > swiper.activeIndex
  const isPrevAvailable = swiper.activeIndex >= 1

  // Providing src to the video
  if (!video.src) {
    video.src = slides.videos[swiper.activeIndex].url + videoOptions
  }

  // Providing src to the next video
  if (!nextVideo.src && (swiper.previousIndex < swiper.activeIndex || swiper.activeIndex == 0)) {
    nextVideo.src = slides.videos[isNextAvailable ? swiper.activeIndex + 1 : 0].url + videoOptions
  }
  // Providing src to the prev video
  if (!prevVideo.src && (swiper.previousIndex > swiper.activeIndex || swiper.previousIndex == 0 || swiper.activeIndex == swiper.slides.length - 1)) {
    prevVideo.src = slides.videos[isPrevAvailable ? swiper.activeIndex - 1 : slides.videos.length - 1].url + videoOptions
  }

  // If prev video iframe is not loaded then pause after load
  prevVideo.addEventListener("load", (e) => {
    setTimeout(() => {
      playPauseToggle(prevVideo, true)
      playPauseToggle(nextVideo, true)
    }, 100);
  })

  // If next video iframe is not loaded then pause after load
  nextVideo.addEventListener("load", () => {
    setTimeout(() => {
      playPauseToggle(prevVideo, true)
      playPauseToggle(nextVideo, true)

    }, 100);
  })

  // If the iframes are loaded this will work to pause the next and prev videos
  // and play the current active video
  // TODO: need to fix this with some event to check when the iframe is loaded instead of timeout
  if (prevVideo) {
    playPauseToggle(prevVideo, true)
  } if (nextVideo) {
    playPauseToggle(nextVideo, true)
  }
  if (video) {
    setTimeout(() => {
      playPauseToggle(video, false)
    }, 300);
  }
}
