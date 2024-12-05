import {css} from 'lit';

export const cardStyles = css`
  .card-container::-webkit-scrollbar {
    display: none;
  }

  #product-card {
    width: 230px;
    height: 120px;
    background: white;
    color: white;
    border-radius: 8px;
    scroll-snap-align: start;
  }

  @media screen and (max-width: 640px) {
    #product-card {
      width: 280px;
    }
  }

  p {
    color: black;
  }

  .redirectIcon {
    float: right;
    display: inline;
    margin-right: 8px;
  }

  #product-thumbnail {
    padding: 8px;
    border-radius: 12px;
    width: 80px;
  }

  .product-info {
    color: black;
    margin-top: 8px;
    float: right;
  }

  .product-title {
    font-size: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 1;
    -webkit-line-clamp: 1;
  }

  .product-description {
    margin-top: 6px;
    font-size: small;
    font-weight: 500;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  .product-pricing {
    margin-top: 6px;
    color: black;
    font-weight: 600;
    font-size: 14px;
  }

  .product-shop-now {
    height: 25px;
    padding: 5px;
    width: 90%;
    color: white;
    background-color: black;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }

  .product-cart {
    height: 20px;
    margin-bottom: -4px;
  }
`;
