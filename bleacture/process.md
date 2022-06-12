# npm init

```sh
npm init
npm i react react-dom typescript @types/react @types/react-dom
```

# package.lock.json

- 내가 의존하고 있는 버전의 자세한 설명을 적어둠
- package.json은 의존성을 전부 확인하긴 **힘듬**

# code convention (prettier, eslint)

```sh
npm i -D eslint prettier eslint-plugin-prettier eslint-config-prettier
```

# confing setting

```sh
mkdir ./.eslintrc
mkdir ./.prettierrc
mkdir ./.tsconfig.json
```

# ts를 js로 변환하는 방법2가지

1. ts -> js
2. ts -> babel -> js

## 2번을 하는 이유

- bebel이 -> css, html, image등등 js로 싹다 변환해줌

# webpack.config.ts

- react 무료 강좌를 보면 설명이 있음

typescript 소스코드 검사기는 tsconfig.json를 보고 검사함
실제로 js로 바꿔주는 webpack은 webpack.config.ts를 보고 있기 때문에 tsconfig.js와 webpack.config.ts가 겹치는 부분이 많음

# webpack.config.ts에 comment달아놨음

`
npm i -D webpack @babel/core babel-loader @babel/preset-env @babel/preset-react

npm i -D @types/webpack @types/node @babel/preset-typescript

npm i -D style-loader css-loader
`

# index.html 작성하기

- performence, seo등등 index.html이 엄청 중요함
- 핵심 css는 index.html에 넣어두고, 중요하지 않는 건 js로 부르는 걸 google이 추천함
- div id="app"안에 spa가 들어감

# npx webpack

npx webpack으로 webpack-cli사용가능

`npm i wepback -g`전역으로 설치하겠다 => cli로 사용하겠다는 의미 (요새 기피함)

npm i webpack 하고 npx webpack으로 webpack 사용하는 추세

## webpack이 webpack.config.ts 인식하게 하기

1. tsconfig-for-webpack-config.json

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "target": "ES5",
    "esModuleInterop": true
  }
}
```

2. `TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack` 명령어 입력
3. "scripts : {"build" : "TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack"} 입력, 하지만 window는 바로 실행되지 않지
4. `npm i cross-env` 설치
5. "scripts : {"build" : "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack"}
6. npm i ts-node
7. 이제 dist생김
8. index.html에서 /dist/app.js -> ./dist/app.js 해줘야함 경로 잘 보기~

- 이거 어째 알았냐? -> webpack ts랑 연동하기 -> 공식문서에 보면 있음

# build 무한 반복 -> hot reloading 설정 (cra는 다해줌 ㅎ) 이래서 cra ㅎㅎ

- hot reloading server가 필요

`npm i webpack-dev-server -D` proxy server 역할 + hot reloading 역할
`npm i webpack-cli @types/webpack-dev-server`

** library 만들 거 아니면 devDependency 구분 그다지 안 중요하다함 **

```sh
npm i @pmmmwh/react-refresh-webpack-plugin
npm i react-refresh
```

설치 후 webpack.config.ts 에 관련 모듈 추가 (comment 달아 놓음)

package.json "script"추가하기

```json
{
  "dev": "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack-dev-server --hot", // 옛날 버전
  "dev": "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack serve --env delevelment" // 4 ~ 5 버전
}
```

### 이렇게 하면 hot reloading, live reloading을 해줌

# react-router 써보기

`npm i react-router react-router-dom`
`npm i -D @types/react-router @types/react-router-dom`

대충 아래와 같이 작성 (react-router-dom v6기준)

```tsx
// client.tsx
render (<BrowserRouter><App/><BrowserRouter>)

// app.tsx
<Routes>
    <Route path="*" element={<Home/>}> // redirect
    <Route Path="/login" element={<LogIn/>}>
    <Route Path="/signup" element={<SighUp/>}>
