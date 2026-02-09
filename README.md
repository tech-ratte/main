# ボードゲーム戦績管理システム（Catan）

Catanの戦績を記録・集計するWebアプリです。プレイヤー管理、ゲーム記録、ランキング/統計の閲覧ができます。

- Demo: https://frontend-gn26.onrender.com/#/catan

## 構成
- `FrontEnd/` Angularアプリ
- `BackEnd/` Django + DRF API
- `BackEnd/catan/` ドメインモデルとAPI
- `BackEnd/src/` Django設定

## 主な機能
- プレイヤー登録・編集、卒業生の表示切替、アイコン表示
- ゲーム開始登録（ゲーム名、日付、参加者、色）
- 進行中の記録（ターン管理、出目履歴、勝者表示）
- ランキング集計（プレイ回数、勝利数、勝率、ポイント、ボーナス）
- ゲーム一覧と詳細表示
- 出目グラフ（全体/個人）

## ***REMOVED***スタック
- Frontend: Angular 19, Angular Material, Chart.js, ng2-charts
- Backend: Django 5.1, Django REST Framework
- DB: PostgreSQL (Neon)
- Storage: Amazon S3 (django-storages)

## APIエンドポイント
- `GET/POST /api/player/`
- `GET/POST /api/gameResult/`
- `GET/POST /api/personalResult/`
- `GET /api/gameResult/latest/`
- `GET /api/gameResult/game-info/`
- `GET /api/personalResult/aggregate/`
