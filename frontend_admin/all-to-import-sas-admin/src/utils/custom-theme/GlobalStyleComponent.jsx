import { Global, css } from '@emotion/react';

const GlobalStyles = css`
  *:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

export const GlobalStyleComponent = () => <Global styles={GlobalStyles} />;
