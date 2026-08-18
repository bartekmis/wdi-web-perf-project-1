import Link from 'next/link';

import {
  getBgColour,
  getButtonConnection,
  getButtonVariant,
  getHeadlineSize,
} from '@/lib/theme-utils';
import ContentImage from './ContentImage';
import Button from './Button';
import Headline from './Headline';

export type StandoutCtaData = {
  isReversed: boolean;
  isSingleColumn: boolean;
  bgColour: number;
  headline: string;
  headlineSize: number;
  headlineTag: string;
  text: string;
  image: string;
  btns: any[];
};

const StandoutCta = ({ data }: { data: StandoutCtaData }) => {
  if (data.image) {
    return (
      <div
        className={`${getBgColour(
          data.bgColour
        )} grid md:grid-cols-5 overflow-hidden md:rounded-r-[300px]`}
      >
        <figure
          className={`${
            data.isReversed ? 'md:col-[4/6] md:row-[1/2]' : 'md:col-[1/3]'
          }`}
        >
          <ContentImage
            id={data.image}
            sizes='(max-width: 767px) 100vw, 20vw'
            className='w-full h-full object-cover'
          />
        </figure>

        <div
          className={`${
            data.isReversed
              ? 'md:col-[1/4] md:row-[1/2] overflow-hidden'
              : 'md:col-[3/6]'
          } p-9 md:p-12`}
        >
          {data.headline && (
            <Headline
              type={data.headlineTag}
              className={`${getHeadlineSize(data.headlineSize)} ${data.isReversed ? '' : 'pr-9 md:pr-12'} animation-fadeIn`}
            >
              {data.headline}
            </Headline>
          )}

          {data.text && (
            <div className='content mt-6 animation-fadeIn'>
              <p>{data.text}</p>
            </div>
          )}

          {!!data.btns?.length && (
            <div className='flex flex-wrap gap-4 mt-9'>
              {data.btns.map((btn: any, index: number) => {
                return (
                  <Button
                    key={index}
                    component={Link}
                    href={btn.url}
                    title={btn.title}
                    text={btn.title}
                    variant={getButtonVariant(btn.style)}
                    connection={getButtonConnection(btn.connection)}
                    animationDisabled
                  ></Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    if (data.isSingleColumn) {
      return (
        <div
          className={`${getBgColour(
            data.bgColour
          )} grid overflow-hidden md:rounded-r-[300px] p-9 md:p-12`}
        >
          {data.headline && (
            <p className={getHeadlineSize(data.headlineSize)}>
              {data.headline}
            </p>
          )}
          {data.text && (
            <div className='content mt-6'>
              <p>{data.text}</p>
            </div>
          )}
          {!!data.btns?.length && (
            <div className='flex flex-wrap gap-4 mt-9'>
              {data.btns.map((btn: any, index: number) => {
                return (
                  <Button
                    key={index}
                    component={Link}
                    href={btn.url}
                    title={btn.title}
                    text={btn.title}
                    variant={getButtonVariant(btn.style)}
                    connection={getButtonConnection(btn.connection)}
                    animationDisabled
                  ></Button>
                );
              })}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className={`${getBgColour(
            data.bgColour
          )} grid xl:grid-cols-6 gap-12 xl:gap-32 items-center overflow-hidden md:rounded-r-[300px] p-9 md:p-12 xl:p-20`}
        >
          <div className='xl:col-[1/5]'>
            {data.headline && (
              <p className={getHeadlineSize(data.headlineSize)}>
                {data.headline}
              </p>
            )}
            {data.text && (
              <div className='content mt-6'>
                <p>{data.text}</p>
              </div>
            )}
          </div>
          <div className='xl:col-[5/7]'>
            {!!data.btns?.length && (
              <div className='flex flex-wrap gap-4'>
                {data.btns.map((btn: any, index: number) => {
                  return (
                    <Button
                      key={index}
                      component={Link}
                      href={btn.url}
                      title={btn.title}
                      text={btn.title}
                      variant={getButtonVariant(btn.style)}
                      connection={getButtonConnection(btn.connection)}
                      animationDisabled
                    ></Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }
  }
};

export default StandoutCta;
