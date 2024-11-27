import {SlideResponse} from '../types';

export const getSlides = async (playlistId: String): Promise<SlideResponse> => {
  if (!playlistId) {
    throw new Error(
      "The 'playlistId' parameter is required and cannot be empty."
    );
  }

  const response = await fetch(
    `https://app.dietpixels.com/api/v1/public/playlists/${playlistId}/`
  );

  if (!response.ok) {
    throw new Error(`The playlist ID '${playlistId}' is invalid or not found.`);
  }

  const res = await response.json();
  return res;
};
