import { HiMinus, HiPlus } from 'react-icons/hi';
import Accordion from './Accordion';
import styles from '@/styles/components/faq.module.scss';

export type AccordionItem = {
  title: string;
  text: string;
};

type AccordionVariant = 'secondary';

const FaqGroup = ({
  items,
  variant,
}: {
  items: AccordionItem[];
  variant?: AccordionVariant;
}) => {
  return (
    <div
      className={`${styles['faq-group']} ${
        variant ? styles[`faq-group--${variant}`] : ''
      } `}
    >
      {items.map((item, index: number) => {
        return (
          <Accordion
            key={index}
            trigger={
              <button type='button'>
                {item.title && (
                  <span className='flex-1 text-left headline-6 !font-bold'>
                    {item.title}
                  </span>
                )}
                <div className={styles['icon-wrapper']}>
                  <HiPlus
                    className={`${styles['icon']} ${styles['icon--open']}`}
                    size={24}
                  />
                  <HiMinus
                    className={`${styles['icon']} ${styles['icon--close']}`}
                    size={24}
                  />
                </div>
              </button>
            }
            triggerClassName={styles['trigger']}
            accordionClassName={styles['accordion']}
            accordionClassNameOpen={styles['open']}
          >
            <ul className='mt-3 md:pr-12 xl:pr-24'>
              {item.text && (
                <li
                  className='content'
                  dangerouslySetInnerHTML={{ __html: item.text }}
                ></li>
              )}
            </ul>
          </Accordion>
        );
      })}
    </div>
  );
};

export default FaqGroup;
