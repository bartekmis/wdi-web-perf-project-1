import { ButtonConnection, ButtonTarget, ButtonVariant } from '@/components/Components/Button';
import { SectionSettings } from '@/types/theme';

type ThemeOptions = {
  [key: number]: string,
};

const headlineSizes: ThemeOptions = {
  0: 'headline-1',
  1: 'headline-display',
  2: 'headline-2',
  3: 'headline-3',
  4: 'headline-4',
  5: 'headline-5',
  6: 'headline-6',
};

export const getHeadlineSize = (index: number) => {
  return headlineSizes[index];
};

const bgColours: ThemeOptions = {
  0: 'bg-transparent',
  1: 'bg-white',
  2: 'bg-black',
  3: 'bg-blackSecondary',
  4: 'bg-lightGrey',
  5: 'bg-lightGreySecondary',
  6: 'bg-red',
  7: 'bg-redSecondary',
  8: 'bg-yellow',
};

export const getBgColour = (index: number) => {
  return bgColours[index];
};

const textColours: ThemeOptions = {
  0: 'text-black',
  1: 'text-white',
  2: 'text-blackSecondary',
  3: 'text-lightGrey',
  4: 'text-lightGreySecondary',
  5: 'text-red',
  6: 'text-redSecondary',
  7: 'text-yellow',
};

export const getTextColour = (index: number) => {
  return textColours[index];
};

const paddingTopSizes: ThemeOptions = {
  0: '',
  1: 'section--p-small-top',
  2: 'section--p-large-top',
  3: 'section--p-none-top',
};

export const getPaddingTop = (index: number) => {
  return paddingTopSizes[index];
};

const paddingBottomSizes: ThemeOptions = {
  0: '',
  1: 'section--p-small-bottom',
  2: 'section--p-large-bottom',
  3: 'section--p-none-bottom',
};

export const getPaddingBottom = (index: number) => {
  return paddingBottomSizes[index];
};

const containerSizes: ThemeOptions = {
  0: 'container',
  1: 'container-extra-small',
  2: 'container-small',
  3: 'container-large',
  4: 'container-extra-large',
  5: 'container-fluid',
};

export const getContainerSize = (index: number) => {
  return containerSizes[index];
};

const fontSizes: ThemeOptions = {
  0: '',
  1: 'text-small',
  2: 'text-large',
};

export const getFontSize = (index: number) => {
  return fontSizes[index];
};

const textAlignments: ThemeOptions = {
  0: '',
  1: 'text-center',
  2: 'text-right',
};

export const getTextAlignment = (index: number) => {
  return textAlignments[index];
};

const buttonVariants: ThemeOptions = {
  0: 'primary-black',
  1: 'primary-yellow',
  2: 'secondary-black',
  3: 'secondary-white',
  4: 'secondary-yellow',
};

export const getButtonVariant = (index: number) => {
  return buttonVariants[index] as ButtonVariant;
};

const buttonConnection: ThemeOptions = {
  0: '',
  1: 'left',
  2: 'right',
  3: 'both',
};

export const getButtonConnection = (index: number) => {
  return buttonConnection[index] as ButtonConnection;
};

const buttonTarget: ThemeOptions = {
  0: '_self',
  1: '_blank',
};

export const getButtonTarget = (index: number) => {
  return buttonTarget[index] as ButtonTarget;
};

export const getSectionSettings = (settings: SectionSettings ) => {
  let classes = '';

  classes += `${bgColours[settings.bgColour]} `;
  classes += `${paddingTopSizes[settings.paddingTop]} `;
  classes += `${paddingBottomSizes[settings.paddingBottom]} `;
  classes += `${fontSizes[settings.fontSize]} `;
  classes += `${textAlignments[settings.textAlignment]} `;

  return classes;
};