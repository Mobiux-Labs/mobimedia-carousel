import { getSlides } from "./script.js";

// import "https://video.dietpixels.net/dist/player.js"
// const getSlides = require("./script.js")
export const registerSwiper = (slides) => {
  const swiperRef = new Swiper(".swiper-mobimedia-container", {
    slidesPerView: 1.5,
    loop: true,
    centeredSlides: true,
    breakpoints: {
      768: {
        spaceBetween: 30,
        slidesPerView: 5.5,
        centeredSlides: slides.videos.length <= 5 ? true : false,
        rewind: true,
        loop: false,
        initialSlide: slides.videos.length <= 5 ? slides.videos.length / 2 : 0,
        enabled: slides.videos.length <= 5 ? false : true
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
  return swiperRef;
};

export async function createSlides() {
  const mobimediaSlides = document.getElementById("mobimedia-slides");
  const modalSlides = document.getElementById("modal-slides");

  const slides = await getSlides();

  slides.videos.forEach((img, index) => {
    // create Main Slides
    const SlideEl = document.createElement("div");
    SlideEl.className = "swiper-slide main-swiper-slide";
    SlideEl.dataset.index = index;
    mobimediaSlides.appendChild(SlideEl);

    const SlideItemImgEl = document.createElement("video");
    SlideItemImgEl.src = img.thumbnail;
    SlideItemImgEl.autoplay = true
    SlideItemImgEl.muted = true
    SlideItemImgEl.loop = true
    SlideItemImgEl.alt = img.alt;
    SlideEl.appendChild(SlideItemImgEl);

    // Create Model Slides
    const ModelSlideEl = document.createElement("div");
    ModelSlideEl.className = "swiper-slide modal-swiper-slide";

    mountIFrameTo(ModelSlideEl, img)
    modalSlides.appendChild(ModelSlideEl);

    // TODO.This is not working. Connect with Rishab on how to implement this.

  });
  return slides
}

const loadIFrame = () => {
  const nextBtn = document.getElementsByClassName("swiper-button-next");
  const prevBtn = document.getElementsByClassName("swiper-button-prev");

  mountIFrameTo(ModelSlideEl, img);
};

const mountIFrameTo = (parent, vidObj) => {

  const likedList = JSON.parse(localStorage.getItem("likedVideos")) ?? [];

  // iFrame element
  const ModalSlideItemWrapperEl = document.createElement("div");
  ModalSlideItemWrapperEl.className = "video-player-wrapper";

  const ModalSlideItemVidEl = document.createElement("iframe");
  ModalSlideItemVidEl.className = "video-player";
  // ModalSlideItemVidEl.src = `${vidObj.url}?autoplay=false&controls=false`;

  ModalSlideItemVidEl.setAttribute(
    "allow",
    "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
  );

  ModalSlideItemVidEl.setAttribute("allowfullscreen", "true");
  ModalSlideItemVidEl.dataset.play = "false"

  // Mute button
  const ModelSlideItemVidActionMute = document.createElement("img");
  ModelSlideItemVidActionMute.id = "muteButton";
  // ModelSlideItemVidActionMute.style.position = "absolute";
  // ModelSlideItemVidActionMute.style.right = "0";
  ModelSlideItemVidActionMute.src = "/assets/images/unmute.png"

  // Play pause button
  const ModelSlideItemVidActionPlayToggle = document.createElement("button");
  ModelSlideItemVidActionPlayToggle.textContent = "Pause";
  ModelSlideItemVidActionPlayToggle.id = "playToggle";
  ModelSlideItemVidActionPlayToggle.style.position = "absolute";

  // Get Duration
  const ModelSlideItemVidActionDuration = document.createElement("button");
  ModelSlideItemVidActionDuration.textContent = "Get Duration";
  ModelSlideItemVidActionDuration.id = "durationButton";
  ModelSlideItemVidActionDuration.style.position = "absolute";
  ModelSlideItemVidActionDuration.style.bottom = "0";

  // Progressbar
  const ModelSlideItemVidProgressbar = document.createElement("div");
  ModelSlideItemVidProgressbar.id = "progressbar";
  ModelSlideItemVidProgressbar.className = "progressbar";
  ModelSlideItemVidProgressbar.style.position = "absolute";
  ModelSlideItemVidProgressbar.style.top = "0";

  // Like button
  const ModelSlideItemVidLike = document.createElement("img");
  ModelSlideItemVidLike.id = "Like";
  ModelSlideItemVidLike.className = "like";
  ModelSlideItemVidLike.src = likedList.includes(vidObj.uuid) ? "/assets/images/heart-filled.png" : "/assets/images/heart-outlined.png"

  // Share button
  const ModelSlideItemVidShare = document.createElement("img");
  ModelSlideItemVidShare.id = "Share";
  ModelSlideItemVidShare.className = "share";
  ModelSlideItemVidShare.src = "/assets/images/send.png"


  ModalSlideItemWrapperEl.appendChild(ModelSlideItemVidActionMute);
  // ModalSlideItemWrapperEl.appendChild(ModelSlideItemVidActionPlayToggle);
  // ModalSlideItemWrapperEl.appendChild(ModelSlideItemVidActionDuration);
  ModalSlideItemWrapperEl.appendChild(ModelSlideItemVidProgressbar);
  ModalSlideItemWrapperEl.appendChild(ModelSlideItemVidLike);
  ModalSlideItemWrapperEl.appendChild(ModelSlideItemVidShare);
  ModalSlideItemWrapperEl.appendChild(ModalSlideItemVidEl);

  parent.appendChild(ModalSlideItemWrapperEl);

  ModelSlideItemVidLike.addEventListener("click", (e) => {
    const likedList = JSON.parse(localStorage.getItem("likedVideos")) ?? [];

    e.stopPropagation()
    if (!likedList.includes(vidObj.uuid)) {

      localStorage.setItem("likedVideos", JSON.stringify([...likedList, vidObj.uuid]))
      ModelSlideItemVidLike.src = "/assets/images/heart-filled.png";
    }
    else {
      localStorage.setItem("likedVideos", JSON.stringify([...likedList.filter(uuid => uuid !== vidObj.uuid)]))
      ModelSlideItemVidLike.src = "/assets/images/heart-outlined.png";
    }
  })

  ModalSlideItemWrapperEl.addEventListener("click", () =>
    toggleMute(ModalSlideItemVidEl)
  );

  // track duration
  ModelSlideItemVidActionDuration.addEventListener("click", () => {
    ModalSlideItemVidEl.contentWindow.postMessage(
      "duration",
      "https://video.dietpixels.net"
    );
  });
};

const toggleMute = (ModalSlideItemVidEl) => {

  if (window.mute == false || window.mute === undefined) {
    ModalSlideItemVidEl.contentWindow.postMessage(
      "mute",
      "https://video.dietpixels.net"
    );
    window.mute = true
  } else if (window.mute == true) {
    ModalSlideItemVidEl.contentWindow.postMessage(
      "unmute",
      "https://video.dietpixels.net"
    );
    window.mute = false
  }
  const muteBtn = ModalSlideItemVidEl.parentElement.querySelector("#muteButton")
  muteBtn.src = window.mute ? "/assets/images/mute.png" : "/assets/images/unmute.png"

};
export const muteVideo = (ModalSlideItemVidEl, mute = false) => {
  // console.log("muting video");
  const muteBtn = ModalSlideItemVidEl.parentElement.querySelector("#muteButton")
  if (mute) {
    // console.log("muting");

    ModalSlideItemVidEl.contentWindow.postMessage(
      "mute",
      "https://video.dietpixels.net"
    );
    window.mute = true
  } else {
    // console.log("unmuting");

    ModalSlideItemVidEl.contentWindow.postMessage(
      "unmute",
      "https://video.dietpixels.net"
    );
    window.mute = false
  }
  muteBtn.src = window.mute ? "/assets/images/mute.png" : "/assets/images/unmute.png"
};

export const playPauseToggle = (
  ModalSlideItemVidEl,
  pause = false,
) => {
  // Toggle play state . TODO should relay on data-[state]

  if (ModalSlideItemVidEl.dataset.play === "true" || pause === true) {
    ModalSlideItemVidEl.contentWindow.postMessage(
      "pause",
      "https://video.dietpixels.net"
    );
    ModalSlideItemVidEl.dataset.play = "false";
    clearInterval(ModalSlideItemVidEl.dataset.intervalID);
  } else if (ModalSlideItemVidEl.dataset.play === "false") {
    ModalSlideItemVidEl.contentWindow.postMessage(
      "play",
      "https://video.dietpixels.net"
    );
    ModalSlideItemVidEl.dataset.play = "true";

    // Fetching 
    ModalSlideItemVidEl.contentWindow.postMessage(
      "duration",
      "https://video.dietpixels.net"
    );
    let flag = setInterval(() => {
      ModalSlideItemVidEl.contentWindow.postMessage(
        "duration",
        "https://video.dietpixels.net"
      );
    }, 1000);
    ModalSlideItemVidEl.dataset.intervalID = flag
  }
  if (window.mute)
    muteVideo(ModalSlideItemVidEl, true)
  else
    muteVideo(ModalSlideItemVidEl, false)

};
