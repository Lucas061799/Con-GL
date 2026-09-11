import { DemoJump } from '../components/Sidebar'

// Landing page only — every other page carries the jump in its rail.
export default function DemoBar({ jumps, active }) {
  return (
    <div className="fixed bottom-4 left-3 z-[10001] no-print w-[232px]">
      <DemoJump jumps={jumps} active={active} />
    </div>
  )
}
