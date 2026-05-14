// app/360/[sceneId]/page.tsx
import scenesData from '@/components/360/data/scenes.json'
import Viewer from '@/components/360/Viewer'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return scenesData.scenes.map((scene) => ({
    sceneId: scene.id,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ sceneId: string }>
}) {
  const { sceneId } = await params

  const scene = scenesData.scenes.find(
    (s) => s.id === sceneId
  )

  if (!scene) return notFound()

  return (
    <Viewer
      scenes={scenesData.scenes}
      initialSceneId={scene.id}
    />
  )
}