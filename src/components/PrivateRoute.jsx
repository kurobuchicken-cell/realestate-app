import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 未ログインユーザーをログイン画面にリダイレクトするガードコンポーネント
// セッション確認中は何も描画せず、確認完了後に遷移先を決定する
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null

  return user ? children : <Navigate to="/login" replace />
}
