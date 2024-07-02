// to make any changes that affect entire application (like body background colour or global font settings)

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa; /* Change this color to your desired background color */
    color: #0BEC00;
  }
  .App {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 8px;
  }
  h1 {
    font-size: 24px; /* Change this size to your desired font size */
    color: #000000; /* Change this color to your desired font color */
    margicn-bottom: 20px;
  }
`;

export default GlobalStyle;
