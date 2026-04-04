import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import HerWorld from './pages/HerWorld'
import HisWorld from './pages/HisWorld'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/her" element={<HerWorld />} />
      <Route path="/his" element={<HisWorld />} />
    </Routes>
  )
}
