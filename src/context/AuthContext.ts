// Compat shim para testes que mockam '@/context/AuthContext'
// Em runtime real, reexporta o hook de auth unificado
export { useUnifiedAuth as useAuth } from '@/providers/SuperUnifiedProvider';
