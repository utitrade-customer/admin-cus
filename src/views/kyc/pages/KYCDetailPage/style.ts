import styled from 'styled-components';
const font_size = 1;
const w = 20;
export default styled.div`
  background-color: #fff;
  .line-text {
    text-align: center;
    position: relative;
    font-size: 1.2rem;
  }
  .loading-kyc-detail {
    opacity: 0.5;
  }
  .line-text:before {
    content: '';
    width: 100%;
    height: 1px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-color: #363740;
  }

  .line-text span {
    display: inline-block;
    background-color: white;
    position: relative;
    z-index: 2;
    padding: 1rem;
    font-weight: 600;
  }
  .info {
    &__key {
      color: var(--green);
      font-size: ${font_size}rem;
      padding-right: 0.5rem;
      text-align: right;
      font-weight: bold;
    }

    &__value {
      font-size: ${font_size}rem;
    }
  }

  .content__avt {
    input {
      margin: auto;
      width: 12rem;
      height: 12.5rem;
      object-fit: cover;
      border: 5px solid #363740;
    }
  }
  .current-address__card {
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      display: block;
      height: ${w}em;
      width: calc(${w}em * 1.5);
      margin: auto;
      border: 5px solid #363740;
      object-fit: cover;
    }
  }
  .status--process {
    color: #ffc107;
  }
  .status--verify {
    color: #28a745;
  }
  .status--failed {
    color: #dc3545;
  }
`;
