import {css} from 'lit';

export const cardStyles = css`
  .card-container::-webkit-scrollbar {
    display: none;
  }
  #product-card {
    margin-left: 15px;
    width: 210px;
    height: 120px;
    background: white;
    color: white;
    border-radius: 8px;
    flex-shrink: 0;
    scroll-snap-align: start;
  }

  p {
    color: black;
  }

  #product-thumbnail {
    padding: 5px;
    width: 80px;
    height: 120px;
  }

  .product-title {
    color: black;
    z-index: 10000;
    margin-left: 92px;
    margin-top: -65px;
  }
`;
