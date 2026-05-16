import React from 'react'
import logoUrl from '../assets/logo.png'

interface BrandLogoProps {
  className?: string
  imgClassName?: string
  alt?: string
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  imgClassName = '',
  alt = 'CineNova',
}) => {
  return (
    <span className={className}>
      <img src={logoUrl} alt={alt} className={imgClassName} />
    </span>
  )
}

export default BrandLogo
