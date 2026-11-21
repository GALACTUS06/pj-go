import { Component, type ReactNode } from 'react'

type Props = { fallback: ReactNode; children: ReactNode }

export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Scene failed, switching to fallback', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export function canWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
