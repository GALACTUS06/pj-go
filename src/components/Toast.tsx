import { useEffect } from 'react'
import { create } from 'zustand'

type ToastState = { message: string | null; key: number }

const useToast = create<ToastState>()(() => ({ message: null, key: 0 }))

export function showToast(message: string) {
  useToast.setState((s) => ({ message, key: s.key + 1 }))
}

export function Toast() {
  const { message, key } = useToast()
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => useToast.setState({ message: null }), 2400)
    return () => clearTimeout(t)
  }, [message, key])
  if (!message) return null
  return (
    <div className="toast" role="status" key={key}>
      {message}
    </div>
  )
}
