"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    // Variantes de cor
    const variants = {
      primary:
        "bg-[#1F9CBE] hover:bg-[#16829E] text-white border-transparent focus:ring-[#1F9CBE]",
      secondary:
        "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 focus:ring-gray-400",
      danger:
        "bg-red-400 hover:bg-red-500 text-white border-transparent focus:ring-red-400",
      success:
        "bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-600",
      outline:
        "bg-white hover:bg-gray-100 text-[#1F9CBE] border-[#1F9CBE] hover:border-[#16829E] focus:ring-[#1F9CBE]",
    };

    // Tamanhos
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    // Classes base
    const baseClasses = `
      inline-flex items-center justify-center
      font-medium rounded-lg border
      focus:outline-none focus:ring-2 focus:ring-offset-2
      transition-all duration-300
      disabled:opacity-50 disabled:cursor-not-allowed
      transform hover:scale-[1.02] active:scale-[0.98]
      shadow-sm hover:shadow-md
    `
      .replace(/\s+/g, " ")
      .trim();

    // Combinar classes
    const buttonClasses = `
      ${baseClasses}
      ${variants[variant]}
      ${sizes[size]}
      ${fullWidth ? "w-full" : ""}
      ${loading ? "cursor-not-allowed" : ""}
      ${className}
    `
      .replace(/\s+/g, " ")
      .trim();

    const iconSize =
      size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClasses}
        {...props}
      >
        {loading && (
          <svg
            className={`animate-spin ${iconSize} ${
              children ? "mr-2" : ""
            } flex items-center justify-center`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && icon && iconPosition === "left" && (
          <span
            className={`${iconSize} ${
              children ? "mr-2" : ""
            } flex items-center justify-center`}
          >
            {icon}
          </span>
        )}

        {children}

        {!loading && icon && iconPosition === "right" && (
          <span
            className={`${iconSize} ${
              children ? "ml-2" : ""
            } flex items-center justify-center`}
          >
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
