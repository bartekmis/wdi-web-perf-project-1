import useGravityForm, {
  ACTION_TYPES,
  FieldValue,
  StringFieldValues,
} from '@/hooks/useGravityForm';
import { ChangeEvent } from 'react';
import { BsFillExclamationSquareFill } from 'react-icons/bs';

export const MULTI_SELECT_FIELD_FIELDS = `
  fragment MultiSelectFieldFields on MultiSelectField {
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

const DEFAULT_VALUE: string[] = [];

export default function MultiSelectField({ field, fieldErrors }: Props) {
  const {
    databaseId,
    type,
    label,
    description,
    cssClass,
    isRequired,
    choices,
  } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(
    (fieldValue: FieldValue) => fieldValue.id === databaseId
  ) as StringFieldValues | undefined;
  const values = fieldValue?.values || DEFAULT_VALUE;
  const options =
    choices?.map((choice: any) => ({
      value: choice?.value,
      label: choice?.text,
    })) || [];
  const selectedOptions = options
    .filter((option: any) => values.includes(String(option?.value)))
    .map((option: any) => option.value);
  const hasErrors = !!fieldErrors?.length;

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.options)
      .filter(({ selected }) => selected)
      .map(({ value }) => value);

    dispatch({
      type: ACTION_TYPES.updateMultiSelectFieldValue,
      fieldValue: { id: databaseId, values },
    });
  };

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

      {label && (
        <label className='block w-full mb-2' htmlFor={htmlId}>
          {label}
        </label>
      )}

      <select
        className='block w-full'
        multiple={true}
        name={String(databaseId)}
        id={htmlId}
        required={Boolean(isRequired)}
        value={selectedOptions}
        onChange={handleChange as any}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {description && <p className='form__field-description'>{description}</p>}
    </div>
  );
}
