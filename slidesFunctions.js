import { playPauseToggle } from "./swiperFunctions.js";

// other funcs
export function itemOnClick(initial_slide_index, modalSwiper, activeReelSlide, slides) {
  const modal = document.getElementById("myModal");
  modal.style.display = "block"; // Show modal
  let swiperInitialized = false
  const iframes = Array.from(document.querySelectorAll(".swiper-modal-container .video-player"))
  console.log('slides', slides, iframes[initial_slide_index])
  iframes[initial_slide_index].src = `${slides.videos[initial_slide_index].url}?autoplay=false&controls=false`
  iframes[Number(initial_slide_index) + 1].src = `${slides.videos[Number(initial_slide_index) + 1].url}?autoplay=false&controls=false`
  iframes[Number(initial_slide_index) - 1].src = `${slides.videos[Number(initial_slide_index) - 1].url}?autoplay=false&controls=false`

  // slides.videos.forEach((slide, i) => iframes[i].src = `${slide.url}?autoplay=false&controls=false`)


  // Initialize the modal Swiper carousel with the clicked index as starting slide

  // iframes[initial_slide_index].addEventListener("DOMContentLoaded", () => {

  modalSwiper = new Swiper(".swiper-modal-container", {
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
      640: {
        // autoHeight: true,
        slidesPerView: 3,
        spaceBetween: 0,
        direction: "horizontal",
        rewind: true,
        loop: false
      },
    },
    on: {
      init: function (swiper) {
        swiperInitialized = true
        playActiveSlideVideo(this, slides); // Play video on initial active slide

      },
      destroy: function () {
        const currentVideo =
          this.slides[this.activeIndex].querySelector(".video-player");
        if (currentVideo) {
          playPauseToggle(currentVideo, true)
          // currentVideo.pause(); // Pause the video on the current slide
        }
      },
      activeIndexChange: function (swiper) {
        console.log('swiper', swiper)
        if (swiperInitialized)
          playActiveSlideVideo(this, slides); // Play video on slide change

      },
    },
  });
  window.modalSwiper = modalSwiper
  // window.activeReelSlide = activeReelSlide
  // return { modalSwiper, activeReelSlide }

  // })

}

// Function to play video on the active slide
export function playActiveSlideVideo(swiper, slides) {

  let prevReelSlide = swiper.slides[swiper.activeIndex <= 0 ? swiper.slides.length - 1 : swiper.activeIndex - 1];
  let nextReelSlide = swiper.slides[swiper.activeIndex >= swiper.slides.length - 1 ? 0 : swiper.activeIndex + 1];
  window.activeReelSlide = swiper.slides[swiper.activeIndex];
  const prevVideo = prevReelSlide.querySelector(".video-player");
  const nextVideo = nextReelSlide.querySelector(".video-player");
  const video = window.activeReelSlide.querySelector(".video-player");

  setTimeout(() => {

    console.log('prevVideo,video,nextVideo', prevVideo, video, nextVideo, swiper.activeIndex >= swiper.slides.length - 1)
  }, 1000);
  const isNextAvailable = swiper.slides.length - 1 > swiper.activeIndex
  const isPrevAvailable = swiper.activeIndex >= 1
  if (!nextVideo.src && (swiper.previousIndex < swiper.activeIndex || swiper.activeIndex == 0))
    nextVideo.src = slides.videos[isNextAvailable ? swiper.activeIndex + 1 : 0].url
  if (!prevVideo.src && (swiper.previousIndex > swiper.activeIndex || swiper.activeIndex == swiper.slides.length - 1))
    prevVideo.src = slides.videos[isPrevAvailable ? swiper.activeIndex - 1 : slides.videos.length - 1].url
  // console.log('prevVideo,ne', prevVideo, slides.videos[swiper.activeIndex])
  if (prevVideo) {
    playPauseToggle(prevVideo, true)
  } if (nextVideo) {
    playPauseToggle(nextVideo, true)
  }
  if (video) {
    playPauseToggle(video, false)
    // video.play(); // Play the video on the new active slide
  }
}
