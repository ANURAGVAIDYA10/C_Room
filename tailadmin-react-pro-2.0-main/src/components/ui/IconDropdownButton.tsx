import React, { ReactNode, ButtonHTMLAttributes } from "react";

export interface IconDropdownButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  badgeCount?: number;
  ariaLabel: string;
  hasBadge?: boolean;
}

export const IconDropdownButton = React.forwardRef<
  HTMLButtonElement,
  IconDropdownButtonProps
>(
  (
    {
      children,
      onClick,
      className = "",
      badgeCount,
      ariaLabel,
      hasBadge = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`relative flex items-center justify-center h-11 w-11 rounded-full
          border border-gray-200 bg-white text-gray-500
          hover:bg-gray-100 hover:text-gray-700
          dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400
          dark:hover:bg-gray-800 dark:hover:text-white
          transition-colors ${className}`}
        {...props}
      >
        {children}

        {hasBadge && badgeCount && badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full
            bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            {badgeCount}
          </span>
        )}
      </button>
    );
  }
);

IconDropdownButton.displayName = "IconDropdownButton";
