import { ReactNode } from "react";
import Button from "./Button";

interface SecondaryButtonWithRightIconProps {
  children: ReactNode;
  size?: "sm" | "md";
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const SecondaryButtonWithRightIcon: React.FC<SecondaryButtonWithRightIconProps> = ({
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
      endIcon={icon}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};

export default SecondaryButtonWithRightIcon;
