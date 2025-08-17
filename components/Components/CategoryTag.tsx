const CategoryTag = ({ label }: { label: string }) => {
  if (!label) {
    return <></>;
  }

  return (
    <div className='font-bold text-sm py-3 px-4 rounded-[41px] bg-yellow whitespace-nowrap'>
      {label}
    </div>
  );
};

export default CategoryTag;
