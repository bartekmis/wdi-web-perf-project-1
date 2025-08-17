import {
  cloneElement,
  forwardRef,
  ReactElement,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react';
import styles from '@/styles/components/dropdown.module.scss';
import useOutsideClick from '@/hooks/outside-click';

const Dropdown = forwardRef(function Dropdown(
  {
    trigger,
    triggerClassName,
    triggerClassNameOpen,
    children,
  }: {
    trigger: ReactElement;
    triggerClassName: string;
    triggerClassNameOpen: string;
    children: ReactNode;
  },
  ref: any
) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const innerRef = useOutsideClick(handleClickOutside);

  useImperativeHandle<any, any>(ref, () => ({
    close() {
      setIsOpen(false);
    },
  }));

  return (
    <div
      ref={innerRef}
      className={`${styles['dropdown']} ${isOpen ? `${styles['open']}` : ''}`}
    >
      {cloneElement(trigger, {
        className: isOpen
          ? `${triggerClassName} ${triggerClassNameOpen}`
          : triggerClassName,
        onClick: () => {
          handleToggle();
        },
      })}
      <div className={styles['dropdown__content']}>{children}</div>
    </div>
  );
});

export default Dropdown;
