import { KnowledgeArticle } from '@/types/knowledge';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';

import KnowledgeCard from '../KnowledgeCard';

const CardsSlider = ({ items }: { items: KnowledgeArticle[] }) => {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={48}
      grabCursor={true}
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        },
      }}
    >
      {!!items.length &&
        items.map((item) => {
          return (
            <SwiperSlide key={item.id}>
              <KnowledgeCard article={item} />
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default CardsSlider;
