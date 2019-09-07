import React, { useContext } from 'react';
import { RouterContext, history } from './context';

export function Link({ to, onClick, children }) {

  const { route } = useContext(RouterContext);
  const handleClick = e => {
    
    e.preventDefault();
    // to 가 현재 path와 같다면 네비게이션을 진행하지 않음
    if(route.path === to) {
      return;
    }

    // 페이지 이동 이외에 별도의 onclick 이벤트가 있을경우 먼저 실행한다.
    if(onClick) {
      onClick(e);
    }

    history.push(to);
  }

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  )
}