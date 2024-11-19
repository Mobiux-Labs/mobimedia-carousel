import { itemOnClick } from './slidesFunctions.js';
import { createSlides, registerSwiper } from './swiperFunctions.js';
import { removedURLParameter } from './utils.js';

/**
 * All the global states are stored in the window object
 * Like mute, current active reel.
 * LocalStorage is used to store the list of liked videos
 */

// ------------------------------------------- Getting elements --------------------------------------------

const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];

// ----------------------------------------------- Functions ------------------------------------------------
// Fetches Slides
export const getSlides = async () => {
  const response = await fetch(
    'https://app.dietpixels.com/api/v1/public/playlists/0671b779-d33a-7098-8000-66572f67cfc1/'
  );
  const res = await response.json();
  return res;
};

// Attaches onClick event to all the slides to open the modal popup.
const attachEventsToSlides = async (slides) => {
  document
    .querySelectorAll('.main-swiper-slide')
    .forEach((el) => registerOnClick(el, slides));
  registerSwiper(slides);
};

// Registering the onclick to given element
const registerOnClick = (el, slides) => {
  el.onclick = () => {
    itemOnClick(
      el.dataset.index,
      window.modalSwiper,
      window.activeReelSlide,
      slides
    );
  };
};

// playing the shared video in the modal
export const playSharedVideo = async () => {
  const params = new URLSearchParams(window.location.search);
  const videoID = params.get('carouselVid');
  console.log('slides called');
  const slides = await createSlides();

  if (videoID) {
    itemOnClick(
      slides.videos.findIndex((video) => video.uuid === videoID),
      window.modalSwiper,
      window.activeReelSlide,
      slides
    );
  }
  attachEventsToSlides(slides);
};

const handleMessageFromPlayer = async (e) => {
  if (
    typeof e.data.currentDurationMs != 'undefined' &&
    typeof e.data.totalDurationMs != 'undefined'
  ) {
    // Setting the width of the progressbar
    window.activeReelSlide.querySelector('#progressbar').style.width =
      Math.round((e.data.currentDurationMs / e.data.totalDurationMs) * 100) +
      '%';
  }
};

// Closing modal
const closeModal = () => {
  // playPauseToggle(modalSwiper.slides[modalSwiper.activeIndex])
  modal.style.display = 'none';
  if (window.modalSwiper) {
    window.modalSwiper.destroy(false, true); // Destroy the modal Swiper instance
    window.modalSwiper = null; // Reset the reference

    // Removing the query param of current active video on closing of modal
    const url = removedURLParameter(window.location.href, 'carouselVid');
    history.replaceState(null, '', url);
  }
};

// ------------------------------------------------ Events --------------------------------------------------

// Close the modal when clicking the close button
// span.onclick = closeModal;

// Opens the modal container with the specific video on
// page load if there is "carouselVid" param found in the URL.
// Also, creates the slides for the main carousel
// document.addEventListener('DOMContentLoaded', playSharedVideo);

// This event is triggered when we request for the current
// progress of the active video by sending a post message
// from the playPauseToggle function in the swiperFunctions.js
addEventListener('message', handleMessageFromPlayer);
