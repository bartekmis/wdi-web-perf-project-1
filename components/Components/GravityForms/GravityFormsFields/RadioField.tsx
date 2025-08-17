import useGravityForm, {
  ACTION_TYPES,
  FieldValue,
  StringFieldValue,
} from '@/hooks/useGravityForm';
import { BsFillExclamationSquareFill } from 'react-icons/bs';

export const RADIO_FIELD_FIELDS = `
  fragment RadioFieldFields on RadioField {
    label
    description
    cssClass
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

const DEFAULT_VALUE = '';

export default function RadioField({ field, fieldErrors }: Props) {
  const { databaseId, type, label, description, cssClass, choices } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(
    (fieldValue: FieldValue) => fieldValue.id === databaseId
  ) as StringFieldValue | undefined;
  const value = fieldValue?.value || DEFAULT_VALUE;
  const hasErrors = !!fieldErrors?.length;
  const isFilled = !!value;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: ACTION_TYPES.updateRadioFieldValue,
      fieldValue: {
        id: databaseId,
        value: event.target.value,
      },
    });
  }

  return (
    <fieldset
      id={htmlId}
      className={`form__group form__group--${type.toLowerCase()} ${
        cssClass || ''
      }`.trim()}
    >
      {hasErrors &&
        fieldErrors.map((fieldError) => (
          <div key={fieldError.id} className='form__error-message'>
            <BsFillExclamationSquareFill size={16} />
            <p>{fieldError.message}</p>
          </div>
        ))}

      {label && <legend>{label}</legend>}

      {choices?.map((input: any) => {
        const text = input?.text || '';
        const inputValue = input?.value || '';
        return (
          <div className='relative my-2' key={inputValue}>
            <input
              className='radio'
              type='radio'
              name={String(databaseId)}
              id={`choice_${databaseId}_${inputValue}`}
              value={inputValue}
              onChange={handleChange}
            />
            <label
              className='radio__label'
              htmlFor={`choice_${databaseId}_${inputValue}`}
            >
              {text}
            </label>
          </div>
        );
      })}

      {description && <p className='field-description'>{description}</p>}
    </fieldset>
  );
}
