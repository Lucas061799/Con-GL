import { useRef, useState, useEffect, useLayoutEffect, useMemo } from 'react'

export const BRAND_GRADIENT = 'linear-gradient(88.09deg, #5C2ED4 0.11%, #A614C3 63.8%)'

/* ── Shared bits ──────────────────────────────────────────────────── */

function Label({ label, required, hint }) {
  if (!label) return null
  return (
    <label className="block text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      {hint && (
        <span className="inline-flex align-middle ml-1.5 -mt-px">
          <InfoTip title={hint.title}>{hint.body}</InfoTip>
        </span>
      )}
    </label>
  )
}

// Hover-to-open help popover, styled after the Builder's Risk app: a gradient
// "i" dot and a 340px card with a tinted title bar.
//
// The card is positioned `fixed` against the dot's rect rather than absolutely
// inside it — an absolute panel gets clipped the moment a section or the
// scrolling column boundary crosses it. It flips above the dot when there is
// no room below and is clamped to the viewport on both axes.
const TIP_W = 340
const TIP_GAP = 8
const TIP_MARGIN = 12

export function InfoTip({ title, children, size = 'sm', label }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const wrapRef = useRef(null)
  const dotRef = useRef(null)
  const cardRef = useRef(null)

  // Tapping elsewhere dismisses it on touch, where there is no pointer to
  // move away.
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const d = dotRef.current?.getBoundingClientRect()
      const card = cardRef.current?.getBoundingClientRect()
      if (!d || !card) return
      const left = Math.min(
        Math.max(TIP_MARGIN, d.left + d.width / 2 - TIP_W / 2),
        window.innerWidth - TIP_W - TIP_MARGIN,
      )
      const roomBelow = window.innerHeight - d.bottom - TIP_GAP - TIP_MARGIN
      const below = card.height <= roomBelow
      setPos({
        left,
        top: below ? d.bottom : Math.max(TIP_MARGIN, d.top - TIP_GAP - card.height),
        below,
      })
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  const show = () => { setPos(null); setOpen(true) }
  const hide = () => { setOpen(false); setPos(null) }

  return (
    <span
      className="relative inline-flex items-center"
      ref={wrapRef}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        ref={dotRef}
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(v => !v) }}
        onFocus={show}
        onBlur={hide}
        className={`${size === 'xs' ? 'w-3.5 h-3.5 text-[8px]' : 'w-4 h-4 text-[10px]'} rounded-full flex items-center justify-center font-bold text-white shrink-0 transition-all hover:scale-110`}
        style={{
          background: 'linear-gradient(88.09deg, #5C2ED4 0%, #A614C3 100%)',
          boxShadow: open ? '0 2px 8px rgba(92,46,212,0.4)' : '0 1px 3px rgba(92,46,212,0.25)',
        }}
        aria-label={`More info: ${typeof title === 'string' ? title : 'details'}`}
      >
        i
      </button>

      {label && <span className="text-[11px] text-gray-500 ml-1 select-none">{label}</span>}

      {open && (
        // The gap between dot and card is padding on this wrapper, so the
        // pointer never leaves the tip while travelling into it.
        <div
          className="fixed z-[9999]"
          style={{
            width: TIP_W,
            left: pos ? pos.left : -9999,
            top: pos ? pos.top : 0,
            paddingTop: pos?.below === false ? 0 : TIP_GAP,
            paddingBottom: pos?.below === false ? TIP_GAP : 0,
            visibility: pos ? 'visible' : 'hidden',
          }}
        >
          <div
            ref={cardRef}
            role="tooltip"
            className="rounded-xl bg-white"
            style={{ border: '1px solid rgba(92,46,212,0.18)', boxShadow: '0 8px 28px rgba(15,10,40,0.16)' }}
          >
            <div
              className="px-4 py-3 rounded-t-xl"
              style={{ background: 'linear-gradient(88deg, rgba(92,46,212,0.06), rgba(166,20,195,0.06))' }}
            >
              <h4 className="text-[13px] font-bold" style={{ color: '#1F1B47' }}>{title}</h4>
            </div>
            <div className="px-4 py-3 text-[12px] text-gray-600 leading-relaxed max-h-80 overflow-y-auto custom-scroll">
              {children}
            </div>
          </div>
        </div>
      )}
    </span>
  )
}

function FieldError({ error }) {
  if (!error) return null
  return (
    <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
      <span>⚠</span> {typeof error === 'string' ? error : 'This field is required'}
    </p>
  )
}

