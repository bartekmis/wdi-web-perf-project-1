import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';

import PersonCard from '../PersonCard';

const TeamListingSlider = ({ people }: { people: any[] }) => {
  const shuffledPeople = people.sort(() => Math.random() - 0.5);
  const peopleFirstHalf = shuffledPeople.slice(
    0,
    Math.ceil(shuffledPeople.length / 2)
  );
  const peopleSecondHalf = shuffledPeople.slice(
    Math.ceil(shuffledPeople.length / 2)
  );

  return (
    <>
      <Swiper
        className='!px-6 md:!px-12 3xl:!px-20'
        slidesPerView={1}
        spaceBetween={24}
        grabCursor={true}
        loop={true}
        breakpoints={{
          768: {
            slidesPerView: 1.5,
          },
          991: {
            slidesPerView: 2.5,
          },
          1600: {
            slidesPerView: 2.7,
          },
        }}
      >
        {!!peopleFirstHalf.length &&
          peopleFirstHalf.map((person: any, index: number) => {
            return (
              <SwiperSlide key={index} className='!h-auto !flex'>
                <PersonCard
                  image={person.image}
                  name={person.name}
                  role={person.role}
                />
              </SwiperSlide>
            );
          })}
      </Swiper>

      <Swiper
        className='mt-6 !px-6 md:!px-12 3xl:!px-20'
        slidesPerView={1}
        spaceBetween={24}
        grabCursor={true}
        loop={true}
        centeredSlides={true}
        breakpoints={{
          768: {
            slidesPerView: 1.5,
          },
          991: {
            slidesPerView: 2.5,
          },
          1600: {
            slidesPerView: 2.7,
          },
        }}
      >
        {!!peopleSecondHalf.length &&
          peopleSecondHalf.map((person: any, index: number) => {
            return (
              <SwiperSlide key={index} className='!h-auto !flex'>
                <PersonCard
                  image={person.image}
                  name={person.name}
                  role={person.role}
                />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
};

export default TeamListingSlider;
