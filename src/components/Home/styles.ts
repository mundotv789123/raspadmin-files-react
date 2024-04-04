import styled from "styled-components"

export const Container = styled.div`
  display: grid;
  grid-template-columns: 220px auto;
  grid-template-rows: 64px auto;
  grid-template-areas: "h n" "m a";
  height: 100vh;
  transition: grid-template-columns .2s;
  background: radial-gradient(transparent, rgba(0, 0, 0, 0.4));
  @media(max-width:950px) {
    grid-template-columns: 0 auto;
  }
`

export const Header = styled.header`
  backdrop-filter: blur(5px);
  grid-area: h;
  display: flex;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
  & .title {
    margin: auto;
  }
`

export const CollapseButtom = styled.button`
  display: none;
  color: white;
  background-color: transparent;
  border: none;
  font-size: 15pt;
  margin: auto 20px;
  cursor: pointer;
  &:hover {
    color: #dddddd;
  }
  @media(max-width:950px) {
    display: block;
  }
`

export const Nav = styled.nav`
  grid-area: n;
  display: flex;
  background: rgba(0, 0, 0, 0.5);
  overflow-x: auto;
  white-space: nowrap;
  backdrop-filter: blur(5px);
`

export const Main = styled.main`
  grid-area: m;
  overflow-y: scroll;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`

export const Aside = styled.aside`
  grid-area: a;
  overflow-y: scroll;
  background: rgba(9, 9, 9, 0.3);
`

export const SearchInput = styled.input`
  background-color: rgba(0, 0, 0, 0.3);
  align-self: center;
  margin-right: 25px;
  padding: 5px;
  outline: none;
  border-radius: 7px;
  border: solid 1px gray;
  color: white;
  font-size: 12pt;
  width: 150px;
  transition: width 100ms;
  &:focus {
    width: 250px;
  }
`