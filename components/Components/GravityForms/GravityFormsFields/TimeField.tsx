import useGravityForm, {
  ACTION_TYPES,
  FieldValue,
  StringFieldValue,
} from '@/hooks/useGravityForm';
import { BsFillExclamationSquareFill } from 'react-icons/bs';

export const TIME_FIELD_FIELDS = `
  fragment TimeFieldFields on TimeField {
    label
    description
    cssClass
    isRequired
  }
`;

interface Props {
  field: any;
  fieldErrors: any[];
}

const DEFAULT_VALUE = '';

export default function TimeField({ field, fieldErrors }: Props) {
  const { databaseId, type, label, description, cssClass, isRequired } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(
    (fieldValue: FieldValue) => fieldValue.id === databaseId
  ) as StringFieldValue | undefined;
  const value = fieldValue?.value || DEFAULT_VALUE;
  const hasErrors = !!fieldErrors?.length;
  const isFilled = !!value;

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
        aria-label={label || ''}
        className={`form__input ${isFilled ? 'filled' : ''}`}
        type='time'
        name={String(databaseId)}
        id={htmlId}
        required={Boolean(isRequired)}
        value={value}
        onChange={(event) => {
          dispatch({
            type: ACTION_TYPES.updateTimeFieldValue,
            fieldValue: {
              id: databaseId,
              value: event.target.value,
            },
          });
        }}
      />

      {description && <p className='form__field-description'>{description}</p>}
    </div>
  );
}
