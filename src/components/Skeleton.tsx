interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string;
  height?: string;
  animation?: "pulse" | "wave";
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
  count = 1,
}) => {
  const baseStyles = "bg-mono-dark/10 dark:bg-mono-light/10";
  const animationStyles =
    animation === "pulse"
      ? "animate-pulse"
      : "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[wave_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-mono-dark/20 dark:before:via-mono-light/20 before:to-transparent";

  const variantStyles = {
    text: "h-4 rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  };

  const style = {
    width: width,
    height: height || (variant === "text" ? undefined : "100%"),
  };

  const items = Array(count).fill(0);

  return (
    <div className="space-y-2">
      {items.map((_, index) => (
        <div
          key={index}
          style={style}
          className={`${baseStyles} ${animationStyles} ${variantStyles[variant]} ${className}`}
        />
      ))}
    </div>
  );
};

export default Skeleton;
