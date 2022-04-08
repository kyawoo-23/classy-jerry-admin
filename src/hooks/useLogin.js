import { useState, useEffect } from 'react'
import { auth } from '../firebase/admin-config'
import { useAuthContext } from './useAuthContext'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)
    try {
      // sign user up
      const res = await signInWithEmailAndPassword(auth, email, password)
      if (!res) {
        throw new Error('Could not complete Login')
      }

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      // update state
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return {error, isPending, login}
}
