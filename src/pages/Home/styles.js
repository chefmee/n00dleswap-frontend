
import styled from 'styled-components';
import { styleReset } from 'react95';
import { createGlobalStyle } from 'styled-components';

import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

export const Wrapper = styled.div`
  padding: 5rem;
  height: 100vh;
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