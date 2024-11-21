import {SlideResponse} from '../types';

export const getSlides = async (playlistId: String): Promise<SlideResponse> => {
  const response = await fetch(
    `https://app.dietpixels.com/api/v1/public/playlists/${playlistId}/`
  );
  const res = await response.json();
  return res;
};
