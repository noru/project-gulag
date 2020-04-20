import styled from '@emotion/styled'

export const Wrapper = styled.div`
  width: calc(100vw - 200px);
  min-height: 100vh;
  padding: 24px 16px;
`
export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  vertical-align: middle;
  padding-bottom: 16px;
`

export const TableActions = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-right: 16px;
    font-size: 1.2em;
  }
`
