-- =====================================================
-- 不動産管理アプリ: propertiesテーブル + RLSポリシー
-- Supabase ダッシュボード > SQL Editor に貼り付けて実行する
-- =====================================================

-- 物件テーブル
create table if not exists properties (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  name       text        not null,              -- 物件名
  rent       integer     not null check (rent >= 0), -- 家賃（円）
  area       text        not null,              -- エリア名
  room_type  text        not null,              -- 間取り（例: 1LDK）
  created_at timestamptz not null default now()
);

-- RLS（行レベルセキュリティ）を有効化
alter table properties enable row level security;

-- 自分が登録した物件のみ参照可能
create policy "自分の物件のみ参照可能"
  on properties for select
  using (auth.uid() = user_id);

-- 自分のuser_idでのみ登録可能（なりすまし防止）
create policy "自分のuser_idで登録可能"
  on properties for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新可能
create policy "自分の物件のみ更新可能"
  on properties for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除可能
create policy "自分の物件のみ削除可能"
  on properties for delete
  using (auth.uid() = user_id);
