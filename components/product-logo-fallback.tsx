"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProductLogoProps {
  src: string | null
  alt: string
  fallback: string
  className?: string
}

export function ProductLogo({ src, alt, fallback, className }: ProductLogoProps) {
  const [hasError, setHasError] = useState(false)
  
  // We need to append the public token if it's a logo.dev URL and doesn't have one
  // But the database should store the full URL with token in production
  // For now, we use the URL as is from the database
  const imageUrl = src

  if (!imageUrl || hasError) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-lg", className)}>
        {fallback.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
        unoptimized // Since we are using external CDNs, sometimes unoptimized is safer if domains aren't perfect
      />
    </div>
  )
}
