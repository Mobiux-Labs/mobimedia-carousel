import {css} from 'lit';

export const styleSheet = css`
  .modal {
    /* Hidden by default */
    display: none;
    position: fixed;
    z-index: 2147483647 !important; /* Ensure it appears above other elements */
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden; /* Enable scroll if needed */
    background-color: rgba(0, 0, 0, 0.95); /* Semi-transparent background */
  }

  .modal-overlay {
    /* background-color: rgba(0, 0, 0, 0.95); */
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    /* z-index: 1000; */
  }

  .modal-content {
    /* background-color: rgba(0, 0, 0, 0.95); */
    /* height: 100%; */
    /* left: 0; */
    position: absolute;
    /* top: 0; */
    width: min(100vw, 1080px);
    left: 0;
    right: 0;
    margin: auto;
    z-index: 2147483647 !important;
  }

  .close {
    position: absolute;
    top: 18px;
    right: 6px;
    color: white;
    font-size: 60px;
    font-weight: lighter;
    cursor: pointer;
    z-index: 2147483647 !important;
    width: 50px;
    height: 50px;
  }
`;
