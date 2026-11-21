import { useEffect } from 'react'
import { latLngToLocal, pointInBBox } from '../domain/geo'
import { gps, useHud } from '../state/runtime'

/** Feeds device GPS into the runtime while `active`. */
export function usePlayerLocation(active: boolean) {
  useEffect(() => {
    if (!active) {
      gps.target = null
      useHud.setState({ gpsStatus: 'off', gpsAccuracy: null, outsideBox: false })
      return
    }
    if (!('geolocation' in navigator) || !window.isSecureContext) {
      useHud.setState({ gpsStatus: 'denied' })
      return
    }
    useHud.setState({ gpsStatus: 'waiting' })
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        gps.target = latLngToLocal(latitude, longitude)
        useHud.setState({
          gpsStatus: 'ok',
          gpsAccuracy: accuracy,
          outsideBox: !pointInBBox(latitude, longitude),
        })
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) useHud.setState({ gpsStatus: 'denied' })
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
    )
    return () => {
      navigator.geolocation.clearWatch(id)
      gps.target = null
    }
  }, [active])
}
