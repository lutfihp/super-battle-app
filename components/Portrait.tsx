'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Character } from '@/lib/types'

interface PortraitProps {
  char: Character
  ratio?: string
  sizes?: string
}

function AnonymousBust() {
  return (
    <svg
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <circle cx="50" cy="42" r="24" fill="rgba(255,255,255,0.15)" />
      <path d="M8 130 Q8 82 50 82 Q92 82 92 130 Z" fill="rgba(255,255,255,0.15)" />
    </svg>
  )
}

export function Portrait({ char, ratio = '3/4', sizes = '200px' }: PortraitProps) {
  const [imgError, setImgError] = useState(false)
  const showImage = Boolean(char.image_url) && !imgError
  const bgColor = char.alignment === 'good' ? 'var(--blue-hero)' : 'var(--red-villain)'

  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: ratio,
        background: `radial-gradient(ellipse at 50% 30%, ${bgColor} 0%, #0a0c10 100%)`,
        overflow: 'hidden',
      }}
      role="img"
      aria-label={char.name}
    >
      {showImage ? (
        <Image
          src={char.image_url}
          alt={char.name}
          fill
          sizes={sizes}
          style={{ objectFit: 'cover' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 8px)',
            }}
          />
          <AnonymousBust />
        </>
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
