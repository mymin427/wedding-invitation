import { useEffect, useRef, useState } from "react"
import "./index.scss"

const BASE = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`
const AUDIO_SRC = encodeURI(`${BASE}bgm.mp3`)

export function Bgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC)
    ;(audio as any).playsInline = true
    audio.muted = true
    audio.loop = false
    audio.preload = "auto"
    audio.volume = 0.4

    audioRef.current = audio

    audio.play().catch(() => {})

    const onEnded = () => {
      setIsPlaying(false)
    }
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("ended", onEnded)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const onToggle = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!isPlaying) {
      try {
        audio.muted = false
        setIsMuted(false)
        await audio.play()
        setIsPlaying(true)
      } catch (e) {}
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const label = !isPlaying ? (isMuted ? "음악 켜기" : "재생") : "일시정지"

  return (
    <button className="bgm-toggle" onClick={onToggle} aria-label="배경음악 토글">
      {label}
    </button>
  )
}