<Routes/>
```

## redux의 대항마 recoil, suztand, jotai

1. spa(react)는 원래 root 경로 하나 뿐인 어플리케이션임
2. browser 주소를 변경하면 front 서버로 가고 spa특성상 뭘 치던 / 로 리다이렉팅됨 (index.html로 가는거임 html파일이 이거 하나 뿐이니까)
3. 여러개의 페이지로 라우팅 할 수 있는 이유는 devserver : {historyApiFallback: true}을 켜줬기 때문
4. fallback true 시 History Api가 작동하고 서버는 주소줄을 사기침
5. 새로고침할 때 / (root path)로 가야하는데(index.html로 가는 건 같음) devServer가 없는 주소를 있는거 마냥 페이지를 이동하는 거처럼 보이게해서 브라우져를 속임

# code spliting 개 중요

1. ssr 필요 없는 애들
2. page 단위로 spliting (react suspense가 code spliting임)

설치하고

```sh
npm i @loadable/component
npm i --save-dev @types/loadable__component
```

이래사용

```tsx
import loadable from '@loadable/component';

// code spliting
const LogIn = loadable(() => import('@pages/LogIn'));
```

### 18에 React.lazy suspense도 나왔으니까 한 번 보자

# emotion

### styled-componenet랑 같은데 ssr 설정이 편함

`npm i @emotion/react @emotion/styled`

# credentials

- 쿠키는 back에서 생성
- 프론트가 브라우저에 저장함 (브라우저 cookie에)
- widthCredentials = true를 해야함 (-근데 true안해도 되는 이유는 좀 하다보면 알겠지..)

# 상태 선언

```tsx

let missmatchError = false // ref2 다시 랜더링 되지 않으나, 전역 변수로 취급되어 전역 컨택스트가 오염됨

export default Home = () => {
  const [missmatchError, setChangeMissmatchError] = useState(false); // best
  let mismatchError = false // ref1
  useEffect(() => {
      if(something condition){
          mismatchError = true // ref1 이렇게하면 랜더링시 매번 missmatchError = false를 다시 가져오기때문에 missmatchError는 항상 false
      }
  })
};
```

### 화면에 되는 정보 -> useState

### 화면에 반영되지 않는 정보 -> useRef

# swr

- matate(key , boolean) => 상태 수동 갱신, 인자로 key와 화면 갱신 여부를 받음
- dedupingInterval = number(ms) => 자동 갱신 시간(캐싱 시간) default : 2000

```tsx
const [data, error, mutate] = useSWR('/api/userInfo)
const onSubmit() => axios.get("server/api/logout").then(() => mutate('/api/userInfo'))
```

### swr은 꼭 rest api만을 위한 것은 아님

- 아래처럼 다향한 상태관리 가능

```tsx
const [data, error, mutate] = useSWR('localstorageKey', (key) => {
  localStorage('data', key);
  return localStrage.getTimeByKey('data', key);
});
```

# children type

- props.children

```tsx
type Props = {
  title?: string;
  children: JSX.Element | JSX.Element[] | string | string[];
};
const Workspace: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};
```

# gravatar (feat. @types)

```sh
npm i gravatar @types/grabatar
```

### @types package를 설치해야하는 경우 확인하기

- npm package검색 후 해당 package의 title을 보면 title 제일 오른쪽에 아래와 같이 적혀있다.

### 1. DT

- @types를 설치해야함

### 2. TS

- @types가 필요없는 package임 ex) redux

### 3. 아무것도 없을 경우

- types를 직접 작성해줘여함

# menu modal (feat. event bubbling)

e.stopPropagation()으로 이벤트 버블링을 막기

### index.tsx

```tsx
import Menu from "@componenet/Menu"
export default const Workspae = () => {
  const [showUserMenu, setShowUserMenu] = useState(false)


  return <div onClcik={}>
    <Menu>
    <div>profile</div>
    <button>Logoout</button>
    </Menu>
  </div>
}
```

# input은 componenet를 분리하는게 좋음

- rerendering이 전체 layout에 일어나는 것을 방지할 수 있음

# deepth error eslinting하기

.eslint에 react-app 추가하고 아래 패키지 다운로드

```json
{
  "extends": ["plugin:prettier/recommended", "react-app"],
  "parser": "babel-eslint"
}
```

```cmd
npm i -D eslint-plugin-flowtype eslint-plugin-import eslint-plugin-jsx-a11y eslint-config-react-app
```

근데 나는 에러가 안나네
eslint 적용이안됨

# dayjs vs moment vs date-fns

- date-fns
  - lodash 방식
- dayjs
  - moment 상위 호환
  - 불변성이 지켜지고 가벼움
- momnet (luxon)

  - 불변성이 지켜지지 않음 (객체가 복사됨)
  - luxon이라는 상위호환 패키지가 나옴

- 결론 : luxon, dayjs, date-fns중 고르면 됨 (immutable)

# function call

```js
function foo(){}
foo()
foo.call()
foo.apply()
foo.bind()()
foo.`` // tagged templete literal
foo.`123`
```

### emotion의 tagged templete literal도 함수 호출의 한 문법

- 아래와 같이 변수명을 작성할 수 있음
- `` tagged 안에 오는 문자열이 하나의 인자로 적용됨

```ts
export const EachMention = styled.button<{ focus: boolean }>`
  display: flex;
  & img {
    margin-right: 5px;
  }
  ${({ focus }) =>
    focus &&
    `
    background: #1264a3;
    color: white;
  `};
`;
```

# emotion, 외부 라이브러리를 styling하기

- react-mentions는 기본적으로 아래와 같이 사용됨

```tsx
<MentionsInput>
  <Mentions />
