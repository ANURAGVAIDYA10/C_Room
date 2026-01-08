import { ReactNode } from "react";
import Button from "./Button";

interface SecondaryButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  size = "md",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <Button
      size={size}
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};

export default SecondaryButton;
