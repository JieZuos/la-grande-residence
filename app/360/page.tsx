// app/360/page.tsx
import scenesData from '@/components/360/data/scenes.json';
import { redirect } from 'next/navigation';

export default function Page() {
  const firstScene = scenesData.scenes[0];

  redirect(`/360/${firstScene.id}`);
}