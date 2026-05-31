// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { guru } = useAuth()
  if (!guru) return <Navigate to="/guru/login" replace />
  return <>{children}</>
}