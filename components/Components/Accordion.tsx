import { cloneElement, ReactElement, ReactNode, useRef, useState } from 'react';
import styles from '@/styles/components/accordion.module.scss';

const Accordion = ({
  trigger,
  triggerClassName,
  accordionClassName,
  accordionClassNameOpen,
  children,
}: {
  trigger: ReactElement;
  triggerClassName: string;
  accordionClassName: string,
  accordionClassNameOpen: string;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const content = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsOpen(!isOpen);

    if (content.current) {
      content.current.style.maxHeight = content.current.style.maxHeight
      ? (content.current.style.maxHeight = '')
      : (content.current.style.maxHeight = `${content.current?.scrollHeight}px`);
    }
  };

  return (
    <div
      className={`${styles['accordion']} ${isOpen ? `${accordionClassName} ${accordionClassNameOpen}` : accordionClassName }`}
    >
      {cloneElement(trigger, {
        className: triggerClassName,
        onClick: () => {
          handleOpen();
        },
      })}
      <div ref={content} className={styles['accordion__content']}>{children}</div>
    </div>
  );
};

export default Accordion;
