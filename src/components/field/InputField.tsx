import * as React from 'react';
import { ErrorMessage } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessageAlert from '@/components/message-alert';

interface InputFieldProps {
  field: any;
  title?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  isRequire?: boolean;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    field,
    title = '',
    type = 'text',
    placeholder = '',
    maxLength = 50,
    disabled = false,
    isRequire = false,
  } = props;

  const { name } = field;

  return (
    <div className="flex flex-col mb-4">
      {title && (
        <Label htmlFor={name} className="mb-1">
          {title} {isRequire && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Input
        id={name}
        {...field}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="w-full"
      />
      <ErrorMessage name={name}>
        {(msg) => <MessageAlert title={msg} color="error" />}
      </ErrorMessage>
    </div>
  );
};

export default InputField;
