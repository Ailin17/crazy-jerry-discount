import React from 'react'

type Props = {
  text?: string
  colorText?: string
  colorArrow?: string
  size?: number
}

const NewArrow = ({
  text = 'NEW',
  colorText = '#1b2a49', // navy
  colorArrow = '#1b2a49',
  size = 100, // width of SVG
}: Props) => {
  const height = size * 1.2
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={height}
      viewBox="0 0 100 120"
      role="img"
      aria-label={`${text} badge`}
    >
      <text
        x="50"
        y="40"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill={colorText}
        fontFamily="sans-serif"
      >
        {text}
      </text>

      <path
        d="M30 50 Q50 80 70 50"
        fill="none"
        stroke={colorArrow}
        strokeWidth="4"
        markerEnd="url(#arrowhead)"
      />

      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={colorArrow} />
        </marker>
      </defs>
    </svg>
  )
}

export default NewArrow
