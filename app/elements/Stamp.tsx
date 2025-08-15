const Stamp = ({
  text = 'FEATURE',
  colorPrimary = '#1b2a49', // navy
  colorAccent = '#f7d6d0', // soft pink
  rotation = -12,
  size = 200, // just one number to scale everything
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 0.57} // keep the same aspect ratio as viewBox
      viewBox="0 0 280 160"
      role="img"
      aria-label={`${text} stamp`}
      className={className}
    >
      <defs>
        <filter id="roughen" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="5"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g
        transform={`translate(140,80) rotate(${rotation}) translate(-140,-80)`}
      >
        <rect
          x="25"
          y="40"
          width="230"
          height="80"
          rx="10"
          fill="none"
          strokeWidth="6"
          stroke={colorPrimary}
          filter="url(#roughen)"
        />

        <rect
          x="36"
          y="51"
          width="208"
          height="58"
          rx="8"
          fill="none"
          strokeWidth="3"
          stroke={colorAccent}
          strokeDasharray="10 8"
          filter="url(#roughen)"
        />

        <text
          x="140"
          y="92"
          fill={colorPrimary}
          fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
          fontSize="32"
          fontWeight="800"
          letterSpacing="6"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ filter: 'url(#roughen)' }}
        >
          {text.toUpperCase()}
        </text>
      </g>
    </svg>
  )
}

export default Stamp
