import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../lib/propertiesApi'
import PropertyForm from '../components/PropertyForm'
import styles from './PropertiesPage.module.css'

export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  // モーダルの状態: null = 非表示 / 'create' = 新規 / property オブジェクト = 編集
  const [modalState, setModalState] = useState(null)

  // 削除確認中の物件ID
  const [deletingId, setDeletingId] = useState(null)

  // 物件一覧を取得
  const loadProperties = useCallback(async () => {
    setLoading(true)
    setFetchError('')
    const { data, error } = await fetchProperties()
    if (error) {
      setFetchError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  // 新規登録
  const handleCreate = async (values) => {
    const { error } = await createProperty(values)
    if (!error) {
      setModalState(null)
      await loadProperties()
    }
    return { error }
  }

  // 編集（更新）
  const handleUpdate = async (values) => {
    const { error } = await updateProperty(modalState.id, values)
    if (!error) {
      setModalState(null)
      await loadProperties()
    }
    return { error }
  }

  // 削除
  const handleDelete = async (id) => {
    setDeletingId(id)
    const { error } = await deleteProperty(id)
    if (error) {
      alert('削除に失敗しました: ' + error.message)
    } else {
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }
    setDeletingId(null)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>不動産検索アプリ</h1>
        <div className={styles.headerRight}>
          <span className={styles.email}>{user?.email}</span>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            ログアウト
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>物件一覧</h2>
            {!loading && (
              <p className={styles.count}>{properties.length}件の物件</p>
            )}
          </div>
          <button
            className={styles.addButton}
            onClick={() => setModalState('create')}
          >
            ＋ 物件を登録
          </button>
        </div>

        {fetchError && <p className={styles.errorBanner}>{fetchError}</p>}

        {loading ? (
          <p className={styles.loadingText}>読み込み中...</p>
        ) : properties.length === 0 ? (
          <div className={styles.empty}>
            <p>登録されている物件がありません。</p>
            <button
              className={styles.addButton}
              onClick={() => setModalState('create')}
            >
              最初の物件を登録する
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.card}>
                <div className={styles.cardImagePlaceholder}>
                  <span>🏠</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{property.name}</h3>
                  <p className={styles.cardArea}>📍 {property.area}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.rent}>
                      ¥{property.rent.toLocaleString()}
                      <small>/月</small>
                    </span>
                    <span className={styles.badge}>{property.room_type}</span>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => setModalState(property)}
                    >
                      編集
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(property.id)}
                      disabled={deletingId === property.id}
                    >
                      {deletingId === property.id ? '削除中...' : '削除'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録モーダル */}
      {modalState === 'create' && (
        <PropertyForm
          onSubmit={handleCreate}
          onClose={() => setModalState(null)}
        />
      )}

      {/* 編集モーダル（modalState が物件オブジェクトのとき） */}
      {modalState && modalState !== 'create' && (
        <PropertyForm
          property={modalState}
          onSubmit={handleUpdate}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}
