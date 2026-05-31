import { useAdminAuth } from '../hooks/useAdminAuth.jsx'
import { Navigate } from 'react-router-dom'

export default function ProtectedAdminRoute({ children }) {
  const { admin } = useAdminAuth()

  if (!admin) return <Navigate to="/login" replace />

  return children
}