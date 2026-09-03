import sidebarBg from '../assets/sidebar-bg.png'
import norbieface from '../assets/norbieface.png'

// Left step rail — same shape as the Commercial Auto / GL-BOP apps: white
// panel, numbered steps, Norbie chat card pinned at the bottom over the
// palm-leaf watermark.
export default function Sidebar({ productName, submissionNumber, steps, activeStep, completed, onStepClick, progress }) {
  return (
    <aside
      className="w-64 2xl:w-72 hidden lg:flex flex-col h-full shrink-0 relative overflow-hidden"
      style={{ background: '#ffffff', borderRight: '1px solid #F3F4F6' }}
    >
      <div className="px-5 pt-5 pb-3 relative z-10">
        <h2 className="text-base font-bold leading-tight text-navy">{productName}</h2>
        <p className="text-[11px] mt-0.5 text-gray-400 whitespace-nowrap">Submission Number: {submissionNumber}</p>

        {progress != null && (
          <div className="flex items-center gap-2.5 mt-3">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(88.09deg, #5C2ED4 0%, #A614C3 100%)' }}
              />
            </div>
            <span className="text-[11px] font-bold text-gray-400 tabular-nums">{progress}%</span>
          </div>
        )}

        <div className="mt-3" style={{ borderBottom: '1px solid #F3F4F6' }} />
      </div>

      <nav className="flex-1 py-1 px-3 overflow-y-auto custom-scroll relative z-10">
        {steps.map(step => {
          const isActive = step.key === activeStep
          const isDone = !!completed[step.key] && !isActive
          return (
            <div key={step.key} className="relative mb-0.5">
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #5C2ED4 0%, #A614C3 100%)' }}
                />
              )}
              <button
                type="button"
                onClick={() => onStepClick?.(step.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                style={isActive
                  ? { background: '#ffffff', border: '1.5px solid #7C3AED', boxShadow: '0 2px 12px rgba(92,46,212,0.12)' }
                  : { border: '1.5px solid transparent', background: 'transparent' }}
              >
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={isActive || isDone
                    ? { background: 'linear-gradient(88.09deg, rgba(92,46,212,0.12) 0%, rgba(166,20,195,0.12) 100%)', color: '#5C2ED4' }
                    : { background: '#F3F4F6', color: '#9CA3AF' }}
                >
                  {isDone ? '✓' : step.number}
                </span>
                <span
                  className={`text-xs truncate ${isActive ? 'font-semibold' : isDone ? 'font-medium' : ''}`}
                  style={isActive
                    ? {
                        background: 'linear-gradient(88.09deg, #5C2ED4 0.11%, #A614C3 63.8%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }
                    : { color: isDone ? '#4B5563' : '#9CA3AF' }}
                >
                  {step.label}
                </span>
              </button>
            </div>
          )
        })}
      </nav>

      <div className="px-3 pb-4 relative z-10">
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.55)', border: '1.5px solid #E5E7EB' }}
        >
          <img src={norbieface} alt="Norbie" className="w-8 h-8 rounded-full shrink-0 object-cover" />
          <div>
            <p className="text-sm text-gray-700">Chat with Norbie</p>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-full pointer-events-none select-none">
        <img
          src={sidebarBg} alt=""
          className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom"
          style={{ opacity: 0.58, clipPath: 'inset(0 1px 0 0)' }}
        />
      </div>
    </aside>
  )
}
