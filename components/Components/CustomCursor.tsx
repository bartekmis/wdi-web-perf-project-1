import { useContext } from 'react';

import useMousePosition from '@/hooks/mouse-position';
import { CursorContext } from '@/contexts/cursor';
import styles from '@/styles/components/cursor.module.scss';

const CustomCursor = () => {
  const { x, y } = useMousePosition();
  const { isActive } = useContext(CursorContext);

  return (
    <div
      className={`${styles['cursor']} ${isActive ? styles['active'] : ''}`}
      style={{ left: `${x}px`, top: `${y}px` }}
    ></div>
  );
};

export default CustomCursor;
