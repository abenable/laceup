interface PulseEffectProps {
  className?: string;
}

const PulseEffect = ({ className = "" }: PulseEffectProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-mono-dark/20 dark:bg-mono-light/20 animate-ping"></div>
      <div className="absolute inset-0 rounded-full bg-mono-dark/40 dark:bg-mono-light/40 animate-pulse"></div>
      <div className="relative rounded-full bg-mono-dark dark:bg-mono-light"></div>
    </div>
  );
};

export default PulseEffect;
