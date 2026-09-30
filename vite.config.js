import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite does not read PORT on its own, and the sibling marketplaces all want
// 5173 too — whichever one is already up keeps it. Honouring PORT lets the
// launcher hand this one a free port instead of failing on a busy one.
export default defineConfig({
  plugins: [react()],
  server: { port: Number(process.env.PORT) || undefined },
})
