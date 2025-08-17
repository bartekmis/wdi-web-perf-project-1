import { ChangeEvent } from 'react';

import useGravityForm, {
  ACTION_TYPES,
  FieldValue,
  NameFieldValue,
} from '@/hooks/useGravityForm';
import { BsFillExclamationSquareFill } from 'react-icons/bs';

export const NAME_FIELD_FIELDS = `
  fragment NameFieldFields on NameField {
    label
    description
    cssClass
    inputs {
      id
      label
      ... on NameInputProperty {
        key
        isHidden
        placeholder
        choices {
          isSelected
          text
          value
        }
      }
    }
  }
`;

interface Props {
  field: any;
  fieldErrors: any[];
}

const DEFAULT_VALUE: any = {};

const AUTOCOMPLETE_ATTRIBUTES: { [key: string]: string } = {
  prefix: 'honorific-prefix',
  first: 'given-name',
  middle: 'additional-name',
  last: 'family-name',
  suffix: 'honorific-suffix',
};

export default function NameField({ field, fieldErrors }: Props) {
  const { databaseId, type, label, description, cssClass, inputs } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(
    (fieldValue: FieldValue) => fieldValue.id === databaseId
  ) as NameFieldValue | undefined;
  const nameValues = fieldValue?.nameValues || DEFAULT_VALUE;
  const hasErrors = !!fieldErrors?.length;

  const prefixInput = inputs?.find((input: any) => input?.key === 'prefix');
  const otherInputs =
    inputs?.filter((input: any) => input?.key !== 'prefix') || [];

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    const newNameValues = { ...nameValues, [name]: value };

    dispatch({
      type: ACTION_TYPES.updateNameFieldValue,
      fieldValue: {
        id: databaseId,
        nameValues: newNameValues,
      },
    });
  }

  return (
    <fieldset
      id={htmlId}
      className={`${cssClass || ''} ${hasErrors ? 'has-errors' : ''}`.trim()}
    >
      {hasErrors &&
        fieldErrors.map((fieldError) => (
          <div key={fieldError.id} className='form__error-message'>
            <BsFillExclamationSquareFill size={16} />
            <p>{fieldError.message}</p>
          </div>
        ))}

      {label && <legend className='mb-6'>{label}</legend>}

      {prefixInput && (
        <div className='form__group form__group--select'>
          <select
            className='select'
            name={String(prefixInput.key)}
            id={`input_${databaseId}_${prefixInput.key}`}
            autoComplete={AUTOCOMPLETE_ATTRIBUTES.prefix}
            value={nameValues.prefix || ''}
            onChange={handleChange}
          >
            <option value=''>Select prefix</option>
            {prefixInput.choices?.map((choice: any) => (
              <option key={choice?.value} value={String(choice?.value)}>
                {String(choice?.text)}
              </option>
            ))}
          </select>
        </div>
      )}

      {otherInputs.map((input: any) => {
        const key = input?.key as any;
        const inputLabel = input?.label || '';
        const placeholder = input?.placeholder || '';
        const isFilled = !!nameValues?.[key];

        if (!input?.isHidden) {
          return (
            <div
              className={`form__group form__group--${type.toLowerCase()}`}
              key={key}
            >
              <input
                className={`form__input ${isFilled ? 'filled' : ''}`}
                type='text'
                name={String(key)}
                id={`input_${databaseId}_${key}`}
                placeholder={placeholder}
                autoComplete={AUTOCOMPLETE_ATTRIBUTES[key]}
                value={nameValues?.[key] || ''}
                onChange={handleChange}
              />
              <label
                className='form__label'
                htmlFor={`input_${databaseId}_${key}`}
              >
                {inputLabel}
              </label>
            </div>
          );
        }
      })}

      {description && <p className='field-description'>{description}</p>}
    </fieldset>
  );
}
