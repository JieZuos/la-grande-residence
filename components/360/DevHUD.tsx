// components/360/DevHUD.tsx
'use client'

import { useState } from 'react'

type Props = {
  camera: { yaw: number; pitch: number }
  clicked: { yaw: number; pitch: number }
}

export default function DevHUD({ camera, clicked }: Props) {
  const [enabled, setEnabled] = useState(false)

  const copy = (data: any) => {
    const text = `{ "yaw": ${data.yaw.toFixed(1)}, "pitch": ${data.pitch.toFixed(1)} }`
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      {/* Toggle */}
      <div
        onClick={() => setEnabled(!enabled)}
        className="fixed top-4 right-4 z-50 bg-black/70 px-4 py-2 rounded-full text-xs cursor-pointer"
      >
        DEV MODE: {enabled ? 'ON' : 'OFF'}
      </div>

      {/* Panel */}
      {enabled && (
        <div className="fixed top-16 right-4 z-50 w-72 bg-black/90 p-4 rounded-xl text-sm space-y-4 border border-yellow-500/30">
          
          {/* Camera */}
          <div>
            <p className="text-yellow-400 text-xs mb-1">Camera</p>
            <code className="block text-green-400 mb-2">
              {`{ "yaw": ${camera.yaw.toFixed(1)}, "pitch": ${camera.pitch.toFixed(1)} }`}
            </code>
            <button
              onClick={() => copy(camera)}
              className="w-full bg-gray-700 py-1 rounded"
            >
              Copy Camera
            </button>
          </div>

          {/* Clicked */}
          <div>
            <p className="text-blue-400 text-xs mb-1">Clicked</p>
            <code className="block text-blue-400 mb-2">
              {`{ "yaw": ${clicked.yaw.toFixed(1)}, "pitch": ${clicked.pitch.toFixed(1)} }`}
            </code>
            <button
              onClick={() => copy(clicked)}
              className="w-full bg-gray-700 py-1 rounded"
            >
              Copy Click
            </button>
          </div>
        </div>
      )}
    </>
  )
}