import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  // You can add any custom props here if needed
  // example: variant?: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled = false,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`btn-primary ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
