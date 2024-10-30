let video_player = document.getElementById("vid1");
const muteButton = document.getElementById("muteButton");
const playToggleButton = document.getElementById("playToggleButton");
const durationButton = document.getElementById("durationButton");

document.amal_vid = video_player;

muteButton.addEventListener("click", () => {
  //   muteButton.textContent = "Mute";
  console.log("Begin Sound State:", muteButton.textContent);
  // Toggle mute state . TODO should relay on data-[state]
  if (muteButton.textContent == "Mute") {
    video_player.contentWindow.postMessage(
      "mute",
      "https://video.dietpixels.net"
    );
    muteButton.textContent = "Unmute";
    // console.log("Inside mute: ", muteButton.textContent);
  } else if (muteButton.textContent == "Unmute") {
    video_player.contentWindow.postMessage(
      "unmute",
      "https://video.dietpixels.net"
    );
    muteButton.textContent = "Mute";
    // console.log("Inside unmute: ", muteButton.textContent);
  }
});

playToggleButton.addEventListener("click", () => {
  console.log("Begin Play State:", playToggleButton.textContent);
  // Toggle mute state . TODO should relay on data-[state]
  if (playToggleButton.textContent == "Pause") {
    video_player.contentWindow.postMessage(
      "pause",
      "https://video.dietpixels.net"
    );
    playToggleButton.textContent = "Play";
    // console.log("Inside pause: ", playToggleButton.textContent);
  } else if (playToggleButton.textContent == "Play") {
    video_player.contentWindow.postMessage(
      "play",
      "https://video.dietpixels.net"
    );
    playToggleButton.textContent = "Pause";
    // console.log("Inside play: ", playToggleButton.textContent);
  }
});

// track duration
durationButton.addEventListener("click", () => {
  video_player.contentWindow.postMessage(
    "duration",
    "https://video.dietpixels.net"
  );
});

// TODO.This is not working. Connect with Rishab on how to implement this.
addEventListener("message", (e) => {
  if (
    typeof e.data.currentDurationMs != "undefined" &&
    typeof e.data.totalDurationMs != "undefined"
  ) {
    console.log("Current Duration", e.data.currentDurationMs);
    console.log("Total Duration", e.data.totalDurationMs);
  }
});
