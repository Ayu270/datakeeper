import React from 'react';
import { ArrowUpRight, Menu } from 'lucide-react';
import ThreeScene from './ThreeScene';

const Logo = () => (
  <div className="flex items-center gap-2 font-semibold text-primary z-50 pointer-events-auto select-none">
    <div className="w-5 h-5 md:w-6 md:h-6 bg-primary rounded-[4px] flex items-center justify-center">
        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full"></div>
    </div>
    <span className="tracking-tight text-base md:text-lg">datakeeper</span>
  </div>
);

const DecorativeBackground = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60 mix-blend-multiply" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
     <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#111" strokeWidth="8" />
    <path 
      d="M 850 -50 A 500 500 0 0 1 1350 450" 
      fill="none" 
      stroke="#111" 
      strokeWidth="1.5" 
      strokeOpacity="0.4"
    />
     <circle cx="75%" cy="45%" r="280" fill="none" stroke="#111" strokeWidth="1" strokeOpacity="0.1" />
     <circle cx="45%" cy="85%" r="100" fill="none" stroke="#111" strokeWidth="1" strokeOpacity="0.15" />
  </svg>
);

const TryForFreeBrackets = () => (
    <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 160 60" preserveAspectRatio="none">
            <path d="M 40 10 C 20 10 20 50 40 50" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d="M 120 10 C 140 10 140 50 120 50" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
    </div>
)

