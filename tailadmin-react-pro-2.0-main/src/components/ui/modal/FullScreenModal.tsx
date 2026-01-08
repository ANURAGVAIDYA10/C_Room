import { ReactNode } from "react";
import { Modal } from "./Modal";
import Button from "../button/Button";

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  onSave?: () => void;
  saveButtonText?: string;
  closeButtonText?: string;
  showCloseButton?: boolean;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({
  isOpen,
  onClose,
  title = "Modal Heading",
  children,
  onSave,
  saveButtonText = "Save Changes",
  closeButtonText = "Close",
  showCloseButton = true,
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
      isFullscreen={true}
      showCloseButton={showCloseButton}
    >
      <div className="fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden bg-white dark:bg-gray-900 lg:p-10">
        <div className="overflow-y-auto">
          {title && (
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
              {title}
            </h4>
          )}
          {children || (
            <>
              <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque euismod est quis mauris lacinia pharetra. Sed a
                ligula ac odio condimentum aliquet a nec nulla. Aliquam bibendum
                ex sit amet ipsum rutrum feugiat ultrices enim quam.
              </p>
              <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque euismod est quis mauris lacinia pharetra. Sed a
                ligula ac odio condimentum aliquet a nec nulla. Aliquam bibendum
                ex sit amet ipsum rutrum feugiat ultrices enim quam odio
                condimentum aliquet a nec nulla pellentesque euismod est quis
                mauris lacinia pharetra.
              </p>
              <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque euismod est quis mauris lacinia pharetra.
              </p>
            </>
          )}
        </div>
        <div className="flex items-center justify-end w-full gap-3 pb-10">
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

export default FullScreenModal;
