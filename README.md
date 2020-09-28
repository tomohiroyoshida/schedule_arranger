# 予定調整くん

[N予備校Webプログラミング入門コース](https://www.nnn.ed.nico/pages/programming/)で作成した、GitHubアカウントを使った大人数で予定調整ができるのWebアプリケーションです。

## 概要
使い方
1. [こちらからホームページにアクセス](https://afternoon-gorge-50344.herokuapp.com/)してください。
2. GitHubのアカウントを使って認証、ログインをしてください。
3. 「予定をつくる」では、みんなで集まりたい予定を作成できます。<br>
「予定名」「メモ」「候補日程」を入力して「予定をつくる」ボタンを押してください。
4. 自分が作った予定に関しては編集をすることができます。他人が作った予定は編集できません。<br>共有用のURLも記載されています。
5. 作った候補日程に対して「出席」「わからない」「欠席」を登録することができます。
6. 「この予定を編集する」から予定の削除を行えます。

使用技術
- フロントエンド
  - JavaScript
  - pug
  - jQuery
  - Bootstrap
- バックエンド
  - Node.js
  - Express
- ツール・ミドルウェア・その他
  - PostgreSQL
  - Sequelize
  - Jest
  - Webpack
  - Websocket
  - GitHub OAuth
  - Circle CI
  - Heroku
  - Linux(Ubuntu)

工夫した点
- セキュリティ対策(特にCSRF)を行いました。
- テストを書き、Circle CIを使って自動テストができるようにしています。

難しかった点
- 初めてのバックエンド開発だったこともあり、DBの操作やルーティングなどが難しかった。
