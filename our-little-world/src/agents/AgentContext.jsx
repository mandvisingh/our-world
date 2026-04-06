import { createContext, useContext } from 'react'
import { useAgentLoop } from '../hooks/useAgentLoop'

const AgentCtx = createContext(null)

export function AgentProvider({ children }) {
  const agentState = useAgentLoop()
  return <AgentCtx.Provider value={agentState}>{children}</AgentCtx.Provider>
}

export function useAgents() {
  return useContext(AgentCtx)
}