// New "HUD" Style Spec Label for Deconstructed View with improved readability
const SpecLabel = ({ label, value, sub, align = 'left' }: { label: string, value: string, sub: string, align?: 'left' | 'right' }) => (
    <div className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'} group relative z-10`}>
        {/* Glassmorphism Backing */}
        <div className={`absolute -inset-4 bg-white/40 backdrop-blur-md rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/40 shadow-sm`}></div>
        
        {/* Always visible soft backing for better contrast */}
        <div className={`absolute -inset-4 bg-card/30 backdrop-blur-[2px] rounded-2xl -z-20 border border-white/20`}></div>

        <div className={`flex items-center gap-2 mb-2 ${align === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="h-[1px] w-8 bg-primary/30 group-hover:w-16 transition-all duration-500"></div>
            <span className="text-[10px] font-mono tracking-widest text-secondary uppercase">{label}</span>
        </div>
        <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif italic text-primary mb-1">{value}</h4>
        <p className="text-[10px] sm:text-xs font-medium text-primary/60 max-w-[150px]">{sub}</p>
    </div>
);

const Hero: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-card overflow-x-hidden font-sans text-primary selection:bg-black selection:text-white">
        
        {/* --- GLOBAL FIXED BACKGROUNDS --- */}
        {/* These span the full viewport width regardless of content constraints */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <DecorativeBackground />
        </div>
        
        <div className="fixed inset-0 z-0">
             <ThreeScene />
        </div>

        {/* --- MAIN CONTENT CONTAINER --- */}
        {/* This enforces the max-width and centering for the entire website's UI */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col">

            {/* --- SECTION 1: HERO --- */}
            <div id="hero-section" className="relative flex flex-col min-h-[100dvh] w-full pointer-events-none px-6 sm:px-12 md:px-16 lg:px-24 pb-10">
                <nav className="flex justify-between items-center py-6 md:py-10 pointer-events-auto">
                  <div className="flex items-center gap-6 md:gap-12">
                    <Menu className="w-8 h-8 md:w-10 md:h-10 text-primary stroke-[1.5] cursor-pointer hover:opacity-70 transition-opacity" />
                    <Logo />
                  </div>
                  <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-medium text-secondary/60 tracking-widest uppercase hidden sm:flex">
                    <span>landing page</span>
                    <span>saas system</span>
                  </div>
                </nav>

                <main className="flex-1 flex flex-col justify-center max-w-4xl pointer-events-auto mt-8 md:mt-0">
                  <div className="mb-6 md:mb-8 flex items-center gap-3 text-primary font-medium text-xs md:text-base">
                    <span className="font-bold">→</span>
                    <span>the best system for keeping data</span>
                  </div>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7.5rem] leading-[1.1] md:leading-[0.95] font-medium text-primary tracking-[-0.03em] mb-8 md:mb-12 break-words">
                    Keep your <br className="hidden md:block" />
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
                        <span className="relative font-serif italic font-semibold text-5xl sm:text-7xl md:text-8xl lg:text-[8rem]">"data"</span>
                        <span>organized<span className="text-accentBlue">.</span></span>
                    </div>
                  </h1>
                  <p className="text-secondary text-sm md:text-lg leading-relaxed mb-10 md:mb-16 max-w-[280px] sm:max-w-md font-normal">
                    convenient and secure access to all your data in one place on cloud storage
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 w-full sm:w-auto">
                    <button className="group relative flex items-center justify-between bg-black text-white rounded-full pl-6 md:pl-8 pr-2 py-2 h-14 md:h-16 w-full sm:w-auto min-w-[200px] hover:bg-neutral-800 transition-all duration-300 cursor-pointer shadow-xl active:scale-95">
                      <span className="text-sm md:text-base font-medium">get started</span>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-black" />
                      </div>
                    </button>
                    <button className="group relative flex items-center justify-center px-8 md:px-10 h-14 md:h-16 text-primary hover:text-black transition-colors cursor-pointer w-full sm:w-auto">
                       <TryForFreeBrackets />
                       <span className="text-sm font-medium z-10 relative group-hover:scale-105 transition-transform">try for free</span>
                    </button>
                  </div>
                </main>
                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-20 text-secondary/50 text-xs md:text-sm font-medium tracking-wide hidden md:block">
                    data keeper
                </div>
            </div>

            {/* --- SECTION 2: DETAILS --- */}
            <div id="details-section" className="relative w-full min-h-[100dvh] flex flex-col items-center justify-start pt-20 md:pt-32 pointer-events-none px-6 sm:px-12 md:px-16">
                <div className="flex flex-col items-center text-center space-y-8 pointer-events-auto backdrop-blur-sm bg-card/60 md:bg-transparent p-6 sm:p-8 rounded-3xl max-w-4xl mx-auto z-20 shadow-sm md:shadow-none border border-white/50 md:border-none">
                    <div className="inline-flex items-center gap-2 text-accentBlue font-medium uppercase tracking-widest text-xs">
                        <div className="w-2 h-2 rounded-full bg-accentBlue"></div>
                        <span>Granular Control</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif italic text-primary leading-tight">
                        Break it down. <br/> 
                        <span className="not-italic font-sans font-semibold text-2xl sm:text-3xl md:text-5xl">Analyze every bit.</span>
                    </h2>
                    <p className="text-secondary text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto">
                        Watch as your complex datasets align perfectly. Our system solves the chaos, organizing every fragment into a coherent whole.
                    </p>
                </div>
                {/* Spacer for 3D animation visibility */}
                <div className="flex-1 w-full min-h-[50vh]"></div>
            </div>

            {/* --- SECTION 3: DECONSTRUCTED VIEW (HUD Style) --- */}
            <div id="breakdown-section" className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center pointer-events-none overflow-hidden py-10 px-6 sm:px-12 md:px-16">
                 <div className="absolute top-10 md:top-24 left-0 w-full text-center z-10 pointer-events-auto px-6">
                    <div className="inline-block relative">
                         <div className="absolute inset-0 bg-white/40 blur-xl rounded-full"></div>
                         <h3 className="relative text-2xl md:text-5xl font-serif italic text-primary mb-2 md:mb-4">System Architecture</h3>
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full border border-primary/10 bg-white/40 backdrop-blur-md">
                        <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-primary/70">Schematic v2.0</span>
                    </div>
                 </div>

                 <div className="max-w-[1400px] w-full h-full relative flex flex-col md:flex-row items-center justify-between z-10 mt-20 md:mt-0 mx-auto">
                    
                    {/* Mobile: Top Grid Layout */}
                    <div className="md:hidden grid grid-cols-2 gap-x-8 gap-y-8 w-full mb-8 pointer-events-auto">
                         <SpecLabel label="Latency" value="12ms" sub="Global edge response." align="left" />
                         <SpecLabel label="Encryption" value="AES-256" sub="Military grade." align="right" />
                    </div>

                    {/* Desktop: Left Column */}
                    <div className="hidden md:flex flex-col gap-24 pointer-events-auto">
                        <SpecLabel label="Latency" value="12ms" sub="Global edge network response time." align="left" />
                        <SpecLabel label="Encryption" value="AES-256" sub="Military grade security standard." align="left" />
                    </div>

                    {/* Center area reserved for 3D Explosion */}
                    {/* Fixed height on mobile to ensure spacing, auto on desktop */}
                    <div className="w-full h-[40vh] md:h-auto md:flex-1"></div>

                     {/* Mobile: Bottom Grid Layout */}
                    <div className="md:hidden grid grid-cols-2 gap-x-8 gap-y-8 w-full mt-8 pointer-events-auto">
                         <SpecLabel label="Uptime" value="99.9%" sub="Guaranteed SLA." align="left" />
                         <SpecLabel label="Scalability" value="∞ Nodes" sub="Elastic scaling." align="right" />
                    </div>

                    {/* Desktop: Right Column */}
                    <div className="hidden md:flex flex-col gap-24 text-right pointer-events-auto">
                        <SpecLabel label="Uptime" value="99.99%" sub="Guaranteed availability SLA." align="right" />
                        <SpecLabel label="Scalability" value="∞ Nodes" sub="Elastic infrastructure scaling." align="right" />
                    </div>
                 </div>
            </div>

            {/* --- SECTION 4: FOOTER (MAGNETIC PORTAL) --- */}
            <div id="footer-section" className="relative w-full min-h-[90dvh] flex flex-col items-center justify-center py-20 pointer-events-none overflow-hidden px-6 sm:px-12 md:px-16">
                
                <div className="relative z-20 flex flex-col items-center justify-center w-full pointer-events-none text-center">
                    <span className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-secondary mb-8 pointer-events-auto">Final Output</span>
                    
                    <div className="flex flex-col items-center mb-24 md:mb-32 pointer-events-auto relative z-10">
                        <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif italic text-primary leading-none tracking-tight">
                            Order from
                        </h2>
                        <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-sans font-bold text-primary leading-none tracking-tight -mt-2 md:-mt-4 relative block">
                            Chaos.
                        </span>
                    </div>

                    <div className="relative group cursor-pointer w-full max-w-xs sm:max-w-sm mx-auto pointer-events-auto z-20">
                       {/* High Tech Button Interface */}
                       <div className="relative overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl border border-white/50 shadow-2xl transition-all duration-300 group-hover:bg-white/30 group-hover:scale-105 group-hover:shadow-glow">
                            <div className="absolute top-0 left-0 w-1 h-full bg-accentBlue/50 group-hover:bg-accentBlue transition-colors"></div>
                            <button className="w-full px-6 sm:px-8 py-4 sm:py-6 flex items-center justify-between text-primary">
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-primary/60 mb-1">Initialize System</span>
                                    <span className="text-xl sm:text-2xl font-semibold tracking-tight">Get Started</span>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 shadow-lg">
                                    <ArrowUpRight size={20} strokeWidth={1.5} />
                                </div>
                            </button>
                            
                            {/* Animated Tech Lines */}
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary/50 transition-all"></div>
                            <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent"></div>
                       </div>
                       
                       {/* Sub-label */}
                       <div className="absolute -bottom-8 left-0 w-full flex justify-between text-[10px] font-mono text-secondary/60 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            <span>v2.0.4 Ready</span>
                            <span>Secure Connection</span>
                       </div>
                    </div>
                </div>

                <div className="absolute bottom-10 w-full px-6 md:px-10 flex justify-between items-end pointer-events-auto mix-blend-difference text-secondary">
                     <div className="hidden md:block">
                         <Logo />
                     </div>
                     <p className="text-[10px] md:text-xs font-mono w-full md:w-auto text-center md:text-left">
                        DESIGNED FOR<br/>PRECISION
                     </p>
                </div>
            </div>
        
        </div>
    </div>
  );
};

export default Hero;