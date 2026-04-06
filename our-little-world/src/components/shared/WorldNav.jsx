import './WorldNav.css'

export default function WorldNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="world-nav">
      {tabs.map(({ key, label, icon }) => (
        <button
          key={key}
          className={`world-nav-tab ${activeTab === key ? 'active' : ''}`}
          onClick={() => onTabChange(key)}
        >
          <span className="world-nav-icon">{icon}</span>
          <span className="world-nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
