import React from 'react';
import { ChevronDownIcon } from '../../icons';

interface PrimaryDropdownButtonProps {
  onClick: () => void;
  isActive: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  icon: React.ReactNode;
  name: string;
  hasNewBadge?: boolean;
}

const PrimaryDropdownButton: React.FC<PrimaryDropdownButtonProps> = ({
  onClick,
  isActive,
  isExpanded,
  isHovered,
  isMobileOpen,
  icon,
  name,
  hasNewBadge = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`menu-item group ${
        isActive ? "menu-item-active" : "menu-item-inactive"
      } cursor-pointer ${
        !isExpanded && !isHovered ? "xl:justify-center" : "xl:justify-start"
      }`}
    >
      <span
        className={`menu-item-icon-size ${
          isActive ? "menu-item-icon-active" : "menu-item-icon-inactive"
        }`}
      >
        {icon}
      </span>

      {(isExpanded || isHovered || isMobileOpen) && (
        <span className="menu-item-text">{name}</span>
      )}
      {hasNewBadge && (isExpanded || isHovered || isMobileOpen) && (
        <span
          className={`ml-auto absolute right-10 ${
            isActive ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
          } menu-dropdown-badge`}
        >
          new
        </span>
      )}
      {(isExpanded || isHovered || isMobileOpen) && (
        <ChevronDownIcon
          className={`ml-auto w-5 h-5 transition-transform duration-200 ${
            isActive ? "rotate-180 text-brand-500" : ""
          }`}
        />
      )}
    </button>
  );
};

export default PrimaryDropdownButton;
