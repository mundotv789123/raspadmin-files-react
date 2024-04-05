import styled from "styled-components"

const PathLink = styled.div`
  font-size: 11pt;
  font-weight: bold;
  margin-left: 25px;
  margin-right: auto;
  color: white;
  display: flex;
  overflow-x: scroll;
  & p, a {
    display: block;
    align-self: center;
  }
  & a {
    color: white;
    margin: 0 2px;
    padding: 2px;
    border-radius: 5px;
    max-width: 120px;
    min-width: 45px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
`

interface PropsInterface {
  path: string
}

export default function PathNavigator(props: PropsInterface) {
  return (
    <PathLink>
      <p>/</p><a href="#/" title="home">home</a>
      {props.path && props.path.split("/").filter(p => p).map((p, i) => {
        let link = '';
        props.path.split('/').filter(p => p).forEach((l, li) => { if (li <= i) link += `/${l}` });
        return (<><p>/</p><a key={i} href={`#${encodeURIComponent(link)}`} title={p}>{p}</a></>)
      })}
    </PathLink>
  )
}