</MentionsInput>
```

- emtion을 사용해서 아래와 같이 외부 라이브러리의 style을 확장할 수 있음

```tsx
// styles.tsx
export const MentionsTextarea = styled(MentionsInput)`
  display: flex;
  & img {
    margin-right: 5px;
  }
`
// ChatBox.tsx

<MentionsTextarea>
  <Mentions />
</MentionsTextarea>
```

# memo, useMemo, useCallback

- memo
  - componenet의 props가 같을 경우 자식이 rerendering되지 않게 해줌
- useMemo
  - hooks의 결과를 캐싱할 때 사용
  - 값을 반환함 (캐싱할 값)
- useCallback
  - hooks자체를 캐싱할 때 사용
  - 함수 자체를 캐싱 (dependency가 변하지 않으면 결과 값이 변하지 않는다)

```tsx
// result에 함수의 실행 결과를 캐싱함
const result = useMemo(
  () =>
    regexifyString({
      input: data.content,
      decorator() {
        // .. some large logic ..
        return <div>{result}</div>;
      },
    }),
  [data.content], // result가 변경되야할 떄를 알려주는 trigger (dependency)를 배열로 작성
);

// result에 캐싱할 함수를 반환함
const [cnt, setCnt] = useState(0);
const result = useCallback(
  () => {
    setCnt((pref) => pref + 1);
    regexifyString({
      input: data.content,
      decorator() {
        // .. some large logic ..
        return <div>{cnt}</div>;
      },
    });
  },
  [data.content], // result가 변경되야할 떄를 알려주는 trigger (dependency)를 배열로 작성
);

result();

// result()가 5번 호출 되었지만 data.content가 변하지 않음 => 0만 5번 출력됨 (cnt는 5까지 증가함)
// 6번째 클릭하는데 data.content가 변함 => cnt는 6이 출력됨
```

# server의 부담을 줄여주자 (feat. 날짜별로 데이터 묶기)

가공해야할 데이터가 많을 경우, 서버는 데이터를 제공하는 역할만 하고 프론트에서 가공하는게 좋음

서버가 cpu를 잡아먹는 작업이 많아질 수록 서비스가 터질 확률이 높아지기떄문 (nodejs는 싱글 스레드기 때문에 promise나 긴 로직에 매우 취약함)
