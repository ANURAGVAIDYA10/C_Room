import { ReactNode } from "react";
import Button from "./Button";

interface PrimaryButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  size = "md",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <Button
      size={size}
      variant="primary"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
