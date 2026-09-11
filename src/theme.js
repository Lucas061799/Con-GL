import { useEffect, useState } from 'react'

const KEY = 'cbic-dark'

const initial = () => {
  try { return localStorage.getItem(KEY) === 'true' } catch { return false }
}

// Dark mode the way the other marketplaces do it: one flag at the top of the
// app, mirrored onto <html data-dark> so the stylesheet can follow. Remembered
// per browser.
export function useDarkMode() {
  const [dark, setDark] = useState(initial)

  useEffect(() => {
    document.documentElement.setAttribute('data-dark', dark ? 'true' : 'false')
    try { localStorage.setItem(KEY, String(dark)) } catch { /* private mode */ }
  }, [dark])

  return [dark, setDark]
}
