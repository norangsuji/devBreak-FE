import { css } from "@emotion/react";

const globalStyles = css`
  * {
    margin: 2rem 5rem; /* '4srem'에서 '4rem'으로 수정 */
    padding: 0;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  html,
  body,
  div,
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  form,
  label,
  table {
    margin: 0.5rem; /* 5vh를 rem으로 변환 (예시) */
    padding: 0;
    border: 0;
    font-size: 1rem; /* 10px를 rem으로 변환 */
    vertical-align: baseline;
  }

  body {
    line-height: 1;
    font-family: "Pretendard", "Urbanist", sans-serif; /* 기본 폰트 설정 */
    background-color: #181c22;
    margin-bottom: 10rem; /* 100px를 rem으로 변환 (예시) */
    overflow-y: auto; /* 수직 스크롤 가능 */
    overflow-x: hidden; /* 수평 스크롤은 숨김 */
  }

  ol,
  ul {
    list-style: none;
  }

  button {
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  /* Firefox */
  html {
    scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
  }

  /* Chrome, Safari, Edge, Opera */
  html::-webkit-scrollbar {
    display: none; /* 스크롤바 숨기기 */
  }
`;

export default globalStyles;
