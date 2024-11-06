import { itemOnClick } from "./slidesFunctions.js";
import { createSlides, registerSwiper } from "./swiperFunctions.js";
import { removedURLParameter } from "./utils.js";

/**
 * All the global states are stored in the window object
 * Like mute, current active reel.
 * LocalStorage is used to store the list of liked videos
 */

// ------------------------------------------- Getting elements --------------------------------------------

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

// ------------------------------------------------ Events --------------------------------------------------

// Close the modal when clicking the close button
span.onclick = closeModal;

// Opens the modal container with the specific video on 
// page load if there is "carouselVid" param found in the URL.
// Also, creates the slides for the main carousel
document.addEventListener("DOMContentLoaded", playSharedVideo)

// This event is triggered when we request for the current 
// progress of the active video by sending a post message 
// from the playPauseToggle function in the swiperFunctions.js
addEventListener("message", handleMessageFromPlayer);

// ----------------------------------------------- Functions ------------------------------------------------
// Fetches Slides
export const getSlides = async () => {
  const response = await fetch(
    "https://mocx.mobiux.in/api/ae6a402d-a9ab-429f-b1c9-531ef3744e52/api/v1/public/playlists/0669e1c0-0bd8-75ab-8000-c31e231d8b81"
  );
  const res = await response.json();
  return res;
};

// Attaches onClick event to all the slides to open the modal popup. 
async function attachEventsToSlides(slides) {
  document.querySelectorAll(".main-swiper-slide").forEach(el => registerOnClick(el, slides));
  registerSwiper(slides);
}

// Registering the onclick to given element
function registerOnClick(el, slides) {
  el.onclick = function () {
    itemOnClick(el.dataset.index, window.modalSwiper, window.activeReelSlide, slides);
  };
}

// playing the shared video in the modal
async function playSharedVideo() {
  const params = new URLSearchParams(window.location.search)
  const videoID = params.get("carouselVid")
  const slides = await createSlides();
  if (videoID) {
    itemOnClick(slides.videos.findIndex(video => video.uuid === videoID), window.modalSwiper, window.activeReelSlide, slides);
  }
  attachEventsToSlides(slides);
}

async function handleMessageFromPlayer(e) {
  if (
    typeof e.data.currentDurationMs != "undefined" &&
    typeof e.data.totalDurationMs != "undefined"
  ) {

    // Setting the width of the progressbar
    window.activeReelSlide.querySelector("#progressbar").style.width = Math.round((e.data.currentDurationMs / e.data.totalDurationMs) * 100) + "%"
  }
}

// Closing modal
function closeModal() {
  // playPauseToggle(modalSwiper.slides[modalSwiper.activeIndex])
  modal.style.display = "none";
  if (window.modalSwiper) {
    window.modalSwiper.destroy(false, true); // Destroy the modal Swiper instance
    window.modalSwiper = null; // Reset the reference

    // Removing the query param of current active video on closing of modal
    const url = removedURLParameter(window.location.href, "carouselVid")
    history.replaceState(null, '', url)
  }
}