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
    min-width: 25px;
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

function LinkUrl(props: { href: string, title: string }) {
  return (<><p>/</p><a href={props.href} title={props.title}>{props.title}</a></>)
}

export default function PathNavigator(props: PropsInterface) {
  return (
    <PathLink>
      <LinkUrl title="home" href="#/"/>
      {props.path && props.path.split("/").filter(p => p).map((p, i) => {
        let link = '';
        props.path.split('/').filter(p => p).forEach((l, li) => { if (li <= i) link += `/${l}` });
        return <LinkUrl title={p} href={`#${encodeURIComponent(link)}`} key={i}/>
      })}
    </PathLink>
  )
}