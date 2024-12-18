// Removes the parameter from the URL and returns the new URL
export function removedURLParameter(url: string, parameter: string) {
  //prefer to use l.search if you have a location/link object
  const urlparts = url.split('?');
  if (urlparts.length >= 2) {
    const prefix = encodeURIComponent(parameter) + '=';
    const pars = urlparts[1].split(/[&;]/g);

    //reverse iteration as may be destructive
    for (let i = pars.length; i-- > 0; ) {
      //idiom for string.startsWith
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
  }
  return url;
}

// Changes the query param with the new uuid of the new active reel
export function changeActiveReelParam(
  param: string,
  value: string,
  removeShared = false
) {
  const url = removedURLParameter(window.location.href, param);
  const newUrl = new URL(url);
  newUrl.searchParams.append(param, value);
  if (removeShared) {
    newUrl.searchParams.delete('shared');
  }
  history.replaceState(null, '', newUrl);
}

export function formatPrice(price: number) {
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(price);
}

export function IngestCall(
  event_type: string,
  vidId: string,
  playlistId: string,
  sessionId: string,
  userId: string
) {
  fetch('https://ingest.dietpixels.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: event_type,
      video_id: vidId,
      playlist_id: playlistId,
      session_id: sessionId,
      user_id: userId,
    }),
  });
}
