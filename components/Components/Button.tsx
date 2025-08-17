import {
  ButtonHTMLAttributes,
  CSSProperties,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import styles from '@/styles/components/button.module.scss';
import { ConditionalWrapper } from '@/lib/helper-utils';
import { useInView } from 'react-intersection-observer';

export type ButtonVariant =
  | 'primary-yellow'
  | 'primary-black'
  | 'secondary-black'
  | 'secondary-white'
  | 'secondary-yellow';

export type ButtonConnection = 'left' | 'right';

export type ButtonTarget = '_self' | '_blank';

type ButtonSize = 'small' | 'regular';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: ReactNode;
  component?: any;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  fullwidth?: boolean;
  hoverEffect?: boolean;
  connection?: ButtonConnection;
  target?: string;
  animationDisabled?: boolean;
  animationDisabledMobileOnly?: boolean;
}

const variantsClass = {
  'primary-yellow': 'btn--primary-yellow',
  'primary-black': 'btn--primary-black',
  'secondary-black': 'btn--secondary-black',
  'secondary-white': 'btn--secondary-white',
  'secondary-yellow': 'btn--secondary-yellow',
};

const variantsConnectionLineClass = {
  'primary-yellow': 'bg-yellow',
  'primary-black': 'bg-black',
  'secondary-black': 'bg-black',
  'secondary-white': 'bg-white',
  'secondary-yellow': 'bg-yellow',
};

const sizesClass = {
  small: 'btn--small',
  regular: 'btn--regular',
};

const buttonAnimationClass = {
  left: 'animation-revealButtonLeft',
  right: 'animation-revealButtonRight',
};

const Button = forwardRef(function Button(
  {
    component: Component = 'button',
    text = '',
    variant = 'primary-yellow',
    size = 'regular',
    children,
    className,
    fullwidth = false,
    hoverEffect = true,
    connection,
    target,
    animationDisabled,
    animationDisabledMobileOnly,
    ...props
  }: Props,
  ref: any
) {
  const wrapperRef = useRef<any>();
  const internalRef = useRef<any>();

  const [positionLeft, setPositionLeft] = useState(0);
  const [positionRight, setPositionRight] = useState(0);
  const [textStyles, setTextStyles] = useState<CSSProperties>({});
  const [isConnectionHandled, setIsConnectionHandled] = useState(false);

  useImperativeHandle<any, any>(ref, () =>
    connection ? wrapperRef.current : internalRef.current
  );

  const { ref: inViewRef, inView } = useInView({
    rootMargin: '0px 100px 0px 100px',
    threshold: 0,
    triggerOnce: true,
  });

  const setWrapperRef = useCallback(
    (node: any) => {
      wrapperRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  useEffect(() => {
    if (hoverEffect) {
      setTextStyles({
        animationDuration: `${(internalRef.current.offsetWidth * 2) / 212}s`,
      });
    }

    if (connection) {
      const handleConnection = () => {
        const position = internalRef.current.getBoundingClientRect();
        setPositionLeft(Math.ceil(position.left));
        setPositionRight(
          Math.floor(document.body.clientWidth - position.right)
        );
        setIsConnectionHandled(true);
      };

      handleConnection();

      window.addEventListener('resize', handleConnection, true);

      return () => {
        window.removeEventListener('resize', handleConnection, true);
      };
    }
  }, [hoverEffect, connection]);

  const getButtonPosition = (connection?: ButtonConnection) => {
    if (connection === 'left') {
      return { marginLeft: `-${positionLeft}px` };
    }

    if (connection === 'right') {
      return { marginRight: `-${positionRight}px` };
    }
  };

  return (
    <ConditionalWrapper
      condition={!!connection}
      wrapper={(children: ReactNode) => (
        <div
          ref={setWrapperRef}
          className={`inline-flex items-center ${
            !animationDisabled ? 'opacity-0' : ''
          } ${
            connection && isConnectionHandled && !animationDisabled
              ? buttonAnimationClass[connection]
              : ''
          } ${inView && !animationDisabled ? 'animated' : ''} ${
            animationDisabledMobileOnly ? 'mobile-no-animation' : ''
          }`}
          style={getButtonPosition(connection)}
        >
          {connection === 'left' && (
            <div
              className={`h-[1px] ${variantsConnectionLineClass[variant]}`}
              style={{
                width: `${positionLeft}px`,
              }}
            ></div>
          )}

          {children}

          {connection === 'right' && (
            <div
              className={`h-[1px] ${variantsConnectionLineClass[variant]}`}
              style={{
                width: `${positionRight}px`,
              }}
            ></div>
          )}
        </div>
      )}
    >
      <Component
        ref={internalRef}
        className={`
            ${styles['btn']}
            ${styles[variantsClass[variant]]}
            ${styles[sizesClass[size]]}
            ${fullwidth ? styles['btn--fullwidth'] : ''}
            ${hoverEffect ? styles['btn--effect'] : ''}
            ${className || ''}
            ${
              !!connection === false && !animationDisabled
                ? 'animation-fadeIn'
                : ''
            }
            ${
              animationDisabledMobileOnly ? 'mobile-no-animation' : ''
            }
          `}
        target={target || ''}
        rel={target && target === '_blank' ? 'noopener noreferrer' : ''}
        {...props}
      >
        {(variant === 'primary-black' || variant === 'primary-yellow') && (
          <span className={styles['btn__bg']}>
            <span></span>
          </span>
        )}
        <span
          style={textStyles}
          className={styles['btn__text']}
          data-hover={hoverEffect ? text : ''}
        >
          <span>{text}</span>
        </span>
      </Component>
    </ConditionalWrapper>
  );
});

export default Button;
