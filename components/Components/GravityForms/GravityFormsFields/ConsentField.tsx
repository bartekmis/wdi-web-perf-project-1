import useGravityForm, {
  ACTION_TYPES,
  FieldValue,
  StringFieldValue,
} from '@/hooks/useGravityForm';
import { BsFillExclamationSquareFill } from 'react-icons/bs';

export const CONSENT_FIELD_FIELDS = `
  fragment ConsentFieldFields on ConsentField {
    label
    description
    cssClass
    isRequired
    checkboxLabel
  }
`;

interface Props {
  field: any;
  fieldErrors: any[];
}

const DEFAULT_VALUE = '';

export default function ConsentField({ field, fieldErrors }: Props) {
  const {
    databaseId,
    type,
    label,
    description,
    cssClass,
    isRequired,
    checkboxLabel,
  } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(
    (fieldValue: FieldValue) => fieldValue.id === databaseId
  ) as StringFieldValue | undefined;
  const value = fieldValue?.value || DEFAULT_VALUE;
  const hasErrors = !!fieldErrors?.length;

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
        className='checkbox'
        type='checkbox'
        name={String(databaseId)}
        id={htmlId}
        value={value}
        required={Boolean(isRequired)}
        onChange={(event) => {
          dispatch({
            type: ACTION_TYPES.updateConsentFieldValue,
            fieldValue: {
              id: databaseId,
              value: event.target.checked ? 'on' : '',
            },
          });
        }}
      />
      <label className='checkbox__label' htmlFor={htmlId}>{checkboxLabel}</label>

      {description && <p className='form__field-description'>{description}</p>}
    </div>
  );
}
