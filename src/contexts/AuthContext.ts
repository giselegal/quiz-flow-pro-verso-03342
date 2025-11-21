// Compat shim para testes que mockam '@/context/AuthContext'
// Em runtime real, reexporta o hook de auth unificado V2
export { useAuth } from '@/contexts/auth/AuthProvider';
