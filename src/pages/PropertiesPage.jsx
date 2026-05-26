import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './PropertiesPage.module.css'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'サンシャインマンション 3F', rent: 85000, area: '東京都豊島区東池袋', type: '1LDK', sqm: 42 },
  { id: 2, name: 'グリーンパーク南青山', rent: 120000, area: '東京都港区南青山', type: '1K', sqm: 28 },
  { id: 3, name: 'ライオンズマンション新宿', rent: 98000, area: '東京都新宿区西新宿', type: '2DK', sqm: 55 },
  { id: 4, name: 'コスモシティ横浜', rent: 72000, area: '神奈川県横浜市西区', type: '1K', sqm: 25 },
  { id: 5, name: 'パークハイム渋谷', rent: 145000, area: '東京都渋谷区渋谷', type: '2LDK', sqm: 65 },
  { id: 6, name: 'エクセル大宮', rent: 65000, area: '埼玉県さいたま市大宮区', type: '1DK', sqm: 33 },
]

export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

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
        <h2 className={styles.sectionTitle}>物件一覧</h2>
        <p className={styles.count}>{DUMMY_PROPERTIES.length}件の物件が見つかりました</p>

        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className={styles.card}>
              <div className={styles.cardImagePlaceholder}>
                <span>🏠</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{property.name}</h3>
                <p className={styles.cardArea}>📍 {property.area}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.rent}>
                    ¥{property.rent.toLocaleString()}<small>/月</small>
                  </span>
                  <span className={styles.badge}>{property.type} / {property.sqm}㎡</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
