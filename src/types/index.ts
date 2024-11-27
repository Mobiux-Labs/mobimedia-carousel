import {LitElement} from 'lit';

export interface Video {
  uuid: string;
  url: string;
  thumbnail: string;
  alt?: string;
}

export interface SlideResponse {
  uuid: string;
  display_title: string;
  description: string;
  thumbnail: string;
  videos: Video[];
}

export interface PlayerMessage {
  data: {
    currentDurationMs?: number;
    totalDurationMs?: number;
  };
}

export interface SwiperInstance {
  slides: HTMLElement[];
  activeIndex: number;
  previousIndex: number;
  destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
}

declare global {
  interface Window {
    modalSwiper: SwiperInstance | null;
    activeReelSlide: HTMLElement | null;
    mute: boolean;
  }
}

declare class MobiCarousel extends LitElement {
  playlistId: string;
}

export default MobiCarousel;
