let video_player = document.getElementById("vid1");
console.log(video_player);
const muteButton = document.getElementById("muteButton");
console.log(muteButton);
muteButton.addEventListener("click", () => {
  document.amal_vid = "video_player";
  //   muteButton.textContent = "Mute";
  console.log("Begin", muteButton.textContent);
  // Toggle mute state
  if (muteButton.textContent == "Mute") {
    video_player.postMessage("unmute");
    muteButton.textContent = "Unmute";
    console.log("Inside mute: ", muteButton.textContent);
  } else if (muteButton.textContent == "Unmute") {
    video_player.postMessage("mute");
    muteButton.textContent = "Mute";
    console.log("Inside unmute: ", muteButton.textContent);
  }
});
