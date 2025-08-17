import { fetchAPI } from '../lib/api-utils';

import { ADDRESS_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/AddressField';
import { CHECKBOX_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/CheckboxField';
import { CONSENT_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/ConsentField';
import { DATE_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/DateField';
import { EMAIL_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/EmailField';
import { MULTI_SELECT_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/MultiSelectField';
import { NAME_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/NameField';
import { PHONE_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/PhoneField';
import { RADIO_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/RadioField';
import { SELECT_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/SelectField';
import { TEXT_AREA_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/TextAreaField';
import { TEXT_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/TextField';
import { TIME_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/TimeField';
import { WEBSITE_FIELD_FIELDS } from '@/components/Components/GravityForms/GravityFormsFields/WebsiteField';

export const getGravityForms = async () => {
  const data = await fetchAPI(`
    {
      gfForms(first: 100) {
        edges {
          node {
            databaseId
            title
            description
            cssClass
            submitButton {
              text
              width
            }
            confirmations {
              isActive
              isDefault
              message
              type
              url
              page {
                node {
                  uri
                }
              }
            }
            formFields {
              nodes {
                databaseId
                type
                ... on AddressField {
                  ...AddressFieldFields
                }
                ... on ConsentField {
                  ...ConsentFieldFields
                }
                ... on CheckboxField {
                  ...CheckboxFieldFields
                }
                ... on DateField {
                  ...DateFieldFields
                }
                ... on EmailField {
                  ...EmailFieldFields
                }
                ... on MultiSelectField {
                  ...MultiSelectFieldFields
                }
                ... on NameField {
                  ...NameFieldFields
                }
                ... on PhoneField {
                  ...PhoneFieldFields
                }
                ... on RadioField {
                  ...RadioFieldFields
                }
                ... on SelectField {
                  ...SelectFieldFields
                }
                ... on TextAreaField {
                  ...TextAreaFieldFields
                }
                ... on TextField {
                  ...TextFieldFields
                }
                ... on TimeField {
                  ...TimeFieldFields
                }
                ... on WebsiteField {
                  ...WebsiteFieldFields
                }
              }
            }
          }
        }
      }
    }
    ${ADDRESS_FIELD_FIELDS} 
    ${CHECKBOX_FIELD_FIELDS}
    ${CONSENT_FIELD_FIELDS}
    ${DATE_FIELD_FIELDS}
    ${EMAIL_FIELD_FIELDS}
    ${MULTI_SELECT_FIELD_FIELDS}
    ${NAME_FIELD_FIELDS}
    ${PHONE_FIELD_FIELDS}
    ${RADIO_FIELD_FIELDS}
    ${SELECT_FIELD_FIELDS}
    ${TEXT_AREA_FIELD_FIELDS}
    ${TEXT_FIELD_FIELDS} 
    ${TIME_FIELD_FIELDS} 
    ${WEBSITE_FIELD_FIELDS} 
  `);

  return data?.gfForms.edges.map((item: any) => item.node);
};

export const submitGravityForm = async (formId: number, fieldValues: any[]) => {
  const query = `
    mutation submitForm($formId: ID!, $fieldValues: [FormFieldValuesInput]!) {
      submitGfForm(input: {
        id: $formId
        fieldValues: $fieldValues
      }) {
        entry {
          id
        }
        errors {
          id
          message
        }
      }
    }
  `;

  const data = await fetchAPI(query, { variables: { formId, fieldValues }});

  return data?.submitGfForm;
};
