import useGravityForm, {
  ACTION_TYPES,
  FieldValue,
  CheckboxFieldValue,
} from '@/hooks/useGravityForm';
import { BsFillExclamationSquareFill } from 'react-icons/bs';

export const CHECKBOX_FIELD_FIELDS = `
  fragment CheckboxFieldFields on CheckboxField {
    label
    description
    cssClass
    isRequired
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

const DEFAULT_VALUE: any[] = [];

const CheckboxField = ({ field, fieldErrors }: Props) => {
  const {
    databaseId,
    type,
    label,
    description,
    cssClass,
    choices,
    isRequired,
  } = field;
  const checkboxInputs =
    choices?.map((choice: any, index: number) => ({
      ...choice,
      id: `${databaseId}.${index + 1}`,
    })) || [];
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(
    (fieldValue: FieldValue) => fieldValue.id === databaseId
  ) as CheckboxFieldValue | undefined;
  const checkboxValues = fieldValue?.checkboxValues || DEFAULT_VALUE;
  const hasErrors = !!fieldErrors?.length;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = event.target;

    const otherCheckboxValues = checkboxValues.filter(
      (checkboxValue: any) => checkboxValue.inputId !== Number(name)
    );
    const newCheckboxValues = checked
      ? [...otherCheckboxValues, { inputId: Number(name), value }]
      : otherCheckboxValues;

    dispatch({
      type: ACTION_TYPES.updateCheckboxFieldValue,
      fieldValue: {
        id: databaseId,
        checkboxValues: newCheckboxValues,
      },
    });
  }

  return (
    <fieldset
      id={htmlId}
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

      {label && <legend>{label}</legend>}

      {checkboxInputs.map(({ id: inputId, text, value }: any) => (
        <div className='relative my-2' key={inputId}>
          <input
            className='checkbox'
            type='checkbox'
            name={String(inputId)}
            id={`input_${databaseId}_${inputId}`}
            value={String(value)}
            required={Boolean(isRequired)}
            onChange={handleChange}
          />
          <label
            className='checkbox__label'
            htmlFor={`input_${databaseId}_${inputId}`}
          >
            {text}
          </label>
        </div>
      ))}

      {description && <p className='form__field-description'>{description}</p>}
    </fieldset>
  );
};

export default CheckboxField;
