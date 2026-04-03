import { useNavigate } from 'react-router-dom'
import './BackButton.css'

export default function BackButton({ to = '/', label = '← home' }) {
  const navigate = useNavigate()
  return (
    <button className="back-btn" onClick={() => navigate(to)}>
      {label}
    </button>
  )
}
