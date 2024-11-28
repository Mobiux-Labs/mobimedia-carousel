# Dietpixels Carousel (formerly MobiMedia)

# @mobimedia/carousel

A carousel component for displaying Dietpixels playlist in reels view.

## Installation

```bash
npm install @mobimedia/carousel
```

## Usage

```html
<body>
  <mobi-carousel></mobi-carousel>
  <script type="module" src="./node_modules/@mobimedia/carousel/index.js"></script>
</body>
```
## Next.js

```js
"use client";

import Carousel from "@mobimedia/carousel-react";

const MobiCarousel = ({id}) => {
  return <Carousel playlistId={id} />;
};

export default MobiCarousel;

// Dynamically Import the Component

const MobiCarousel = dynamic(() => import("./MobiCarousel"), {
  ssr: false,
});

<MobiCarousel playlistId="<id>" />
```

#WIP
