import { createGlobalStyle } from "styled-components";

export const GlobalStyle: React.FC = createGlobalStyle`
  /* Box-sizing border-box for all elements */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* Reset margin, padding, and border for all elements */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video, ::file-selector-button,
  ::backdrop {
    margin: 0;
    padding: 0;
    border: 0 solid;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for block elements */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }

  /* Box-sizing and font settings for HTML */
  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(
      --default-font-family,
      ui-sans-serif,
      system-ui,
      sans-serif,
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji'
    );
  }

  /* Set inheritable properties for body */
  body {
    line-height: inherit;
  }

  /* List styles */
  ol, ul, menu {
    list-style: none;
  }

  /* Blockquote and quotes resetting */
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }

  /* Table settings */
  table {
    border-collapse: collapse;
    border-spacing: 0;
    text-indent: 0;
    border-color: inherit;
  }

  /* Link resetting */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Button and form elements */
  button, input, optgroup, select, textarea, ::file-selector-button {
    font: inherit;
    color: inherit;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    overflow: visible;
    line-height: inherit;
    -webkit-appearance: none;
  }

  /* Specific inputs styles */
  input:where(:not([type='button'], [type='reset'], [type='submit'])),
  select,
  textarea {
    border: 1px solid;
  }

  button, input:where([type='button'], [type='reset'], [type='submit']) {
    appearance: button;
  }

  /* Focus ring styles */
  :-moz-focusring {
    outline: auto;
  }

  /* Reset for invalid styles in Firefox */
  :-moz-ui-invalid {
    box-shadow: none;
  }

  /* Placeholder opacity and color adjustments */
  ::placeholder {
    opacity: 1;
    color: color-mix(in srgb, black 50%, transparent);
  }

  /* Media elements and embeddings */
  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
    max-width: 100%;
    height: auto;
  }

  /* Hidden attribute */
  [hidden] {
    display: none !important;
  }

  /* Antialiasing for all elements */
  *, *::before, *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Disable user select except on text elements */
  *, *::before, *::after {
    user-select: none;
  }
  p, h1, h2, h3, h4, h5, h6, blockquote, pre, ul, ol, li, table, tr, th, td, input, textarea {
    user-select: text;
  }

  /* SVG and inline block reset */
  svg {
    // fill: currentColor;
    padding: 0px;
    background: none;
  }
`;
