## 개발환경 설정

### Using CRA

```bash
create-react-app custom-react-router
cd custom-react-router
```

### 의존성 설치

```bash
yarn add history querystringfy path-to-regexp
```

#### [history](https://github.com/ReactTraining/history)

다양한 브라우저 환경에서 브라우저의 history api 를 쉽게 관리할 수 있게 도와주는 api 이다. 자세한 사항은 위 링크를 통해 확인하자.

#### [querystringfy](https://www.npmjs.com/package/querystringify)

쿼리 문자열과 js 객체간의 변환을 돕는모듈이다. 간단한 사용예는 아래와 같다.

```js
cons qs = require('querystringify');

// qs.parse
qs.parse('?foo=bar');         // { foo: 'bar' }
qs.parse('foo=bar');          // { foo: 'bar' }
qs.parse('foo=bar&bar=foo');  // { foo: 'bar', bar: 'foo' }
qs.parse('foo&bar=foo');      // { foo: '', bar: 'foo' }

// qs.stringify
qs.stringify({ foo: bar });       // foo=bar
qs.stringify({ foo: bar }, true); // ?foo=bar
qs.stringify({ foo: bar }, '&');  // &foo=bar
qs.stringify({ foo: '' }, '&');   // &foo=
```

### [path-to-regexp](https://github.com/pillarjs/path-to-regexp)

`/user/:name`과 같은 경로 문자열을 정규식으로 변환하는 모듈

## 간략한 개요

핵심은 브라우저의 history api 이다. Router 컴포넌트의 상대관리 대상이 브라우저의 history 객체이고, 해당 객체의 상태 변화(정확히는 `history.loacation.pathname` ) 에 따라 어떤 컴포넌트를 렌더링할지 결정한다. 결국은 react-router 도 결국은 컴포넌트에 해당한다.

### Router 컴포넌트의 역할

`useState`를 통해 `history` 객체를 상태로 관리한다

`useEffect` 에 `history.listen`을 등록해 `history(route)` 의 변화를 감지하여, 변화가 있으면 `setState`(`setRoute`)로 `history(route)` 상태를 변경하여 컴포넌트의 리렌더링을 발생시킨다.

```jsx
import React, { useState, useEffect } from 'react';
import { locationToRoute } from './util';
import { history, RouterContext } from './context';
import { Route } from './Route';
import { Link } from './Link';

function Router(props) {
  const [route, setRoute] = useState(locationToRoute(history.location));

  const handleRouterChange = location => {
    const route = locationToRoute(location);
    setRoute(route);
  };

  useEffect(() => {
    const unlisten = history.listen(handleRouterChange);
    return () => {
      unlisten();
    };
  }, []);

  const { children } = props;
  const routerContextValue = { route, history };
  // const is404 = routes.indexOf(route.path) === -1;
  return (
    <RouterContext.Provider value={routerContextValue}>
      {children}
    </RouterContext.Provider>
  );
}

export { history, RouterContext, Router, Route, Link };
```

### Link 컴포넌트의 역할

BrowerRouter의 하위컴포넌트로`history.push(path)` 를 통해 히스토리 객체의 변경을 유도한다

```jsx
import React, { useContext } from 'react';
import { RouterContext, history } from './context';

export function Link({ to, onClick, children }) {
  const { route } = useContext(RouterContext);
  const handleClick = e => {
    e.preventDefault();
    // to 가 현재 path와 같다면 네비게이션을 진행하지 않음
    if (route.path === to) {
      return;
    }

    // 페이지 이동 이외에 별도의 onclick 이벤트가 있을경우 먼저 실행한다.
    if (onClick) {
      onClick(e);
    }

    history.push(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}
```

### Route 컴포넌트의 역할

`if(path=== history.location.pathname)` 를 통해 `prop`으로 전달된 `path` 속성과 `history.loacation.pathname` 속성이 같을 경우 `prop`으로 전달된 `component` 를 렌더링한다.

```jsx
import React, { useContext } from 'react';
import { RouterContext } from './context';
import { matchPath } from './util';

export function Route({
  path,
  exact = false,
  strict = false,
  sensitive = false,
  render,
  component: Component,
}) {
  const { route, history } = useContext(RouterContext);

  const match = matchPath(route.path, { path, exact, strict, sensitive });
  debugger;
  if (!match) return null;

  if (Component)
    return <Component history={history} match={match} location={route} />;

  if (render) return render({ match });

  return null;
}
export default Route;
```

## Router 옵션

### exact

`location.pathname` 과 정확하게 일치하는지에 대한 옵션

```jsx
<Route exact path="/one" component={About} />
```

|  path  | location.pathname |  exact  | matches? |
| :----: | :---------------: | :-----: | :------: |
| `/one` |    `/one/two`     | `true`  |    no    |
| `/one` |    `/one/two`     | `false` |   yes    |

### Strict : bool

끝에 나오는 구분자(delimiter, 주로 "/" )에 대한 옵션

```jsx
<Route exact strict path="/one" component={About}
```

|  path   | location.pathname | matches? |
| :-----: | :---------------: | :------: |
| `/one/` |      `/one`       |    no    |
| `/one/` |      `/one/`      |   yes    |
| `/one/` |    `/one/two`     |   yes    |

### sensitive: bool

대소문자 구분에 관한 옵션

```jsx
<Route sensitive path="/one" component={About} />
```

|  path  | location.pathname | sensitive | matches? |
| :----: | :---------------: | :-------: | :------: |
| `/one` |      `/one`       |  `true`   |   yes    |
| `/One` |      `/one`       |  `true`   |    no    |
| `/One` |      `/one`       |  `false`  |   yes    |

### multiple path

```jsx
<Router>
  <Route path={['/home', '/users', '/widgets']} component={Home} />
</Router>
```
