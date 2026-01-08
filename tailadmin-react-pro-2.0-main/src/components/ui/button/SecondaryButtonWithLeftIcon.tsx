import { ReactNode } from "react";
import Button from "./Button";

interface SecondaryButtonWithLeftIconProps {
  children: ReactNode;
  size?: "sm" | "md";
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const SecondaryButtonWithLeftIcon: React.FC<SecondaryButtonWithLeftIconProps> = ({
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
      variant="outline"
      startIcon={icon}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};

export default SecondaryButtonWithLeftIcon;
