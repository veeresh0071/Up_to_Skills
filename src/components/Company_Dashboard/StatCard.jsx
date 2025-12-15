// src/components/Company_Dashboard/StatCard.jsx
import { motion } from "framer-motion";
import { useRef, useState } from "react";

// Accent colors for card highlights
const accentClasses = {
  primary: "bg-blue-500",
  secondary: "bg-orange-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
};

export default function StatCard({
  title,       // Card title
  value,       // Main value (number or string)
  subtitle,    // Optional subtitle
  icon: Icon,  // Optional icon component
  color = "primary", // Accent color
  delay = 0,        // Animation delay
}) {
  const divRef = useRef(null);

  // Track mouse position for spotlight effect
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <motion.div
      ref={divRef}
      className="relative stat-card rounded-2xl bg-card p-6 border border-border shadow-md transition-all duration-300 ease-out"
      initial={{ opacity: 0, y: 20 }}     // Entrance animation
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ scale: 1.03 }}        // Slight scale on hover
      onMouseMove={handleMouseMove}       // Track mouse for spotlight
      onMouseEnter={() => setOpacity(0.6)}
      onMouseLeave={() => setOpacity(0)}
    >
      {/* Spotlight hover effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-in-out rounded-2xl"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.10), transparent 60%)`,
          transition: "background 0.12s ease-out",
        }}
      />

      <div className="flex items-center justify-between relative z-10 gap-4">
        <div className="min-w-0">
          {/* Title */}
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 truncate">
            {title}
          </p>

          {/* Value */}
          <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            {displayValue}
          </p>

          {/* Optional subtitle */}
          {/* {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {subtitle}
            </p>
          )} */}
        </div>

        {/* Optional Icon */}
        <div className="flex flex-col items-end gap-3">
          {Icon ? <Icon className="w-8 h-8 text-muted-foreground" /> : null}
        </div>
      </div>
    </motion.div>
  );
}
