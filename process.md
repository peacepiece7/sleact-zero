# front

# getting start

- nodejs, mysql 설치
- github/zeroCho/sleact download

npm 설치 후 db생성

```sh
npm i
npx sequelize db:create
```

## leact(slack)는 work space -> chnnel 이라는 세션을 만듬

table 생성, workspace의 channel을 생성

```sh
npm run dev
npx sequelize db:seed:all

```

### tip

- modles 폴더 -> tables 생성 관련
- seeders 폴더 work space -> chnnel 생성 관련
- 오라클 (db -> schema -> table -> rows)
- mysql (db -> table -> rows) ? scehma 있자너?

## npm run dev 로 db연결 확인

- npm run dev

## front setting

- setting folder 소스코드 복사해서 붙여넣기
- cra 강좌에서 안씀 (다 갖쳐줘 있어서)
