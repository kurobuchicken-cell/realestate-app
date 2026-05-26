import { useState, useEffect } from 'react'
import styles from './PropertyForm.module.css'

// 新規登録・編集を共用するフォームモーダル
// property が渡された場合は編集モード、undefined の場合は新規登録モード
export default function PropertyForm({ property, onSubmit, onClose }) {
  const isEdit = !!property

  const [values, setValues] = useState({
    name: '',
    rent: '',
    area: '',
    room_type: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 編集モードのとき既存の値をフォームにセット
  useEffect(() => {
    if (property) {
      setValues({
        name: property.name,
        rent: property.rent,
        area: property.area,
        room_type: property.room_type,
      })
    }
  }, [property])

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!values.name.trim() || !values.rent || !values.area.trim() || !values.room_type.trim()) {
      setError('すべての項目を入力してください')
      return
    }

    setLoading(true)
    const { error } = await onSubmit(values)
    if (error) {
      setError('保存に失敗しました: ' + error.message)
      setLoading(false)
    }
    // 成功時は親コンポーネントがモーダルを閉じる
  }

  // モーダル背景クリックで閉じる
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? '物件を編集' : '物件を登録'}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
            ✕
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            物件名
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="例: サンシャインマンション 301"
              required
            />
          </label>
          <label className={styles.label}>
            家賃（円）
            <input
              type="number"
              name="rent"
              value={values.rent}
              onChange={handleChange}
              className={styles.input}
              placeholder="例: 80000"
              min="0"
              required
            />
          </label>
          <label className={styles.label}>
            エリア名
            <input
              type="text"
              name="area"
              value={values.area}
              onChange={handleChange}
              className={styles.input}
              placeholder="例: 東京都渋谷区"
              required
            />
          </label>
          <label className={styles.label}>
            間取り
            <input
              type="text"
              name="room_type"
              value={values.room_type}
              onChange={handleChange}
              className={styles.input}
              placeholder="例: 1LDK"
              required
            />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
