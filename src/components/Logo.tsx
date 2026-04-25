import { Lightbulb, Settings, Rocket } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center group ${className}`}>
      {/* Icon Section */}
      <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">

        {/* Floating Background Elements */}
        {/* Lightbulb */}
        <div className="absolute -top-1 left-0 text-yellow-500  animate-bounce" style={{ animationDuration: '3s' }}>
          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400" />
        </div>
        {/* Gear */}
        <div className="absolute top-2 right-0 text-emerald-500 animate-spin-slow" style={{ animationDuration: '8s' }}>
          <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Floating Numbers */}
        <div className="absolute top-0 right-8 text-[#3b82f6] text-[10px] sm:text-xs font-bold font-mono animate-pulse">
          1010
        </div>
        <div className="absolute bottom-2 left-6 text-[#d946ef] text-[10px] sm:text-xs font-bold font-mono animate-pulse delay-75">
          100
        </div>

        {/* Sparkles */}
        <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-green-400 rounded-full"></div>
        <div className="absolute bottom-6 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        <div className="absolute top-8 right-6 w-1 h-1 bg-yellow-400 rounded-full"></div>

        {/* Brackets */}
        <div className="absolute left-2 sm:left-1 flex items-center justify-center text-4xl sm:text-6xl font-black text-[#0284c7] font-sans user-select-none transition-transform group-hover:-translate-x-1">
          &lt;
        </div>
        <div className="absolute right-2 sm:right-1 flex items-center justify-center text-4xl sm:text-6xl font-black text-[#16a34a] font-sans user-select-none transition-transform group-hover:translate-x-1">
          &gt;
        </div>

        {/* Central Rocket */}
        <div className="z-10 flex items-center justify-center relative translate-y-1 group-hover:-translate-y-2 transition-transform duration-500">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="rocketFlame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Rocket Thruster Flame (custom path for color) */}
            <path
              d="M12 22s-3-3-3-5 3-5 3-5 3 3 3 5-3 5-3 5z"
              fill="url(#rocketFlame)"
              stroke="none"
              className="animate-pulse"
            />
            {/* Main Rocket body */}
            <path
              d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a6 6 0 01-2-2l-.5-.5zM12 2A9.9 9.9 0 005.5 5.5C4 7 3.5 10.5 4 12.5l5.5 5.5c2 .5 5.5 0 7-1.5A9.9 9.9 0 0022 12c0-7-4-10-10-10zM19.5 19.5c1.5-1.26 2-5 2-5s-3.74.5-5 2l-.5.5c1.1.2 2 .9 2.1 2l.5.5z"
              fill="url(#rocketBody)"
              stroke="#1e3a8a"
              strokeWidth="1"
            />
            {/* Window */}
            <circle cx="12" cy="10" r="2.5" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex items-center -mt-2">
        <span className="text-xl sm:text-3xl font-bold tracking-tight text-[#1e3a8a] font-sans">
          ALGO-X
        </span>
        <span className="text-xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-[#f59e0b] font-sans">
          SYNAPSE
        </span>
      </div>
    </div>
  );
}

export function LogoSmall({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      {/* Small Icon Section */}
      <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
        <div className="absolute left-0 flex items-center justify-center text-lg sm:text-xl font-black text-[#0284c7] -translate-x-1">
          &lt;
        </div>
        <div className="absolute right-0 flex items-center justify-center text-lg sm:text-xl font-black text-[#16a34a] translate-x-1">
          &gt;
        </div>
        <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-[#ea580c] fill-[#f59e0b] group-hover:-translate-y-0.5 transition-transform" />
      </div>

      {/* Small Text */}
      <div className="flex items-center text-lg sm:text-xl leading-none">
        <span className="font-bold tracking-tight text-[#1e3a8a]">
          ALGO-X
        </span>
        <span className="font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-[#f59e0b]">
          SYNAPSE
        </span>
      </div>

    </div>
  );
}
