interface LightningVSProps {
  small?: boolean
}

export function LightningVS({ small = false }: LightningVSProps) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          position: 'absolute',
          width: small ? '40px' : '60px',
          height: small ? '56px' : '84px',
          background: 'var(--gold-soft)',
          clipPath: 'polygon(60% 0%, 30% 55%, 55% 55%, 15% 100%, 65% 45%, 40% 45%, 70% 0%)',
        }}
        aria-hidden="true"
      />
      <span
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: small ? '28px' : '44px',
          color: 'var(--gold)',
          textShadow: '0 0 20px var(--gold-glow)',
          position: 'relative',
          zIndex: 1,
          lineHeight: 1,
        }}
      >
        VS
      </span>
    </div>
  )
}
