// components/360/Viewer.tsx
'use client';

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import DevHUD from './DevHUD'
import { Viewer } from '@photo-sphere-viewer/core'
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin'
import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'

type Props = {
  scenes: any[]
  initialSceneId: string
}

// Resolve panorama paths for static export with trailingSlash
const resolvePanoramaPath = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return path.startsWith('/') ? path : `/${path}`
}

export default function ViewerComponent({ scenes, initialSceneId }: Props) {
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const viewerInstance = useRef<any>(null)
  const markersPlugin = useRef<any>(null)
  const isTransitioning = useRef(false)

  const router = useRouter()
  const pathname = usePathname()

  const [camera, setCamera] = useState({ yaw: 0, pitch: 0 })
  const [clicked, setClicked] = useState({ yaw: 0, pitch: 0 })
  const [currentScene, setCurrentScene] = useState<string | null>(null)
  const [sceneInfo, setSceneInfo] = useState<{ title: string; description: string } | null>(null)

  // --- Marker UI ---
  const getMarkerConfig = (hotspot: any) => ({
    id: hotspot.id,
    position: hotspot.position,
    html: `
      <div style="
        background: #19682e;
        color: white;
        padding: 8px 16px;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        box-shadow: 0 0 0 0 rgba(25, 104, 46, 0.7);
        animation: pulse-glow 2s infinite, bounce 2s infinite;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.1)'" 
      onmouseout="this.style.transform='scale(1)'">
        ${hotspot.label}
      </div>
      <style>
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(25, 104, 46, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(25, 104, 46, 0); }
          100% { box-shadow: 0 0 0 0 rgba(25, 104, 46, 0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      </style>
    `,
    anchor: 'center bottom',
    data: { targetScene: hotspot.targetScene }
  })

  // --- Load Scene ---
  const loadScene = async (sceneId: string, updateUrl: boolean = false) => {
    if (isTransitioning.current) return
    isTransitioning.current = true

    const scene = scenes.find((s) => s.id === sceneId)
    if (!scene) {
      console.error('Scene not found:', sceneId)
      isTransitioning.current = false
      return
    }

    setCurrentScene(sceneId)
    setSceneInfo({ title: scene.title, description: scene.description })

    const panoramaUrl = resolvePanoramaPath(scene.panorama)

    try {
      // FIRST INIT
      if (!viewerInstance.current) {
        viewerInstance.current = new Viewer({
          container: viewerRef.current!,
          panorama: panoramaUrl,
          defaultYaw: scene.cameraPosition?.yaw ?? 0,
          defaultPitch: scene.cameraPosition?.pitch ?? 0,
          defaultZoomLvl: 0,
          fisheye: false,
          minFov: 30,
          maxFov: 90,
          navbar: false,
          plugins: [
            [
              MarkersPlugin,
              {
                markers: scene.hotspots?.map(getMarkerConfig) ?? [],
              },
            ],
          ],
        })

        markersPlugin.current = viewerInstance.current.getPlugin(MarkersPlugin)

        // --- Marker Click ---
        markersPlugin.current.addEventListener('select-marker', ({ marker }: any) => {
          const target = marker.data?.targetScene
          
          console.log('Marker clicked:', marker.id, 'target:', target)
          
          if (!target) {
            console.warn('No targetScene found for marker:', marker.id)
            return
          }

          // FIX: Use replace with shallow navigation to avoid page reload in static export
          // This updates the URL without triggering a full navigation/page reload
          const newPath = `/360/${target}/`
          
          // Update URL without page reload using history API directly
          // (more reliable than router.replace in static export mode)
          if (typeof window !== 'undefined') {
            window.history.replaceState(
              { ...window.history.state, sceneId: target },
              '',
              newPath
            )
          }
          
          // Load new scene
          loadScene(target, false)
        })

        // --- Camera Tracking ---
        viewerInstance.current.addEventListener('position-updated', () => {
          if (!viewerInstance.current) return
          try {
            const pos = viewerInstance.current.getPosition()
            if (pos) setCamera({ yaw: pos.yaw, pitch: pos.pitch })
          } catch (e) {}
        })

        // --- Click Tracking ---
        viewerInstance.current.addEventListener('click', ({ data }: any) => {
          if (!data || !viewerInstance.current) return

          setClicked({ yaw: data.yaw, pitch: data.pitch })

          const tempId = 'temp-' + Date.now()
          
          try {
            markersPlugin.current?.addMarker({
              id: tempId,
              position: { yaw: data.yaw, pitch: data.pitch },
              html: `<div style="width:10px;height:10px;background:red;border-radius:50%;border:2px solid white;"></div>`,
            })

            setTimeout(() => {
              try {
                if (markersPlugin.current?.getMarker?.(tempId)) {
                  markersPlugin.current.removeMarker(tempId)
                }
              } catch (e) {}
            }, 800)
          } catch (e) {}
        })
      }
      // SWITCH SCENE
      else {
        if (currentScene === sceneId) {
          isTransitioning.current = false
          return
        }

        markersPlugin.current?.clearMarkers()

        await viewerInstance.current.setPanorama(panoramaUrl, {
          position: scene.cameraPosition ?? { yaw: 0, pitch: 0 },
          zoom: 0,
          transition: 1000,
        })

        scene.hotspots?.forEach((h: any) => {
          markersPlugin.current?.addMarker(getMarkerConfig(h))
        })
      }
    } catch (e) {
      console.error('Scene load error:', e)
    }

    isTransitioning.current = false
  }

  // --- Sync with URL ---
  useEffect(() => {
    if (!initialSceneId) return
    
    // Only load if it's a different scene or first load
    if (initialSceneId !== currentScene) {
      // If viewer exists, just switch scene without re-init
      if (viewerInstance.current && currentScene !== null) {
        loadScene(initialSceneId, false)
      } else {
        loadScene(initialSceneId, false)
      }
    }
  }, [initialSceneId])

  // --- Cleanup ---
  useEffect(() => {
    return () => {
      if (viewerInstance.current) {
        try {
          viewerInstance.current.destroy()
        } catch (e) {}
        viewerInstance.current = null
      }
    }
  }, [])

  return (
    <>
      <div ref={viewerRef} className="w-screen h-screen" />
      
      {sceneInfo && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md text-white px-4 py-3 rounded-2xl border border-white/10 shadow-2xl max-w-[90vw] md:max-w-md text-center">
            <h1 className="text-lg md:text-xl font-bold mb-1 leading-tight">
              {sceneInfo.title}
            </h1>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed line-clamp-2">
              {sceneInfo.description}
            </p>
          </div>
        </div>
      )}

      {/* <DevHUD camera={camera} clicked={clicked} /> */}
    </>
  )
}