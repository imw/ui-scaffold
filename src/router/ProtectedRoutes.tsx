import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAccount } from 'wagmi'

const ProtectedRoutes = () => {
  const { isConnected, address } = useAccount()
  const toast = useToast()

  const canAccess = true

  useEffect(() => {
    if (canAccess) return

    toast({
      title: 'No tens permisos per accedir aquí',
      status: 'error',
    })
  }, [canAccess])

  return canAccess ? <Outlet /> : <Navigate to='/' replace={true} />
}

export default ProtectedRoutes
