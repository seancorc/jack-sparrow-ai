'use client'

import { useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MusicPlayer({ isStarted, isPlaying, togglePlay }: { isStarted: boolean, isPlaying: boolean, togglePlay: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (isStarted) {
      audioRef.current = new Audio('/pirate-music.mp3')
      audioRef.current.loop = true
      audioRef.current.play()
      togglePlay()
    }
  }, [isStarted])

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/pirate-music.mp3')
      audioRef.current.loop = true
    }
    isPlaying ? audioRef.current.play() : audioRef.current.pause()
  }, [isPlaying])

  return (
    <div className="fixed bottom-4 right-4 z-20">
      <Button onClick={togglePlay} variant="outline" size="icon">
        {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>
    </div>
  )
}

