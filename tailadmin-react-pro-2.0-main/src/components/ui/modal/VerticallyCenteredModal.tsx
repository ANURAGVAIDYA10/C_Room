import { ReactNode } from "react";
import { Modal } from "./Modal";
import Button from "../button/Button";

interface VerticallyCenteredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  children?: ReactNode;
  onSave?: () => void;
  saveButtonText?: string;
  closeButtonText?: string;
  showCloseButton?: boolean;
  className?: string;
}

const VerticallyCenteredModal: React.FC<VerticallyCenteredModalProps> = ({
  isOpen,
  onClose,
  title = "All Done! Success Confirmed",
  message,
  children,
  onSave,
  saveButtonText = "Save Changes",
  closeButtonText = "Close",
  showCloseButton = false,
  className = "max-w-[507px] p-6 lg:p-10",
}) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={showCloseButton}
      className={className}
    >
      <div className="text-center">
        {title && (
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            {title}
          </h4>
        )}
        {message && (
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            {message}
          </p>
        )}
        {children}

        <div className="flex items-center justify-center w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose}>
            {closeButtonText}
          </Button>
          <Button size="sm" onClick={handleSave}>
            {saveButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VerticallyCenteredModal;
