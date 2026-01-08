import { ReactNode } from "react";
import { Modal } from "./Modal";
import Button from "../button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";

interface FormField {
  label: string;
  type: string;
  placeholder: string;
  value?: string;
}

interface FormInModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  fields: FormField[];
  onSave?: () => void;
  saveButtonText?: string;
  closeButtonText?: string;
  className?: string;
}

const FormInModal: React.FC<FormInModalProps> = ({
  isOpen,
  onClose,
  title = "Personal Information",
  fields,
  onSave,
  saveButtonText = "Save Changes",
  closeButtonText = "Close",
  className = "max-w-[584px] p-5 lg:p-10",
}) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <form className="">
        {title && (
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            {title}
          </h4>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {fields.map((field, index) => (
            <div key={index} className={field.type === "textarea" ? "col-span-1 sm:col-span-2" : "col-span-1"}>
              <Label>{field.label}</Label>
              <Input
                type={field.type}
                placeholder={field.placeholder}
                defaultValue={field.value}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose}>
            {closeButtonText}
          </Button>
          <Button size="sm" onClick={handleSave}>
            {saveButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FormInModal;
