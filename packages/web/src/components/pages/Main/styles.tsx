import { Layout } from 'antd'
import styled from '@emotion/styled'

export const Sider = styled(Layout.Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;

  > div {
    display: flex;
    flex-direction: column;
    padding-bottom: 36px;
  }
`

export const Logo = styled.div`
  height: 150px;
`

export const MenuSpace = styled.div`
  flex: 1;
  height: 100%;
`

export const Content = styled.div`
  margin-left: 200px;
`
