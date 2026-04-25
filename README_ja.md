# Backlog User List

[Backlog](https://backlog.com/) スペースのユーザーおよびプロジェクト参加状況を抽出・可視化する Web ツールです。Cloudflare Workers + [Hono](https://hono.dev/) で動作します。

## 機能

- スペース内の全ユーザーを一覧表示（権限・最終ログイン・Nulab アカウント有無）
- 全プロジェクトを一覧表示（アーカイブ状態・参加ユーザー数・チーム数）
- プロジェクトごとのメンバー・チーム詳細をモーダルで確認
- メールアドレス / プロジェクトキーによる検索・フィルタ
- カラムソート、ページネーション、CSV ダウンロード
- ダークモード、日本語 / 英語 UI 切替
- API レートリミット表示

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| ランタイム | Cloudflare Workers |
| フレームワーク | Hono v4 |
| 言語 | TypeScript |
| ツール | Wrangler v4 |

## 前提条件

- Node.js (v18 以上)
- Backlog スペースの API キー（[発行方法](https://support-ja.backlog.com/hc/ja/articles/360035641754)）

## セットアップ

```bash
# 依存パッケージのインストール
npm install

# ローカル開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:8787` を開き、スペース ID・ドメイン・API キーを入力して「抽出実行」をクリックしてください。

## デプロイ

```bash
npm run deploy
```

Wrangler を使って Cloudflare にデプロイします。事前に `wrangler login` で認証を済ませてください。

## API エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/` | シングルページ UI を返却 |
| POST | `/api/analyze` | スペースの全ユーザー・プロジェクトを取得 |
| POST | `/api/project/detail` | 指定プロジェクトのメンバー・チーム・管理者を返却 |
| POST | `/api/team/members` | 指定プロジェクト内の特定チームのメンバーを返却 |

POST エンドポイントはすべて `spaceId`、`domain`、`apiKey` を含む JSON を受け付けます。

## ライセンス

本プロジェクトには現在ライセンスが設定されていません。
