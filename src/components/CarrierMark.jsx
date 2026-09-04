// A carrier's identity in one element: the logo sits inside a white bordered
// frame, the way GL-BOP presents carriers. The supplied logos are full
// lockups (RLI's includes "CONTRAC PAC"), so callers must not print the
// carrier or product name alongside it.
//
// Square frames, same as GL-BOP. Both lockups are wide (RLI ≈ 1.8:1,
// Brivado ≈ 2.5:1), so padding is kept tight and the image is constrained on
// both axes — it fills the frame's width and centres vertically.
const SIZES = {
  sm: { box: 40, pad: 5, name: 'text-[9px]' },
  md: { box: 52, pad: 6, name: 'text-[10px]' },
  lg: { box: 64, pad: 8, name: 'text-[12px]' },
  xl: { box: 92, pad: 12, name: 'text-[14px]' },
}

export default function CarrierMark({ carrier, product, logo, size = 'md', className = '' }) {
  const s = SIZES[size] || SIZES.md
  return (
    <div
      className={`rounded-xl flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: s.box,
        height: s.box,
        padding: s.pad,
        background: 'white',
        border: '1px solid #E5E7EB',
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt={product ? `${carrier} ${product}` : carrier}
          className="select-none pointer-events-none"
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      ) : (
        <span className={`${s.name} font-extrabold text-navy text-center leading-tight`}>
          {carrier}
        </span>
      )}
    </div>
  )
}
