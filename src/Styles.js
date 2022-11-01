
import styled from 'styled-components';
import { styleReset } from 'react95';
import { createGlobalStyle } from 'styled-components';

import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

export const Wrapper = styled.div`
  padding: 5rem;
  .window-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .close-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-left: -1px;
        margin-top: -1px;
        transform: rotateZ(45deg);
        position: relative;
        &:before,
        &:after {
          content: '';
          position: absolute;
          background: rgb(10, 10, 10);
        }
        &:before {
          height: 100%;
         width: 3px;
          left: 50%;
          transform: translateX(-50%);
        }
        &:after {
          height: 3px;
          width: 100%;
          left: 0px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
`;

export const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
`;