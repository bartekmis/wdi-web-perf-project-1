import Link from 'next/link';
import { ReactNode } from 'react';
import styles from '@/styles/components/social-icon.module.scss';

const SocialIcon = ({
  href,
  title,
  children,
}: {
  href: string;
  title: string,
  children: ReactNode;
}) => {
  return (
    <Link
      className={styles['social-icon']}
      title={title}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
    >
      {children}
    </Link>
  );
};

export default SocialIcon;
