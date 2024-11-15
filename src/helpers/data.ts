import {SlideResponse} from '../types';

export const getSlides = async (): Promise<SlideResponse> => {
  const response = await fetch(
    'https://mocx.mobiux.in/api/ae6a402d-a9ab-429f-b1c9-531ef3744e52/api/v1/public/playlists/0669e1c0-0bd8-75ab-8000-c31e231d8b81'
  );
  const res = await response.json();
  return res;
};
