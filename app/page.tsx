'use client'

import dynamic from 'next/dynamic'
import BackgroundVideo from '@/components/BackgroundVideo'
import MusicPlayer from '@/components/MusicPlayer'
import WelcomeModal from '@/components/WelcomeModal'
import { useState } from 'react'

const VoiceChat = dynamic(() => import('@/components/VoiceChat'), { ssr: false })

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)

  const toggleMusicPlay = () => {
    setIsMusicPlaying(prev => !prev)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 relative overflow-hidden">
      <WelcomeModal onStart={() => setIsStarted(true)} />
      <BackgroundVideo isStarted={isStarted} />
      <MusicPlayer isStarted={isStarted} isPlaying={isMusicPlaying} togglePlay={toggleMusicPlay} />
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">Jack Sparrow AI</h1>
        <VoiceChat pauseMusicForChat={() => setIsMusicPlaying(false)} />
      </div>
    </main>
  )
}

