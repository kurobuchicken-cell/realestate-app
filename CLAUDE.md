# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**realestate-app** — ログイン機能付き不動産検索アプリ。ユーザーが会員登録・ログインし、物件を検索・閲覧できる Web アプリケーション。

- バックエンド / 認証 / DB: **Supabase** (PostgreSQL + Auth + Storage)
- フロントエンド: 未定（決定次第このファイルを更新すること）

## Supabase 構成

### 環境変数

`.env.local` に以下を設定する（コミットしないこと）:

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # サーバーサイドのみ
```

### 認証方針

- Supabase Auth を使用（メール＋パスワード、必要に応じて OAuth）
- RLS (Row Level Security) をすべてのテーブルで有効化し、認証済みユーザーのみ自分のデータにアクセス可能とする
- `service_role_key` はサーバーサイド処理のみで使用し、クライアントには絶対に露出させない

### DB スキーマ方針

- マイグレーションは `supabase/migrations/` で管理する
- Supabase CLI でローカル開発環境を立ち上げる

```bash
supabase start          # ローカル Supabase 起動
supabase db reset       # ローカル DB をマイグレーションから再構築
supabase migration new <name>   # 新しいマイグレーション作成
supabase db push        # リモートへマイグレーション適用
supabase gen types typescript --local > src/types/database.types.ts  # 型生成
```

## 主要ドメイン

### 物件 (Property)

検索・一覧・詳細閲覧が中心。想定フィールド:
- `id`, `title`, `description`, `price`, `address`, `prefecture`, `city`
- `property_type` (賃貸/売買), `room_type` (1K/1LDK 等)
- `area_sqm`, `floor`, `building_floors`, `built_year`
- `images` (Supabase Storage), `created_at`, `updated_at`

### ユーザー (User)

- Supabase Auth の `auth.users` と紐づいた `profiles` テーブルを作成する
- お気に入り保存などのユーザー固有データは `profiles` または専用テーブルで管理

## アーキテクチャ上の注意点

- **RLS 必須**: 物件データは一般公開可能だが、お気に入り・問い合わせ等はユーザースコープに限定する
- **型安全**: `supabase gen types` で生成した型を使い、生の SQL 文字列に依存しない
- **画像**: Supabase Storage の `properties` バケットを使用し、パブリック URL を DB に保存する
