import styled from '@emotion/styled'

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #ddd;

  display: flex;
  flex-direction: row-reverse;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(5px);
    background-image: url(${require('#/assets/img/login-bg.webp').default});
    background-size: contain;
    background-position-x: 0%;
    background-position-y: 0%;
  }
`

export const LoginWrapper = styled.div`
  max-width: 500px;
  height: 100%;
  background: #ddd;
  transition: all 0.3s ease-out;
  flex: 1;
  position: relative;
  text-align: center;
  &:hover {
    max-width: 50vw;
  }

  > form {
    width: 500px;
    margin: 40vh auto;
    padding: 0 36px;
    .ant-form-item-has-error .ant-form-item-explain {
      text-align: right;
    }
    .login-btn {
      width: 100%;
      margin-top: 16px;
    }
  }
`
