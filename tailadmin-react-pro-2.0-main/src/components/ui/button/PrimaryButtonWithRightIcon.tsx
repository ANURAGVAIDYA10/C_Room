import { ReactNode } from "react";
import Button from "./Button";

interface PrimaryButtonWithRightIconProps {
  children: ReactNode;
  size?: "sm" | "md";
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const PrimaryButtonWithRightIcon: React.FC<PrimaryButtonWithRightIconProps> = ({
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
      endIcon={icon}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};

export default PrimaryButtonWithRightIcon;
