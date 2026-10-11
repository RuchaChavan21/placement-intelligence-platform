const AnimatedBackground = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
    <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-gold-500/20 blur-[120px] animate-drift" />
    <div className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full bg-violet-500/20 blur-[140px] animate-drift-slow" />
    <div className="absolute -bottom-48 left-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-600/15 blur-[120px] animate-drift" />
    {/* faint grid for depth */}
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
      }}
    />
  </div>
);

export default AnimatedBackground;
