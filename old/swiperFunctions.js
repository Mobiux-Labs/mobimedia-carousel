import { getSlides } from "./script.js";

// Creates a new swiper object and attaches the give slides to
// the parent container.
export const registerSwiper = (slides) => {
  const swiperRef = new Swiper(".swiper-mobimedia-container", {
    // Small screens
    slidesPerView: 1.5,
    loop: true,
    centeredSlides: true,
    breakpoints: {
      // Big screens
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

// This function creates DOM elements for slides and appends it to the modal
export const createSlides = async () => {
  // Main slider container
  const mobimediaSlides = document.getElementById("mobimedia-slides");
  // Modal slider container
  const modalSlides = document.getElementById("modal-slides");

  // Fetches slides from the API
  const slides = await getSlides();

  slides.videos.forEach((img, index) => {
    // create Main Slides

    // Div for video wrapper
    const SlideEl = document.createElement("div");
    SlideEl.className = "swiper-slide main-swiper-slide";
    SlideEl.dataset.index = index;

    // Appending the wrapper to parent element
    mobimediaSlides.appendChild(SlideEl);

    // Creating thumbnail element
    const splitURL = img.thumbnail.split(".")
    const extensionWithOptions = splitURL[splitURL.length - 1]
    const extension = extensionWithOptions.split("?")[0]
    const isImg = ["png", "jpg", "jpeg", "gif"].includes(extension)
    // console.log('img.thumbnail.match(/[^/]+(jpg|png|gif)$/)', isImg)
    const SlideItemImgEl = img.thumbnail ? isImg ? document.createElement("img") : document.createElement("video") : document.createElement("div");
    if (SlideItemImgEl.tagName === "DIV") {
      SlideItemImgEl.className = "emptyBox"
      SlideItemImgEl.textContent = "Thumbnail not available!"
    } else {
      SlideItemImgEl.src = img.thumbnail;
      if (!img.thumbnail.match(/[^/]+(jpg|png|gif)$/)) {
        SlideItemImgEl.autoplay = true
        SlideItemImgEl.muted = true
        SlideItemImgEl.loop = true
        SlideItemImgEl.alt = img.alt;
      }
    }

    // Creating title
    const SlideItemTitleEl = document.createElement("p");
    SlideItemTitleEl.className = "thumbnail-title"
    SlideItemTitleEl.textContent = img.title

    // Appending the video element to the wrapper
    SlideEl.appendChild(SlideItemTitleEl);
    SlideEl.appendChild(SlideItemImgEl);

    // Creating parent slide element for modal 
    const ModalSlideEl = document.createElement("div");
    ModalSlideEl.className = "swiper-slide modal-swiper-slide";

    // Create a corresponding iframe element for each slide
    mountIFrameTo(ModalSlideEl, img)

    // Appending modal slide to modal container
    modalSlides.appendChild(ModalSlideEl);
  });
  return slides
}

// Converts the video object to iframe and appends it to the given parent
const mountIFrameTo = (parent, vidObj) => {

  // Fetching liked videos from the localStorage else an empty array
  // TODO: this works for the single carousel. Need the handle if multiple carousels are there
  const likedList = JSON.parse(localStorage.getItem("likedVideos")) ?? [];

  // iFrame element
  const ModalSlideItemWrapperEl = document.createElement("div");
  ModalSlideItemWrapperEl.className = "video-player-wrapper";
  const ModalSlideItemWrapperEl2 = document.createElement("div");
  ModalSlideItemWrapperEl2.className = "video-player-wrapper2";

  // Creating an iframe element
  const ModalSlideItemVidEl = document.createElement("iframe");
  ModalSlideItemVidEl.className = "video-player";
  ModalSlideItemVidEl.style.aspectRatio = vidObj.aspect_ratio.split(":")[0] + " / " + vidObj.aspect_ratio.split(":")[1];

  // Commented this code as we need to load the iframe on the 
  // next / prev action. So moved this logic to playActiveSlideVideo function
  // ModalSlideItemVidEl.src = `${vidObj.url}?autoplay=false&controls=false`;

  // Attributes for iframe
  ModalSlideItemVidEl.setAttribute(
    "allow",
    "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
  );

  ModalSlideItemVidEl.setAttribute("allowfullscreen", "true");
  ModalSlideItemVidEl.dataset.play = "false"

  // ---------------------------------- Creating buttons & progressbar ---------------------------

  // Mute button
  const ModelSlideItemVidActionMute = document.createElement("img");
  ModelSlideItemVidActionMute.id = "muteButton";
  ModelSlideItemVidActionMute.src = "/assets/images/unmute.png"

  // These 2 buttons are not needed anymore -----------------------------------
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
  // --------------------------------------------------------------------------

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
  ModelSlideItemVidLike.src = likedList.includes(vidObj.uuid) ? "/assets/images/heart-filled.svg" : "/assets/images/heart-outlined.svg"

  // Share button
  const ModelSlideItemVidShare = document.createElement("img");
  ModelSlideItemVidShare.id = "Share";
  ModelSlideItemVidShare.className = "share";
  ModelSlideItemVidShare.src = "/assets/images/send.svg"


  //---------- Appending the actions and progressbar to the slide's wrapper element ------------
  ModalSlideItemWrapperEl2.appendChild(ModelSlideItemVidActionMute);
  // ModalSlideItemWrapperEl.appendChild(ModelSlideItemVidActionPlayToggle);
  // ModalSlideItemWrapperEl.appendChild(ModelSlideItemVidActionDuration);
  ModalSlideItemWrapperEl2.appendChild(ModelSlideItemVidProgressbar);
  ModalSlideItemWrapperEl2.appendChild(ModelSlideItemVidLike);
  ModalSlideItemWrapperEl2.appendChild(ModelSlideItemVidShare);
  ModalSlideItemWrapperEl2.appendChild(ModalSlideItemVidEl);
  ModalSlideItemWrapperEl.appendChild(ModalSlideItemWrapperEl2);

  // Appending wrapper element to the parent
  parent.appendChild(ModalSlideItemWrapperEl);

  // ------------------------------- Events for the buttons ------------------------------------
  ModelSlideItemVidLike.addEventListener("click", (e) => handleVideoLike(e, vidObj, ModelSlideItemVidLike))
  ModalSlideItemWrapperEl.addEventListener("click", () =>
    toggleMute(ModalSlideItemVidEl)
  );
  ModelSlideItemVidShare.addEventListener("click", handleVideoShare)
};

// Toggles mute state
const toggleMute = (ModalSlideItemVidEl) => {
  // Here we are storing the mute state in the window object
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
  // Toggling between mute and unmute icons
  muteBtn.src = window.mute ? "/assets/images/mute.png" : "/assets/images/unmute.png"
};

// Changes the mute state with given state
export const muteVideo = (ModalSlideItemVidEl, mute = false) => {
  const muteBtn = ModalSlideItemVidEl.parentElement.querySelector("#muteButton")
  if (mute) {
    ModalSlideItemVidEl.contentWindow.postMessage(
      "mute",
      "https://video.dietpixels.net"
    );
    // Storing the mute state to window object to use it globally.
    window.mute = true
  } else {
    ModalSlideItemVidEl.contentWindow.postMessage(
      "unmute",
      "https://video.dietpixels.net"
    );
    window.mute = false
  }
  // Toggling between mute and unmute icons
  muteBtn.src = window.mute ? "/assets/images/mute.png" : "/assets/images/unmute.png"
};

// Toggling play / pause of the video by sending postMessage to the player throught iframe
// The second argument is a forced boolean value if we don't want to toggle and give a fixed state
export const playPauseToggle = (
  ModalSlideItemVidEl,
  pause = false,
) => {
  // Toggle play state . TODO should relay on data-[state] - DONE
  // Storing the play/pause state in the data attribute of the DOM element
  if (ModalSlideItemVidEl.dataset.play === "true" || pause === true) {
    // Sending the pause event to the player through iframe
    ModalSlideItemVidEl.contentWindow.postMessage(
      "pause",
      "https://video.dietpixels.net"
    );
    ModalSlideItemVidEl.dataset.play = "false";
    // Clearing the fetching of the played duration when video pauses.
    // We have started it using setInterval below. 
    clearInterval(ModalSlideItemVidEl.dataset.intervalID);
  } else if (ModalSlideItemVidEl.dataset.play === "false") {

    // Sending the play event to the player through iframe
    ModalSlideItemVidEl.contentWindow.postMessage(
      "play",
      "https://video.dietpixels.net"
    );
    ModalSlideItemVidEl.dataset.play = "true";

    // Fetching played duration
    ModalSlideItemVidEl.contentWindow.postMessage(
      "duration",
      "https://video.dietpixels.net"
    );
    // When the video starts playing, we are fetching the played duration
    // after every 1 second using this setInterval 
    let flag = setInterval(() => {
      ModalSlideItemVidEl.contentWindow.postMessage(
        "duration",
        "https://video.dietpixels.net"
      );
    }, 1000);
    // Setting the intervalID to the data attribute to clear it later when the
    // video pauses.
    ModalSlideItemVidEl.dataset.intervalID = flag
  }
  // Unmuting the video when we play it.
  if (window.mute)
    muteVideo(ModalSlideItemVidEl, true)
  else
    muteVideo(ModalSlideItemVidEl, false)

};

// Like function
const handleVideoLike = (e, vidObj, ModelSlideItemVidLike) => {
  e.stopPropagation()

  // Fetching liked videos from the localStorage
  const likedList = JSON.parse(localStorage.getItem("likedVideos")) ?? [];
  // If not liked, they are stored in the liked array in the localstorage
  if (!likedList.includes(vidObj.uuid)) {
    localStorage.setItem("likedVideos", JSON.stringify([...likedList, vidObj.uuid]))
    ModelSlideItemVidLike.src = "/assets/images/heart-filled.svg";
  }
  // If liked, they are removed from the liked array in the localstorage
  else {
    localStorage.setItem("likedVideos", JSON.stringify([...likedList.filter(uuid => uuid !== vidObj.uuid)]))
    ModelSlideItemVidLike.src = "/assets/images/heart-outlined.svg";
  }
}

// Share function
const handleVideoShare = async (e) => {
  e.stopPropagation()

  // TODO: Need to detect the device instead of relying on the screen width
  // Open the native share popup in android/ios devices
  if (window.innerWidth < 1200)
    navigator
      .share({
        title: document.title,
        text: "Have a look at this product!",
        url: window.location.href
      })
      .then(() => { })
      .catch(err => console.log("Error while sharing", err));
  // Or copy the link to the clipboard in computers
  else
    navigator.clipboard.writeText(window.location.href);
}