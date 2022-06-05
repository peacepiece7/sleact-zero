import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'; // ts를 blocking식으로 검사하는데(에러시 블락함), webpack, ts를 동시에 검사하도록함

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  name: 'sleact',
  mode: isDevelopment ? 'development' : 'production', // NODE_ENV
  devtool: isDevelopment ? 'hidden-source-map' : 'inline-source-map', // dev tool설정 inline-source-map or eval
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // babel이 처리할 확장자 목록
    alias: {
      // ../../../hello.js -> hooks/hello.js 변환
      // pages, hooks, queries 이런 거랑 경로 정해주는 거랑 같음 (~hooks, @hooks, hooks 다 상관없음) import App from "@layout/hello.tsc" 이렇게 가져옴
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    // 진입점
    app: './client',
    // app2: "./clent", 여러개 가능함
    // app3: "./clent"
  },
  module: {
    // tsx ts를 js로 반환해줌
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env', // '@babel/preset-env가 브라우저 호환성을 담당
              {
                targets: { browsers: ['IE 11'] }, // target : "last 2 chrome versions", "IE 11" 등등 적어주면 됨
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react', // @babel/preset-env가 react, typescript까지 처리하려면(ts, react도 IE 11지원하게 하려면) 이 코드가 필요
            '@babel/preset-typescript',
          ],
          env: {
            // hot reload 역할
            development: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/, // css -> js로 변환해주는 곳
        use: ['style-loader', 'css-loader'], // loader라는 애들이 css를 js로 바꿔줌
      },
    ],
  },
  plugins: [
    // ts checker plugin
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }), // react에서 NODE_ENV사용할 수 있게 해줌 react에서는 원래 불가능 원래는 node runtimme환경에서만 가능
  ],
  output: {
    // __dirname => config파일 실행 경로
    path: path.join(__dirname, 'dist'),
    filename: '[name].js', // [어쩌고].js로 변환
    publicPath: '/dist/',
  },
  devServer: {
    historyApiFallback: true, // react router에 필요한 설정
    port: 3090, // backend 3095 , fromt 3090
    devMiddleware: { publicPath: '/dist/' }, // <script src="/dist/app.js"/>랑 src 같아야함
    static: { directory: path.resolve(__dirname) },
    proxy: {
      '/api/': {
        // proxy target의 origin을 변경하겠다. (cors를 front에서 막는 방법) 둘 다 localhost일 경우만 가능
        target: 'http://localhost:3095',
        changeOrigin: true,
      },
    },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(
    new ReactRefreshWebpackPlugin({
      overlay: {
        useURLPolyfill: true,
      },
    }),
  );
}
if (!isDevelopment && config.plugins) {
}

export default config;