const inputClass = (error) =>
  `w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition-all ${
    error
      ? 'border-red-300 bg-red-50/50 focus:ring-red-100 focus:border-red-400'
      : 'border-gray-200 bg-white focus:ring-[#7C3AED]/10 focus:border-[#7C3AED]/40 hover:border-gray-300'
  }`

// Anchors a dropdown panel to its trigger with position:fixed, so the panel
// is never clipped by an overflow:hidden ancestor (cards, the form column).
function useAnchoredDropdown(open, triggerRef) {
  const [style, setStyle] = useState({})
  useEffect(() => {
    if (!open || !triggerRef.current) return
    const recalc = () => {
      if (!triggerRef.current) return
      const r = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - r.bottom
      const flip = spaceBelow < 260 && r.top > spaceBelow
      setStyle({
        position: 'fixed',
        left: r.left,
        width: r.width,
        zIndex: 9999,
        ...(flip ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
      })
    }
    recalc()
    window.addEventListener('scroll', recalc, true)
    window.addEventListener('resize', recalc)
    return () => {
      window.removeEventListener('scroll', recalc, true)
      window.removeEventListener('resize', recalc)
    }
  }, [open, triggerRef])
  return style
}

function useClickAway(ref, onAway, active = true) {
  useEffect(() => {
    if (!active) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onAway() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onAway, active])
}

function Caret({ open }) {
  return (
    <svg
      className="w-4 h-4 shrink-0 transition-transform"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: open ? '#7C3AED' : '#9CA3AF' }}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function CheckMark({ id }) {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" stroke={`url(#${id})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5C2ED4" /><stop offset="100%" stopColor="#A614C3" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const triggerCls = 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm text-left transition-all'

const triggerStyle = (open, error, hasValue) => ({
  background: 'white',
  borderColor: error ? '#FCA5A5' : open ? '#7C3AED' : '#E5E7EB',
  boxShadow: error ? '0 0 0 2px rgba(252,165,165,0.3)' : open ? '0 0 0 2px rgba(124,58,237,0.1)' : 'none',
  color: hasValue ? '#1F2937' : '#9CA3AF',
})

const panelStyle = { background: 'white', border: '1px solid #E5E7EB', boxShadow: '0 12px 32px rgba(27,7,80,0.14)' }

const optionStyle = (selected) => ({
  background: selected ? 'linear-gradient(88.09deg, rgba(92,46,212,0.07) 0%, rgba(166,20,195,0.07) 100%)' : 'transparent',
  color: selected ? '#A614C3' : '#374151',
  fontWeight: selected ? 600 : 400,
})

const hoverOn = (selected) => (e) => { if (!selected) e.currentTarget.style.background = '#F9FAFB' }
const hoverOff = (selected) => (e) => { if (!selected) e.currentTarget.style.background = 'transparent' }

/* ── Text input ───────────────────────────────────────────────────── */

export function Input({ label, required, hint, placeholder, type = 'text', value, onChange, maxLength, className = '', error = false }) {
  return (
    <div className={className}>
      <Label label={label} required={required} hint={hint} />
      <input
        type={type}
        value={value || ''}
        maxLength={maxLength}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass(error)}
      />
      <FieldError error={error} />
    </div>
  )
}

/* ── Currency input ───────────────────────────────────────────────── */

const digitsOnly = (s) => String(s ?? '').replace(/\D/g, '')
export const groupThousands = (s) => digitsOnly(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export function CurrencyInput({ label, required, hint, placeholder = '0', value, onChange, className = '', error = false }) {
  return (
    <div className={className}>
      <Label label={label} required={required} hint={hint} />
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={value ? groupThousands(value) : ''}
          onChange={(e) => onChange && onChange(digitsOnly(e.target.value))}
          placeholder={placeholder}
          className={`${inputClass(error)} pl-7`}
        />
      </div>
      <FieldError error={error} />
    </div>
  )
}

/* ── Plain select ─────────────────────────────────────────────────── */

export function Select({ label, required, hint, options = [], value, onChange, placeholder = 'Select...', className = '', error = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const triggerRef = useRef(null)
  const dropdownStyle = useAnchoredDropdown(open, triggerRef)
  useClickAway(ref, () => setOpen(false))

  const optVal = (o) => o.value ?? o
  const optLabel = (o) => o.label ?? o
  const selected = options.find(o => optVal(o) === value)

  return (
    <div className={`${className} relative`} ref={ref}>
      <Label label={label} required={required} hint={hint} />
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={triggerCls}
        style={triggerStyle(open, error, !!selected)}
      >
        <span className="truncate pr-2">{selected ? optLabel(selected) : placeholder}</span>
        <Caret open={open} />
      </button>

      {open && (
        <div className="rounded-xl overflow-hidden" style={{ ...dropdownStyle, ...panelStyle }}>
          <div className="overflow-y-auto custom-scroll" style={{ maxHeight: '240px' }}>
            {options.map(o => {
              const v = optVal(o)
              const isSel = v === value
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => { onChange && onChange(v); setOpen(false) }}
                  className="w-full text-left px-3.5 py-2.5 text-sm transition-all flex items-center justify-between gap-2"
                  style={optionStyle(isSel)}
                  onMouseEnter={hoverOn(isSel)}
                  onMouseLeave={hoverOff(isSel)}
                >
                  <span>{optLabel(o)}</span>
                  {isSel && <CheckMark id="selCheckG" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
      <FieldError error={error} />
    </div>
  )
}

/* ── Searchable select — for the long class-code list ─────────────── */

export function SearchableSelect({ label, required, hint, options = [], value, onChange, placeholder = 'Select...', searchPlaceholder = 'Search…', className = '', error = false }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)
  const triggerRef = useRef(null)
  const searchRef = useRef(null)
  const dropdownStyle = useAnchoredDropdown(open, triggerRef)
  useClickAway(ref, () => { setOpen(false); setQuery('') })

  useEffect(() => { if (open) searchRef.current?.focus() }, [open])

  const selected = options.find(o => o.value === value)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter(o => (o.search || o.label).toLowerCase().includes(q))
  }, [options, query])

  return (
    <div className={`${className} relative`} ref={ref}>
      <Label label={label} required={required} hint={hint} />
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={triggerCls}
        style={triggerStyle(open, error, !!selected)}
      >
        <span className="truncate pr-2">{selected ? selected.label : placeholder}</span>
        <Caret open={open} />
      </button>

      {open && (
        <div className="rounded-xl overflow-hidden" style={{ ...dropdownStyle, ...panelStyle }}>
          <div className="p-2 border-b" style={{ borderColor: '#F3F4F6' }}>
            <div className="relative">
              <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-2 text-[13px] text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED]/40"
              />
            </div>
          </div>
          <div className="overflow-y-auto custom-scroll" style={{ maxHeight: '240px' }}>
            {filtered.length === 0 && (
              <p className="px-3.5 py-4 text-[13px] text-gray-400 text-center">No class code matches “{query}”.</p>
            )}
            {filtered.map(o => {
              const isSel = o.value === value
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange && onChange(o.value); setOpen(false); setQuery('') }}
                  className="w-full text-left px-3.5 py-2.5 text-sm transition-all flex items-center justify-between gap-2"
                  style={optionStyle(isSel)}
                  onMouseEnter={hoverOn(isSel)}
                  onMouseLeave={hoverOff(isSel)}
                >
                  <span className="leading-snug">{o.label}</span>
                  {isSel && <CheckMark id="searchCheckG" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
      <FieldError error={error} />
    </div>
  )
}

/* ── Tree select — for Prior Insurance History ────────────────────── */

// Groups expand/collapse with a +/− affordance; only leaves are selectable.
export function TreeSelect({ label, required, hint, tree = [], leafLabels = {}, value, onChange, placeholder = 'Select...', className = '', error = false }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(() => new Set())
  const ref = useRef(null)
  const triggerRef = useRef(null)
  const dropdownStyle = useAnchoredDropdown(open, triggerRef)
  useClickAway(ref, () => setOpen(false))

  // Opening on an already-answered field reveals the branch holding the answer.
  useEffect(() => {
    if (!open || !value) return
    const path = []
    const find = (nodes, trail) => nodes.some(n => {
      if (n.children) {
        if (find(n.children, [...trail, n.id])) return true
        return false
      }
      if (n.id === value) { path.push(...trail); return true }
      return false
    })
    find(tree, [])
    if (path.length) setExpanded(prev => new Set([...prev, ...path]))
  }, [open, value, tree])

  const toggle = (id) => setExpanded(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const renderNodes = (nodes, depth) => nodes.map(node => {
    if (node.children) {
      const isOpen = expanded.has(node.id)
      return (
        <div key={node.id}>
          <button
            type="button"
            onClick={() => toggle(node.id)}
            className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-bold text-gray-800 transition-all"
            style={{ paddingLeft: 14 + depth * 14 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <span className="text-left leading-snug">{node.label}</span>
            <span className="shrink-0 text-base leading-none font-normal" style={{ color: '#A614C3' }}>
              {isOpen ? '−' : '+'}
            </span>
          </button>
          {isOpen && renderNodes(node.children, depth + 1)}
        </div>
      )
    }
    const isSel = node.id === value
    return (
      <button
        key={node.id}
        type="button"
        onClick={() => { onChange && onChange(node.id); setOpen(false) }}
        className="w-full text-left px-3.5 py-2.5 text-sm transition-all flex items-center justify-between gap-2"
        style={{ ...optionStyle(isSel), paddingLeft: 14 + depth * 14 }}
        onMouseEnter={hoverOn(isSel)}
        onMouseLeave={hoverOff(isSel)}
      >
        <span className="leading-snug">{node.label}</span>
        {isSel && <CheckMark id="treeCheckG" />}
      </button>
    )
  })

  const selectedLabel = value ? leafLabels[value] : null

  return (
    <div className={`${className} relative`} ref={ref}>
      <Label label={label} required={required} hint={hint} />
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={triggerCls}
        style={triggerStyle(open, error, !!selectedLabel)}
      >
        <span className="truncate pr-2">{selectedLabel || placeholder}</span>
        <Caret open={open} />
      </button>

      {open && (
        <div className="rounded-xl overflow-hidden" style={{ ...dropdownStyle, ...panelStyle }}>
          <div className="overflow-y-auto custom-scroll py-1" style={{ maxHeight: '300px' }}>
            {renderNodes(tree, 0)}
          </div>
        </div>
      )}
      <FieldError error={error} />
    </div>
  )
}

/* ── Phone input ──────────────────────────────────────────────────── */

export function formatPhone(raw) {
  const d = String(raw ?? '').replace(/\D/g, '').slice(0, 10)
  if (!d) return ''
  if (d.length <= 3) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export function PhoneInput({ label, required, hint, placeholder = '(555) 000-0000', value, onChange, className = '', error = false }) {
  return (
    <div className={className}>
      <Label label={label} required={required} hint={hint} />
      <input
        type="text"
        inputMode="numeric"
        value={value || ''}
        onChange={(e) => onChange && onChange(formatPhone(e.target.value))}
        placeholder={placeholder}
        className={inputClass(error)}
      />
      <FieldError error={error} />
    </div>
  )
}

/* ── Percent input ────────────────────────────────────────────────── */

export function PercentInput({ label, required, value, onChange, className = '', error = false, disabled = false }) {
  const clamp = (raw) => {
    const d = raw.replace(/\D/g, '').slice(0, 3)
    if (d === '') return ''
    return String(Math.min(100, Number(d)))
  }
  return (
    <div className={className}>
      <Label label={label} required={required} />
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={value ?? ''}
          onChange={(e) => onChange && onChange(clamp(e.target.value))}
          placeholder="0"
          className={`${inputClass(error)} pr-8 ${disabled ? 'bg-gray-50 text-gray-400' : ''}`}
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">%</span>
      </div>
      <FieldError error={error} />
    </div>
  )
}

/* ── Date input with calendar ─────────────────────────────────────── */

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const WEEK_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

const parseDate = (v) => {
  if (!v || v.length < 8) return null
  const [m, d, y] = v.split('/')
  if (!m || !d || !y || y.length !== 4) return null
  const dt = new Date(+y, +m - 1, +d)
  return isNaN(dt.getTime()) ? null : dt
}

export const todayMDY = () => {
  const t = new Date()
  return `${t.getMonth() + 1}/${t.getDate()}/${t.getFullYear()}`
}

function Calendar({ value, onPick }) {
  const today = new Date()
  const parsed = parseDate(value)
  const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : today.getMonth())

  const step = (delta) => {
    const m = viewMonth + delta
    if (m < 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else if (m > 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const isSelected = (d) => parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === d
  const isToday = (d) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d

  const arrow = (dir) => (
    <button type="button" onClick={() => step(dir)} className="w-7 h-7 flex items-center justify-center rounded-lg transition hover:bg-gray-100">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={dir < 0 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )

  return (
    <div className="p-3 select-none" style={{ width: 264 }}>
      <div className="flex items-center justify-between mb-2">
        {arrow(-1)}
        <span className="text-[13px] font-bold text-gradient">{MONTHS_SHORT[viewMonth]} {viewYear}</span>
        {arrow(1)}
      </div>
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map(d => <span key={d} className="text-center text-[10px] font-bold text-gray-400 pb-1">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((d, i) => {
          const sel = d && isSelected(d)
          const tod = d && isToday(d)
          return (
            <button
              key={i}
              type="button"
              disabled={!d}
              onClick={() => onPick(`${String(viewMonth + 1).padStart(2, '0')}/${String(d).padStart(2, '0')}/${viewYear}`)}
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all ${
                !d ? 'invisible' : sel ? 'text-white font-bold' : tod ? 'font-bold' : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={
                sel ? { background: BRAND_GRADIENT, boxShadow: '0 2px 8px rgba(92,46,212,0.35)' }
                : tod ? { color: '#7C3AED', border: '1.5px solid #7C3AED' }
                : {}
              }
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function DateInput({ label, required, hint, value, onChange, className = '', error = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const triggerRef = useRef(null)
  const dropdownStyle = useAnchoredDropdown(open, triggerRef)
  useClickAway(ref, () => setOpen(false))

  const typeDate = (raw) => {
    const d = raw.replace(/\D/g, '').slice(0, 8)
    if (d.length <= 2) return d
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
  }

  return (
    <div className={`${className} relative`} ref={ref}>
      <Label label={label} required={required} hint={hint} />
      <div className="relative" ref={triggerRef}>
        <input
          type="text"
          inputMode="numeric"
          value={value || ''}
          onChange={(e) => onChange && onChange(typeDate(e.target.value))}
          placeholder="MM/DD/YYYY"
          className={`${inputClass(error)} pr-10`}
        />
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-label="Open calendar"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md transition hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke={open ? '#7C3AED' : '#9CA3AF'} strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="rounded-xl overflow-hidden" style={{ ...dropdownStyle, ...panelStyle, width: 264 }}>
          <Calendar value={value} onPick={(v) => { onChange && onChange(v); setOpen(false) }} />
        </div>
      )}
      <FieldError error={error} />
    </div>
  )
}

/* ── Checkbox ─────────────────────────────────────────────────────── */

export function Checkbox({ label, checked, onChange, className = '' }) {
  return (
    <label
      onClick={() => onChange && onChange(!checked)}
      className={`flex items-center gap-2.5 cursor-pointer select-none ${className}`}
    >
      <span
        className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0 transition-all"
        style={{
          background: checked ? BRAND_GRADIENT : 'white',
          border: checked ? 'none' : '1.5px solid #D1D5DB',
        }}
      >
        {checked && (
          <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth="3.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="text-[13px] text-gray-600 font-medium">{label}</span>
    </label>
  )
}

/* ── Textarea ─────────────────────────────────────────────────────── */

export function Textarea({ label, required, hint, placeholder, rows = 4, value, onChange, className = '', error = false }) {
  return (
    <div className={className}>
      <Label label={label} required={required} hint={hint} />
      <textarea
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass(error)} resize-y`}
      />
      <FieldError error={error} />
    </div>
  )
}

/* ── Yes / No radio pills ─────────────────────────────────────────── */

// The house control for a binary question, as used across Builder's Risk:
// two bordered pills with a radio dot, purple ring and tinted fill when set.
export function YesNo({ value, onChange, className = '' }) {
  const pill = (v, labelText) => {
    const on = value === v
    return (
      <button
        key={v}
        type="button"
        onClick={() => onChange && onChange(v)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
          on
            ? 'border-[#5C2ED4] text-[#5C2ED4]'
            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
        }`}
        style={on ? { background: 'linear-gradient(88.09deg, rgba(92,46,212,0.08) 0%, rgba(166,20,195,0.08) 100%)' } : undefined}
      >
        <span
          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            on ? 'border-[#A614C3]' : 'border-gray-300'
          }`}
        >
          {on && <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_GRADIENT }} />}
        </span>
        {labelText}
      </button>
    )
  }

  return <div className={`flex gap-4 ${className}`}>{pill('yes', 'Yes')}{pill('no', 'No')}</div>
}

// A question with its answer pills underneath, and whatever the "yes" branch
// reveals below that.
export function ToggleQuestion({ label, hint, value, onChange, children }) {
  return (
    <div>
      <p className="block text-[13px] font-semibold text-gray-600 mb-2.5 tracking-wide">
        {label}
        {hint && (
          <span className="inline-flex align-middle ml-1.5 -mt-px">
            <InfoTip title={hint.title}>{hint.body}</InfoTip>
          </span>
        )}
      </p>
      <YesNo value={value} onChange={onChange} />
      {value === 'yes' && children && <div className="mt-4 pl-0.5">{children}</div>}
    </div>
  )
}

/* ── Layout helper ────────────────────────────────────────────────── */

export function FormGrid({ children, cols = 2, className = '' }) {
  return (
    <div className={`grid gap-4 ${cols === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'} ${className}`}>
      {children}
    </div>
  )
}
