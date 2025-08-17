import useGravityForm, {
  ACTION_TYPES,
  FieldValue,
  EmailFieldValue,
} from '@/hooks/useGravityForm';
import { BsFillExclamationSquareFill } from 'react-icons/bs';

export const EMAIL_FIELD_FIELDS = `
  fragment EmailFieldFields on EmailField {
    label
    description
    cssClass
    isRequired
    placeholder
  }
`;

interface Props {
  field: any;
  fieldErrors: any[];
}

const DEFAULT_VALUE = '';

const EmailField = ({ field, fieldErrors }: Props) => {
  const {
    databaseId,
    type,
    label,
    description,
    cssClass,
    isRequired,
    placeholder,
  } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(
    (fieldValue: FieldValue) => fieldValue.id === databaseId
  ) as EmailFieldValue | undefined;
  const value = fieldValue?.emailValues?.value || DEFAULT_VALUE;
  const hasErrors = !!fieldErrors?.length;
  const isFilled = !!value?.length;

  return (
    <div
      className={`form__group form__group--${type.toLowerCase()} ${
        cssClass || ''
      } ${hasErrors ? 'has-errors' : ''}`.trim()}
    >
      {hasErrors &&
        fieldErrors.map((fieldError) => (
          <div key={fieldError.id} className='form__error-message'>
            <BsFillExclamationSquareFill size={16} />
            <p>{fieldError.message}</p>
          </div>
        ))}

      <input
        className={`form__input ${isFilled ? 'filled' : ''}`}
        type='email'
        name={String(databaseId)}
        id={htmlId}
        required={Boolean(isRequired)}
        placeholder={placeholder || ''}
        value={value}
        onChange={(event) => {
          dispatch({
            type: ACTION_TYPES.updateEmailFieldValue,
            fieldValue: {
              id: databaseId,
              emailValues: {
                value: event.target.value,
              },
            },
          });
        }}
      />

      <label className='form__label' htmlFor={htmlId}>
        {label}
      </label>

      {description ? (
        <p className='form__field-description'>{description}</p>
      ) : null}
    </div>
  );
};

export default EmailField;
