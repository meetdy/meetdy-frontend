import { Input } from 'antd';
import TagCustom from '@/components/TagCustom';
import { ErrorMessage } from 'formik';

InputFieldNotTitle.defaultProps = {
  type: 'text',
  placeholder: '',
  maxLength: 100,
  disabled: false,
};

function InputFieldNotTitle(props) {
  const { field, type, placeholder, maxLength, disabled } = props;
  const { name } = field;

  return (
    <div>
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
