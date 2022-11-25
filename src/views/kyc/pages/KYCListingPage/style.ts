import styled from 'styled-components';
export default styled.div`
  .user_photo {
    input {
      width: 7em;
      height: 7em;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  thead tr th,
  tbody tr td {
    text-align: center;
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
