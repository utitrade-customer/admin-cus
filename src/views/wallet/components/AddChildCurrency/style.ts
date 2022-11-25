import styled from 'styled-components';

export default styled.div`
  .ant-select-selection-item {
    display: flex;
    align-items: center;
    img {
      display: none;
    }
  }
  .ant-select-selection-search-input {
    &:focus {
      border: none !important;
    }
  }
`;
