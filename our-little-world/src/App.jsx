import { Routes, Route } from 'react-router-dom'
import { AgentProvider } from './agents/AgentContext'
import Landing from './pages/Landing'
import HerWorld from './pages/HerWorld'
import HisWorld from './pages/HisWorld'

export default function App() {
  return (
    <AgentProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/her" element={<HerWorld />} />
        <Route path="/his" element={<HisWorld />} />
      </Routes>
    </AgentProvider>
  )
}
