// min_width = 380px
let activeReelSlide;

// Modal functionality
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
let modalSwiper; // Declare variable for modal Swiper instance

function closeModal() {
  modal.style.display = "none";
  if (modalSwiper) {
    modalSwiper.destroy(false, true); // Destroy the modal Swiper instance
    modalSwiper = null; // Reset the reference
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

//  Create Slides
const mobimediaSlides = document.getElementById("mobimedia-slides");
const modalSlides = document.getElementById("modal-slides");

const getSlides = async () => {
  const response = await fetch(
    "https://mocx.mobiux.in/api/ae6a402d-a9ab-429f-b1c9-531ef3744e52/api/v1/public/playlists/0669e1c0-0bd8-75ab-8000-c31e231d8b81"
  );
  const res = await response.json();
  return res;
};

async function createSlides() {
  const slides = await getSlides();
  slides.videos.forEach((img, index) => {
    // create Main Slides
    const SlideEl = document.createElement("div");
    SlideEl.className = "swiper-slide main-swiper-slide";
    SlideEl.dataset.index = index;
    mobimediaSlides.appendChild(SlideEl);

    const SlideItemImgEl = document.createElement("img");
    SlideItemImgEl.src = img.thumbnail;
    SlideItemImgEl.alt = img.alt;
    SlideEl.appendChild(SlideItemImgEl);

    // Create Model Slides
    const ModelSlideEl = document.createElement("div");
    ModelSlideEl.className = "swiper-slide modal-swiper-slide";
    modalSlides.appendChild(ModelSlideEl);

    // // Video element
    // const ModalSlideItemVidEl = document.createElement('video');
    // ModalSlideItemVidEl.className = 'video-player';
    // ModalSlideItemVidEl.setAttribute('preload', 'auto');
    // ModalSlideItemVidEl.setAttribute('loop', '');
    // ModalSlideItemVidEl.setAttribute('playsinline', '');
    // // ModalSlideItemVidEl.setAttribute('autoplay', '');
    // ModalSlideItemVidEl.setAttribute('poster', img.thumbnail);
    // // Create the first source element
    // const source = document.createElement('source');
    // source.setAttribute('src', img.video);
    // source.setAttribute('type', 'video/mp4');

    // ModalSlideItemVidEl.appendChild(source);
    // // END - Video element

    // iFrame element
    const ModalSlideItemWrapperEl = document.createElement("div");
    ModalSlideItemWrapperEl.className = "video-player-wrapper";

    const ModalSlideItemVidEl = document.createElement("iframe");
    ModalSlideItemVidEl.className = "video-player";
    ModalSlideItemVidEl.src = img.url;
    console.log(img.url);
    ModalSlideItemVidEl.setAttribute(
      "allow",
      "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    );
    ModalSlideItemVidEl.setAttribute("allowfullscreen", "true");

    ModalSlideItemWrapperEl.appendChild(ModalSlideItemVidEl);
    ModelSlideEl.appendChild(ModalSlideItemWrapperEl);
    // ModelSlideEl.appendChild(ModalSlideItemVidEl);

    // ModelSlideEl.appendChild(SlideItemImgEl);
  });
}
async function createSlidesAndAttachEvents() {
  await createSlides();
  document.querySelectorAll(".main-swiper-slide").forEach(function (el) {
    el.onclick = function () {
      itemOnClick(el.dataset.index);
    };
  });
}
createSlidesAndAttachEvents();
// Swiper

const swiper = new Swiper(".swiper-mobimedia-container", {
  slidesPerView: 3,
  loop: true,
  centeredSlides: true,
  breakpoints: {
    768: {
      spaceBetween: 30,
      slidesPerView: 5,
      centeredSlides: true,
    },
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// other funcs
function itemOnClick(initial_slide_index) {
  modal.style.display = "block"; // Show modal

  // Initialize the modal Swiper carousel with the clicked index as starting slide
  modalSwiper = new Swiper(".swiper-modal-container", {
    slidesPerView: 1,
    centeredSlides: true,
    direction: "vertical",
    initialSlide: initial_slide_index, // Set the starting slide based on the clicked index
    navigation: {
      nextEl: ".modal-next",
      prevEl: ".modal-prev",
    },
    loop: true,
    breakpoints: {
      640: {
        // autoHeight: true,
        slidesPerView: 2,
        spaceBetween: 5,
        direction: "horizontal",
      },
    },
    on: {
      init: function () {
        playActiveSlideVideo(this); // Play video on initial active slide
      },
      destroy: function () {
        // if (activeReelSlide) {
        const currentVideo =
          this.slides[this.activeIndex].querySelector(".video-player");
        if (currentVideo) {
          currentVideo.pause(); // Pause the video on the current slide
        }
        // }
      },
      activeIndexChange: function () {
        playActiveSlideVideo(this); // Play video on slide change
      },
    },
  });
}

// Function to play video on the active slide
function playActiveSlideVideo(swiper) {
  // const videos = document.querySelectorAll(".modal-swiper-slide .video-player");
  // videos.forEach(video => video.pause()); // Pause all videos

  if (activeReelSlide) {
    const currentVideo = activeReelSlide.querySelector(".video-player");
    console.log(currentVideo);
    if (currentVideo) {
      // currentVideo.pause(); // Pause the video on the current slide
    }
  }

  activeReelSlide = swiper.slides[swiper.activeIndex];
  const video = activeReelSlide.querySelector(".video-player");
  if (video) {
    // video.play(); // Play the video on the new active slide
  }
}
