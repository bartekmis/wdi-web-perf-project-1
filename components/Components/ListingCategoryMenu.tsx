import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';

import { CaseStudyCategory } from '@/types/case-study';
import { FaqCategory } from '@/types/faq';
import { KnowledgeCategory } from '@/types/knowledge';
import Link from 'next/link';

const ListingCategoryMenu = ({
  categories,
  module,
}: {
  categories: CaseStudyCategory[] | KnowledgeCategory[] | FaqCategory[];
  module: 'case-studies' | 'knowledge' | 'faq';
}) => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const [currentPath, setCurrentPath] = useState(`${router.asPath}/`);

  const labels = {
    'case-studies': 'All Case Studies',
    'knowledge': 'All Knowledge',
    'faq': 'All FAQs',
  };

  useEffect(() => {
    setDomLoaded(true);
    setCurrentPath(`${router.asPath}/`);
  }, [router.asPath]);

  return (
    <div className='container-large w-full z-[1] mt-9 md:mt-20 min-h-[90px]'>
      {domLoaded && <Swiper
        className='bg-white rounded-[66px] !p-3 !ml-0 w-fit max-w-full'
        slidesPerView='auto'
        freeMode={true}
        grabCursor={true}
      >
        <SwiperSlide className='!w-auto mr-3'>
          <Link
            href={`/${module}`}
            className={`${
              currentPath === `/${module}/`
                ? 'bg-yellow'
                : 'bg-transparent hover:bg-lightGrey transition duration-300'
            } block font-bold text-[18px] 3xl:text-[20px] py-[24px] px-[30px] 3xl:py-[30px] 3xl:px-[36px] rounded-[66px] leading-none whitespace-nowrap`}
          >
            {labels[module] || 'All'}
          </Link>
        </SwiperSlide>

        {categories.map((category) => {
          return (
            <SwiperSlide key={category.id} className='!w-auto mr-3 last:mr-0'>
              <Link
                href={`/${module}/category/${category.slug}`}
                className={`${
                  currentPath === `/${module}/category/${category.slug}/`
                    ? 'bg-yellow'
                    : 'bg-transparent hover:bg-lightGrey transition duration-300'
                } block font-bold text-[18px] 3xl:text-[20px] py-[24px] px-[30px] 3xl:py-[30px] 3xl:px-[36px] rounded-[66px] leading-none whitespace-nowrap`}
              >
                {category.name}
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>}
    </div>
  );
};

export default ListingCategoryMenu;
