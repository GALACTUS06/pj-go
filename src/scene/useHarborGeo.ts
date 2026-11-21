import { useCallback, useEffect, useState } from 'react'
import { ASSETS } from '../config/assets'
import { ringsFromGeoJSON, type Ring } from '../domain/water'

export type BuildingFeature = {
  properties: Record<string, string | number | undefined>
  geometry: { type: string; coordinates: number[][][] | number[][][][] }
}

export type HarborGeo = {
  buildings: { features: BuildingFeature[] }
  waterRings: Ring[]
}

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; geo: HarborGeo }

let cache: Promise<HarborGeo> | null = null

async function fetchJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return res.json()
}

function loadGeo() {
  cache ??= Promise.all([fetchJson(ASSETS.buildings), fetchJson(ASSETS.water)]).then(
    ([buildings, water]) => ({ buildings, waterRings: ringsFromGeoJSON(water) }),
  )
  cache.catch(() => {
    cache = null
  })
  return cache
}

export function useHarborGeo() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setState({ status: 'loading' })
    loadGeo()
      .then((geo) => alive && setState({ status: 'ready', geo }))
      .catch(() => alive && setState({ status: 'error' }))
    return () => {
      alive = false
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])
  return { state, retry }
}
