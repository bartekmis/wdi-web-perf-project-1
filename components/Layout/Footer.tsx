import { HierarchicalMenu } from '@/types/menu';
import Link from 'next/link';

import styles from '@/styles/layout/footer.module.scss';
import SocialIcons from '../Components/SocialIcons';
import { useContext } from 'react';
import { PartialsContext } from '@/contexts/partials';
import { PartialsData } from '@/types/partials';
import { formatPhone } from '@/lib/helper-utils';

const Footer = ({
  menu,
  menuSecondary,
}: {
  menu: HierarchicalMenu;
  menuSecondary: HierarchicalMenu;
}) => {
  const { footer, company } = useContext(PartialsContext) as PartialsData;

  return (
    <footer className={styles.footer}>
      <div className='container-large py-12 xl:py-16'>
        <div className='grid gap-12 md:gap-16 md:grid-cols-2 xl:grid-cols-4'>
          <ul className='flex gap-12 md:gap-16 md:col-span-2 xl:order-2'>
            {!!menu.length &&
              menu.map((item) => {
                return (
                  <li
                    key={item.key}
                    className='inline-flex flex-col gap-6 flex-1'
                  >
                    <Link
                      href={item.path}
                      title={item.title || item.label}
                      target={item.target || ''}
                      className={`link link--secondary text-xl font-bold text-yellow xl:text-2xl ${item.cssClasses}`}
                    >
                      {item.label}
                    </Link>
                    {!!item.children?.length && (
                      <ul className='inline-flex flex-col gap-6'>
                        {item.children.map((child, index) => {
                          return (
                            <li
                              className={`${item.children?.length}`}
                              key={child.key}
                            >
                              <Link
                                href={child.path}
                                title={child.title || child.label}
                                target={child.target || ''}
                                className={`link link--secondary font-medium xl:text-xl ${child.cssClasses}`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
          </ul>

          <div className='inline-flex items-start flex-col gap-6 xl:order-1'>
            <div>
              {company.address && (
                <address
                  className='not-italic text-sm xl:text-lg'
                  dangerouslySetInnerHTML={{ __html: company.address }}
                ></address>
              )}

              {company.directions_url && (
                <Link
                  href={company.directions_url}
                  title='Get directions'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='link link--basic font-medium text-sm xl:text-lg'
                >
                  Get Directions
                </Link>
              )}
            </div>

            {company.phone && (
              <Link
                href={`tel:${formatPhone(company.phone)}`}
                title={`Call ${company.phone}`}
                className='link link--basic text-sm xl:text-lg'
              >
                {company.phone}
              </Link>
            )}

            {company.email && (
              <Link
                href={`mailto:${company.email}`}
                title={`Email ${company.email}`}
                className='link link--basic text-sm xl:text-lg'
              >
                {company.email}
              </Link>
            )}

            <SocialIcons className='mt-4 xl:mt-auto' />
          </div>

          <div className='flex flex-col gap-12 xl:order-3'>
            <ul className='flex flex-col gap-6 text-sm xl:text-lg'>
              {!!menuSecondary.length &&
                menuSecondary.map((item) => {
                  return (
                    <li key={item.key}>
                      <Link
                        className='link link--basic'
                        href={item.path}
                        title={item.title || item.label}
                        target={item.target || ''}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
            </ul>

            <div className='flex flex-wrap gap-6 text-sm xl:text-lg font-medium'>
              {footer.copyright_text && <p>{footer.copyright_text}</p>}
              <p>
                Designed & Developed by{' '}
                <Link
                  href='https://www.biggerpicture.agency/'
                  title='Bigger Picture'
                  className='link link--basic'
                  target='_blank'
                  rel='noopener nofollow noreferrer'
                >
                  Bigger Picture
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
