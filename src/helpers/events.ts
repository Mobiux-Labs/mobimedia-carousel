export const SlideClickEvent = (slide_index: number) => {
  type SlideClickEventDetail = {
    slide_index: number;
  };
  const event = new CustomEvent<SlideClickEventDetail>('onSlideClick', {
    bubbles: true,
    composed: true,
    cancelable: true,
    detail: {
      slide_index: slide_index,
    },
  });
  return event;
};

export type SlideClickEvent = ReturnType<typeof SlideClickEvent>;
