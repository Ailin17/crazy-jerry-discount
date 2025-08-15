import React from 'react'

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  disabled?: boolean
  href: string
  variant?: 'primary' | 'secondary'
}

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  className,
  disabled,
  onClick,
  href,
  variant = 'primary', // default to primary
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    if (onClick) onClick(e)
  }

  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'

  return (
    <a
      href={disabled ? undefined : href} // prevent navigation if disabled
      className={`${baseClass} ${className ?? ''}`}
      onClick={handleClick}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </a>
  )
}

export default LinkButton
