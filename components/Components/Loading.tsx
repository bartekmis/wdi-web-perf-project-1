import { AiOutlineLoading } from 'react-icons/ai';

const Loading = ({ active, size = 60 }: { active: boolean; size?: number }) => {
  if (!active) {
    return <></>;
  }

  return (
    <div className='absolute w-full h-full top-0 left-0 flex items-center justify-center'>
      <div className='absolute w-full h-full top-0 left-0 bg-white opacity-50'></div>
      <AiOutlineLoading className='text-yellow animate-spin' size={size} />
    </div>
  );
};

export default Loading;
