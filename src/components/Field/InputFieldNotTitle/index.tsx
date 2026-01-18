import { ErrorMessage } from 'formik';
import { Input } from '@/components/ui/input';
import TagCustom from '@/components/TagCustom';

interface InputFieldNotTitleProps {
  field: any;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

function InputFieldNotTitle({
  field,
  type = 'text',
  placeholder = '',
  maxLength = 100,
  disabled = false,
}: InputFieldNotTitleProps) {
  const { name } = field;

  return (
    <div className="space-y-1">
      <Input
        {...field}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
      />
      <ErrorMessage name={name}>
        {(text) => <TagCustom title={text} color="error" />}
      </ErrorMessage>
    </div>
  );
}

export default InputFieldNotTitle;
