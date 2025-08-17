import useGravityForm, {
  ACTION_TYPES,
  FieldValue,
  StringFieldValue,
} from '@/hooks/useGravityForm';
import { BsFillExclamationSquareFill } from 'react-icons/bs';

export const SELECT_FIELD_FIELDS = `
  fragment SelectFieldFields on SelectField {
    label
    description
    cssClass
    isRequired
    defaultValue
    choices {
      text
      value
    }
  }
`;

interface Props {
  field: any;
  fieldErrors: any[];
}

export default function SelectField({ field, fieldErrors }: Props) {
  const {
    databaseId,
    type,
    label,
    description,
    cssClass,
    isRequired,
    defaultValue,
    choices,
  } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(
    (fieldValue: FieldValue) => fieldValue.id === databaseId
  ) as StringFieldValue | undefined;
  const value = fieldValue?.value || String(defaultValue);
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

      <fieldset>
        {label && <legend className='mb-2'>{label}</legend>}

        <select
          className='select'
          name={String(databaseId)}
          id={htmlId}
          required={Boolean(isRequired)}
          value={value}
          onChange={(event) => {
            dispatch({
              type: ACTION_TYPES.updateSelectFieldValue,
              fieldValue: {
                id: databaseId,
                value: event.target.value,
              },
            });
          }}
        >
          {choices.map((choice: any) => (
            <option key={choice.value} value={choice.value}>
              {choice.text || ''}
            </option>
          ))}
        </select>
      </fieldset>

      {description && <p className='form__field-description'>{description}</p>}
    </div>
  );
}
