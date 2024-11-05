// Removes the parameter from the URL and returns the new URL
export function removedURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '')
    }
    return url;
}

// Changes the query param with the new uuid of the new active reel 
export function changeActiveReelParam(param, value) {
    const url = removedURLParameter(window.location.href, param)
    let newUrl = new URL(url);
    newUrl.searchParams.append(param, value)
    history.replaceState(null, '', newUrl)
}