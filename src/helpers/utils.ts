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
export function changeActiveReelParam(param: string, value: string) {
  const url = removedURLParameter(window.location.href, param);
  const newUrl = new URL(url);
  newUrl.searchParams.append(param, value);
  history.replaceState(null, '', newUrl);
}