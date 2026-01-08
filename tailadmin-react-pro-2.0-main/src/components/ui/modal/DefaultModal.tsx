import { ReactNode } from "react";
import { Modal } from "./Modal";
import Button from "../button/Button";

interface DefaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  onSave?: () => void;
  saveButtonText?: string;
  closeButtonText?: string;
  className?: string;
}

const DefaultModal: React.FC<DefaultModalProps> = ({
  isOpen,
  onClose,
  title = "Modal Heading",
  children,
  onSave,
  saveButtonText = "Save Changes",
  closeButtonText = "Close",
  className = "max-w-[600px] p-5 lg:p-10",
}) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      {title && (
        <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
          {title}
        </h4>
      )}
      <div className="mb-7">{children}</div>
      <div className="flex items-center justify-end w-full gap-3">
        <Button size="sm" variant="outline" onClick={onClose}>
          {closeButtonText}
        </Button>
        <Button size="sm" onClick={handleSave}>
          {saveButtonText}
        </Button>
      </div>
    </Modal>
  );
};

export default DefaultModal;
