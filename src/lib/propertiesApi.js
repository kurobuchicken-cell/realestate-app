import { supabase } from './supabaseClient'

// 自分が登録した物件を新着順で取得（RLSにより他ユーザーのデータは返らない）
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

// 物件を新規登録する（user_idはサーバー側でauth.uid()と照合される）
export async function createProperty({ name, rent, area, room_type }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('properties')
    .insert({ name, rent: Number(rent), area, room_type, user_id: user.id })
    .select()
    .single()
  return { data, error }
}

// 指定した物件を更新する（RLSにより自分の物件のみ更新可能）
export async function updateProperty(id, { name, rent, area, room_type }) {
  const { data, error } = await supabase
    .from('properties')
    .update({ name, rent: Number(rent), area, room_type })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// 指定した物件を削除する（RLSにより自分の物件のみ削除可能）
export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
  return { error }
}
