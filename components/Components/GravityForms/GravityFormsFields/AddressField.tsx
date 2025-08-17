import React from 'react';

import useGravityForm, {
  ACTION_TYPES,
  FieldValue,
  AddressFieldValue,
} from '@/hooks/useGravityForm';
import { BsFillExclamationSquareFill } from 'react-icons/bs';

export const ADDRESS_FIELD_FIELDS = `
  fragment AddressFieldFields on AddressField {
    label
    description
    cssClass
    inputs {
      id
      label
      ... on AddressInputProperty {
        key
        isHidden
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
  street: 'address-line1',
  lineTwo: 'address-line2',
  city: 'address-level2',
  state: 'address-level1',
  country: 'country-name',
};

export default function AddressField({ field, fieldErrors }: Props) {
  const { databaseId, type, label, description, cssClass, inputs } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(
    (fieldValue: FieldValue) => fieldValue.id === databaseId
  ) as AddressFieldValue | undefined;
  const addressValues = fieldValue?.addressValues || DEFAULT_VALUE;
  const hasErrors = !!fieldErrors?.length;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const newAddressValues = { ...addressValues, [name]: value };

    dispatch({
      type: ACTION_TYPES.updateAddressFieldValue,
      fieldValue: {
        id: databaseId,
        addressValues: newAddressValues,
      },
    });
  }

  return (
    <fieldset id={htmlId} className={`${cssClass || ''} ${hasErrors ? 'has-errors' : ''}`.trim()}>
      {hasErrors &&
        fieldErrors.map((fieldError) => (
          <div key={fieldError.id} className='form__error-message'>
            <BsFillExclamationSquareFill size={16} />
            <p>{fieldError.message}</p>
          </div>
        ))}

      {label && <legend className='mb-6'>{label}</legend>}

      {!!inputs?.length &&
        inputs?.map((input: any) => {
          const key: string = input?.key;
          const inputLabel: string = input?.label || '';
          const isFilled = !!addressValues?.[key];

          if (!input?.isHidden) {
            return (
              <div
                className={`form__group form__group--${type.toLowerCase()}`}
                key={key}
              >
                <input
                  className={`form__input ${isFilled ? 'filled' : ''}`}
                  type='text'
                  name={key}
                  id={`input_${databaseId}_${key}`}
                  autoComplete={AUTOCOMPLETE_ATTRIBUTES[key]}
                  value={addressValues?.[key] ?? ''}
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

          // TODO: handle 'country' field as select field with list of enum values (AddressFieldCountryEnum e.g. UK, PL)
        })}

      {description && <p className='form__field-description'>{description}</p>}
    </fieldset>
  );
}
