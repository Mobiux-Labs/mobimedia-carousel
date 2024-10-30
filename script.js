import { itemOnClick } from "./slidesFunctions.js";
import { createSlides, playPauseToggle, registerSwiper } from "./swiperFunctions.js";

// min_width = 380px
let activeReelSlide;

// Modal functionality
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
let modalSwiper; // Declare variable for modal Swiper instance
let swiperRef;
function closeModal() {
  // playPauseToggle(modalSwiper.slides[modalSwiper.activeIndex])
  modal.style.display = "none";
  if (window.modalSwiper) {
    window.modalSwiper.destroy(false, true); // Destroy the modal Swiper instance
    window.modalSwiper = null; // Reset the reference
  }
}

// Close the modal when clicking the close button
span.onclick = closeModal;

// Close the modal when clicking outside the modal content
window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

addEventListener("message", (e) => {

  if (
    typeof e.data.currentDurationMs != "undefined" &&
    typeof e.data.totalDurationMs != "undefined"
  ) {
    // console.log("Current Duration", e.data.currentDurationMs);
    // console.log("Total Duration", e.data.totalDurationMs);
    // console.log('e.data', Math.round((e.data.currentDurationMs / e.data.totalDurationMs) * 100), window.activeReelSlide.querySelector("#progressbar"))
    window.activeReelSlide.querySelector("#progressbar").style.width = Math.round((e.data.currentDurationMs / e.data.totalDurationMs) * 100) + "%"
    // document.getElementById('')
  }
});

//  Create Slides

export const getSlides = async () => {
  const response = await fetch(
    "https://mocx.mobiux.in/api/ae6a402d-a9ab-429f-b1c9-531ef3744e52/api/v1/public/playlists/0669e1c0-0bd8-75ab-8000-c31e231d8b81"
  );
  const res = await response.json();
  return res;
};

async function createSlidesAndAttachEvents() {
  const slides = await createSlides();
  document.querySelectorAll(".main-swiper-slide").forEach(function (el) {
    el.onclick = function () {
      // const { modalSwiper: swiper, activeReelSlide: activeReel } = 
      itemOnClick(el.dataset.index, window.modalSwiper, window.activeReelSlide, slides);
      // modalSwiper = swiper;
      // activeReelSlide = activeReel
    };
  });
  swiperRef = registerSwiper(slides);
}
createSlidesAndAttachEvents();
// Swiper