import styles from '@/styles/components/person-card.module.scss';
import ContentImage from './ContentImage';

const PersonCard = ({
  image,
  name,
  role,
}: {
  image: string;
  name: string;
  role: string;
}) => {
  return (
    <div className={`${styles['card']}`}>
      <div className={styles['card__figure-wrapper']}>
        <div className='absolute w-full h-full bg-yellow'></div>
        <figure className={`${styles['card__figure']}`}>
          <ContentImage
            className={`${styles['card__image']} ${styles['card__image--hover']}`}
            sizes='20vw'
            id={image}
          />
          <ContentImage
            className={`${styles['card__image']} ${styles['card__image--static']}`}
            sizes='20vw'
            id={image}
          />
        </figure>
      </div>

      <div className={styles['card__content']}>
        {name && (
          <p className={`${styles['card__title']} headline-3`}>{name}</p>
        )}
        {role && (
          <div className='content'>
            <p>{role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
