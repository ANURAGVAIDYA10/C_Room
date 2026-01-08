import { ReactNode } from "react";
import Button from "./Button";

interface PrimaryButtonWithLeftIconProps {
  children: ReactNode;
  size?: "sm" | "md";
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const PrimaryButtonWithLeftIcon: React.FC<PrimaryButtonWithLeftIconProps> = ({
  children,
  size = "md",
  icon,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <Button
      size={size}
      variant="primary"
      startIcon={icon}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};

export default PrimaryButtonWithLeftIcon;
