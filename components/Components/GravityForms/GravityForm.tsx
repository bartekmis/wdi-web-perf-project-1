import { FormsContext } from '@/contexts/forms';
import { useContext } from 'react';
import GravityFormsForm from './GravityFormsForm';
import { GravityFormProvider } from '@/hooks/useGravityForm';
import { FormSettings } from '@/types/theme';

const GravityForm = ({
  settings,
  animationClass,
  onSubmit,
}: {
  settings: FormSettings;
  animationClass?: string;
  onSubmit?: (isSuccess: boolean) => void;
}) => {
  const forms = useContext(FormsContext) as any[];
  const form = forms?.find((form) => form.databaseId === settings.id);

  if (!form) {
    return <></>;
  }

  return (
    <GravityFormProvider>
      <GravityFormsForm
        form={form}
        settings={settings}
        animationClass={animationClass}
        onSubmit={(isSuccess) => onSubmit && onSubmit(isSuccess)}
      />
    </GravityFormProvider>
  );
};

export default GravityForm;
