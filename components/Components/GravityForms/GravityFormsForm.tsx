import { FormEvent, useContext, useEffect, useState } from 'react';

import useGravityForm from '@/hooks/useGravityForm';
import GravityFormsField from './GravityFormsField';
import Loading from '../Loading';
import Button from '../Button';
import { MdOutlineClose } from 'react-icons/md';
import Decoration from '../Decoration';
import { FormSettings } from '@/types/theme';
import { useRouter } from 'next/router';
import { PartialsContext } from '@/contexts/partials';
import { PartialsData } from '@/types/partials';
import Headline from '../Headline';
import { getHeadlineSize } from '@/lib/theme-utils';

const GravityFormsForm = ({
  form,
  settings,
  animationClass,
  onSubmit,
}: {
  form: any;
  settings: FormSettings,
  animationClass?: string,
  onSubmit: (isSuccess: boolean) => void;
}) => {
  const router = useRouter();
  const { forms } = useContext(PartialsContext) as PartialsData;

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>(null);
  const [responseMessage, setResponseMessage] = useState(
    'Form has been successfully submitted.'
  );

  const defaultConfirmation = form.confirmations?.find(
    (confirmation: any) => confirmation?.isDefault && confirmation?.type === 'MESSAGE'
  );

  const redirectConfirmation = form.confirmations?.find(
    (confirmation: any) => confirmation?.isActive && confirmation?.type === 'REDIRECT'
  );

  const pageConfirmation = form.confirmations?.find(
    (confirmation: any) => confirmation?.isActive && confirmation?.type === 'PAGE'
  );

  const formFields = form.formFields?.nodes || [];
  const { state } = useGravityForm();

  useEffect(() => {
    onSubmit(isSuccess);
  }, [isSuccess, onSubmit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    const data = { formId: form.databaseId, fieldValues: state };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch('/api/form/submit', options);

    try {
      const result = await response.json();
      const isSubmissionSuccess = !!result.entry?.id && !!result.errors === false;

      setIsSuccess(isSubmissionSuccess);
      setFieldErrors(result.errors);
      setResponseMessage(result.message);
      setLoading(false);
      
      if (isSubmissionSuccess) {
        if (redirectConfirmation && redirectConfirmation.url) {
          window.location = redirectConfirmation.url;
        } else if (pageConfirmation && pageConfirmation.page?.node?.uri) {
          router.push(pageConfirmation.page?.node?.uri);
        } else if (forms?.forms_redirect_url) {
          router.push(forms.forms_redirect_url);
        }
      }
    } catch (e) {
      setIsSuccess(false);
      setFieldErrors(null);
      setResponseMessage("Couldn't submit the form. Please try again later.");
      setLoading(false);
    }
  };

  const getFieldErrors = (id: number): any[] => {
    if (!fieldErrors) return [];
    return fieldErrors.filter((error: any) => error.id === id);
  };

  const getBgColour = (index: number) => {
    const options: any = {
      0: 'bg-white',
      1: 'bg-yellow',
    };

    return options[index];
  }
  
  const getBtnVariant = (index: number) => {
    const options: any = {
      0: 'primary-yellow',
      1: 'primary-black',
    };

    return options[index];
  }

  return (
    <div className={`${getBgColour(settings.bgColour)} form-wrapper relative text-black p-6 md:p-12 3xl:p-16 overflow-hidden ${animationClass || ''}`}>
      <Headline 
        type={settings.title_tag} 
        className={`${getHeadlineSize(settings.title_size) || 'headline-3'} ${(settings.description || form.description) ? 'mb-6' : 'mb-9'}`}
      >
        {settings.title || form.title}
      </Headline>
      
      {(settings.description || form.description) && (
        <div className='content mb-9'>
          <p>{settings.description || form.description}</p>
        </div>
      )}

      <form method='post' className={form.cssClass ? `form ${form.cssClass}` : 'form'} onSubmit={handleSubmit}>
        {formFields.map((field: any) => {
          if (!!field?.type === false) {
            return;
          }

          return (
            <GravityFormsField
              key={field?.databaseId}
              field={field}
              fieldErrors={getFieldErrors(Number(field?.databaseId))}
            />
          );
        })}

        <div className={`flex flex-wrap gap-4 mt-6 ${form.submitButton?.width === 'FULL' ? '' : 'justify-end'}`}>
          <Button
            className={`form__submit ${form.submitButton?.width === 'FULL' ? 'w-full' : ''}`}
            type='submit'
            disabled={loading}
            text={form.submitButton?.text || 'Submit'}
            size='small'
            variant={getBtnVariant(settings.btnColour)}
            connection={form.submitButton?.width === 'FULL' ? undefined : 'left'}
          ></Button>
        </div>

        {settings.footer && <div className='content mt-9'><p className='text-small'>{settings.footer}</p></div>}
      </form>

      {isSuccess && (
        <div className={`${getBgColour(settings.bgColour)} overflow-hidden absolute w-full h-full top-0 left-0 p-20 flex justify-start items-center`}>
          {settings.bgColour === 0 && <>
            <Decoration type={1} colour={0} variant='custom' className='w-[50%] pb-[50%] left-0 bottom-0 translate-y-[50%] translate-x-[-50%]'/>
            <Decoration type={2} colour={1} variant='custom' className='w-[50%] pb-[50%] right-0 top-0 opacity-10'/>
          </>}
          
          {settings.bgColour === 1 && <>
            <Decoration type={1} colour={2} variant='custom' className='w-[50%] pb-[50%] right-0 top-0 translate-y-[-50%] translate-x-[50%]'/>
            <Decoration type={2} colour={1} variant='custom' className='w-[65%] pb-[65%] left-0 bottom-0 opacity-10'/>
          </>}

          <button
            type='button'
            aria-label='Close'
            className='absolute right-6 top-6 p-[6px]'
            onClick={() => setIsSuccess(false)}
          >
            <MdOutlineClose size={36} />
          </button>

          <div
            className='relative content z-[1]'
            dangerouslySetInnerHTML={{
              __html:
                defaultConfirmation?.message || `<p>${responseMessage}</p>`,
            }}
          ></div>
        </div>
      )}

      <Loading active={loading} />
    </div>
  );
};

export default GravityFormsForm;
