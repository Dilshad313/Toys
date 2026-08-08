'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import Link from 'next/link'

export default function WatchAndBuy() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPoster, setShowPoster] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Extract first frame as poster when video loads
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      videoRef.current.currentTime = 0.1
    }
  }, [])

  const handleCanPlay = useCallback(() => {
    if (videoRef.current && showPoster) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth || 720
      canvas.height = videoRef.current.videoHeight || 1280
      const ctx = canvas.getContext('2d')
      if (ctx && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const posterUrl = canvas.toDataURL('image/jpeg')
        if (videoRef.current) {
          videoRef.current.poster = posterUrl
        }
      }
      videoRef.current.currentTime = 0
    }
  }, [showPoster])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        setShowPoster(false)
        videoRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((err) => {
          console.error('Play error:', err)
        })
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted
      videoRef.current.muted = newMuted
      setIsMuted(newMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const dur = videoRef.current.duration || 1
      setCurrentTime(current)
      setProgress((current / dur) * 100)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const width = rect.width
      const percentage = x / width
      videoRef.current.currentTime = percentage * videoRef.current.duration
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-comic text-[#D32F2F]">
            🎬 Watch & Buy
          </h2>
          <p className="text-gray-600 mt-2 font-medium font-comic text-base md:text-lg">
            See the toys in action and shop your favorites!
          </p>
          <div className="w-20 h-1 bg-[#D32F2F] mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Video Section - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video group">
            {/* Poster Image Overlay (shown before play) */}
            {showPoster && (
              <div className="absolute inset-0 z-20">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onLoadedMetadata={handleLoadedMetadata}
                  onCanPlay={handleCanPlay}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => {
                    setIsPlaying(false)
                    setShowPoster(true)
                    if (videoRef.current) videoRef.current.currentTime = 0
                  }}
                  playsInline
                  preload="auto"
                  muted={isMuted}
                >
                  <source src="/videos/toys.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Dark overlay on poster */}
                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}

            {/* Actual playing video (hidden when poster shown) */}
            {!showPoster && (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => {
                  setIsPlaying(false)
                  setShowPoster(true)
                  if (videoRef.current) videoRef.current.currentTime = 0
                }}
                playsInline
                preload="auto"
                muted={isMuted}
              >
                <source src="/videos/toys.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

            {/* Center Play Button */}
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all duration-300 hover:scale-110 border border-white/30 z-30"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" />
              ) : (
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
              )}
            </button>

            {/* Play Badge */}
            <div className="absolute top-4 left-4 bg-[#D32F2F] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg z-30">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <Play className="w-3 h-3" />
              Watch Now
            </div>

            {/* Duration Badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium z-30">
              {formatTime(duration)}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-30">
              <div 
                className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-3 hover:h-2 transition-all"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-[#D32F2F] rounded-full transition-all relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#D32F2F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="text-white hover:text-[#D32F2F] transition p-1">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={toggleMute} className="text-white hover:text-[#D32F2F] transition p-1">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-white text-xs font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      if (document.fullscreenElement) {
                        document.exitFullscreen()
                      } else {
                        videoRef.current.requestFullscreen()
                      }
                    }
                  }}
                  className="text-white hover:text-[#D32F2F] transition p-1"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .font-comic {
          font-family: 'Baloo 2', 'Comic Neue', cursive;
        }
      `}</style>
    </section>
  )
}

// Helper function to format time
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}