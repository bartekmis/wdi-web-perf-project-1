import Button from '@/components/Components/Button';

const Theme = () => {
  return (
    <>
      <style jsx>{``}</style>

      <main>
        <div className='py-4 px-6 bg-black font-bold'>Colours</div>

        <section className='p-8 md:p-12'>
          <div className='grid md:grid-cols-3 gap-8 md:gap-12'>
            <div className='flex flex-col '>
              <div className='bg-white w-full h-48 border border-lightGreySecondary'></div>
              <div className='mt-4 flex justify-between items-center'>
                <p className='font-bold'>White</p>
                <p className='text-sm'>#ffffff</p>
              </div>
            </div>
            
            <div className='flex flex-col '>
              <div className='bg-black w-full h-48 border border-lightGreySecondary'></div>
              <div className='mt-4 flex justify-between items-center'>
                <p className='font-bold'>Black</p>
                <p className='text-sm'>#121212</p>
              </div>
            </div>
            
            <div className='flex flex-col '>
              <div className='bg-blackSecondary w-full h-48 border border-lightGreySecondary'></div>
              <div className='mt-4 flex justify-between items-center'>
                <p className='font-bold'>Black secondary</p>
                <p className='text-sm'>#191919</p>
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='bg-red w-full h-48'></div>
              <div className='mt-4  flex justify-between items-center'>
                <p className='font-bold'>Red</p>
                <p className='text-sm'>#ED33326</p>
              </div>
            </div>
            
            <div className='flex flex-col'>
              <div className='bg-redSecondary w-full h-48'></div>
              <div className='mt-4  flex justify-between items-center'>
                <p className='font-bold'>Red secondary</p>
                <p className='text-sm'>#DE2012</p>
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='bg-lightGrey w-full h-48'></div>
              <div className='mt-4  flex justify-between items-center'>
                <p className='font-bold'>Light grey</p>
                <p className='text-sm'>#F5F5F5</p>
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='bg-lightGreySecondary w-full h-48'></div>
              <div className='mt-4  flex justify-between items-center'>
                <p className='font-bold'>Light grey secondary</p>
                <p className='text-sm'>#EDEDED</p>
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='bg-yellow w-full h-48'></div>
              <div className='mt-4 flex justify-between items-center'>
                <p className='font-bold'>Yellow</p>
                <p className='text-sm'>#F2D06D</p>
              </div>
            </div>
          </div>
        </section>

        <div className='py-4 px-6 bg-black font-bold'>Buttons</div>

        <section className='p-8 md:p-12'>
          <div className="grid md:grid-cols-2 gap-8">
            <div className='flex flex-col items-center gap-8'>
              <div className='flex flex-col items-center gap-2 p-4'>
                <p className='text-sm font-bold'>Primary black</p>
                <Button text='Book a consultation' variant='primary-black'></Button>
              </div>

              <div className='flex flex-col items-center gap-2 p-4'>
                <p className='text-sm font-bold'>Primary yellow</p>
                <Button text='Book a consultation' variant='primary-yellow'></Button>
              </div>
            </div>
              
            <div className='flex flex-col items-center gap-8'>
              <div className='flex flex-col items-center gap-2 p-4'>
                <p className='text-sm font-bold'>Secondary black</p>
                <Button text='Book a consultation' variant='secondary-black'></Button>
              </div>
              
              <div className='flex flex-col items-center gap-2 bg-black p-4'>
                <p className='text-sm font-bold'>Secondary white</p>
                <Button text='Book a consultation' variant='secondary-white'></Button>
              </div>
              
              <div className='flex flex-col items-center gap-2 bg-black p-4'>
                <p className='text-sm font-bold'>Secondary yellow</p>
                <Button text='Book a consultation' variant='secondary-yellow'></Button>
              </div>
            </div>

            <div className='flex flex-col items-center gap-8'>
              <div className='flex flex-col items-center gap-2 p-4'>
                <p className='text-sm font-bold'>Primary black (connected - left)</p>
                <Button text='Book a consultation' variant='primary-black' connection='left'></Button>
              </div>

              <div className='flex flex-col items-center gap-2 p-4'>
                <p className='text-sm font-bold'>Primary yellow (connected - right)</p>
                <Button text='Book a consultation' variant='primary-yellow' connection='right'></Button>
              </div>
              
              {/* <div className='flex flex-col items-center gap-2 p-4'>
                <p className='text-sm font-bold'>Primary black (connected - both)</p>
                <Button text='Book a consultation' variant='primary-black' connection='both'></Button>
              </div> */}
            </div>
          </div>
        </section>
       
        <div className='py-4 px-6 bg-black font-bold'>Margins</div>

        <section className='p-8 md:p-12 overflow-hidden'>
          
          <div className="flex gap-4 items-end text-sm font-bold">
            <div className="flex justify-center items-end bg-yellow w-full h-60"><p className='bottom-0'>244px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-54"><p className='bottom-0'>210px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-48"><p className='bottom-0'>180px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-36"><p className='bottom-0'>144px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-32"><p className='bottom-0'>120px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-24"><p className='bottom-0'>96px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-20"><p className='bottom-0'>72px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-16"><p className='bottom-0'>60px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-12"><p className='bottom-0'>48px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-9"><p className='bottom-0'>36px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-8"><p className='bottom-0'>30px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-6"><p className='bottom-0'>24px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-5"><p className='bottom-0'>20px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-4.5"><p className='bottom-0'>18px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-4"><p className='bottom-0'>16px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-3"><p className='bottom-0'>12px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-2"><p className='bottom-0'>8px</p></div>
            <div className="flex justify-center items-end bg-yellow w-full h-1"><p className='bottom-0'>4px</p></div>
          </div>

        </section>

        <div className='py-4 px-6 bg-black font-bold'>Section paddings</div>

        <section className='p-8 md:p-12'>
          
          <div className="grid grid-cols-3 gap-12">
            <div className="flex flex-col justify-end text-center gap-2">
              <div className="section section--p-large-bottom section--p-none-top bg-yellow"></div>
              <p className='font-bold text-xl'>Large</p>
              <p className='text-lg'>96px</p>
            </div>
            
            <div className="flex flex-col justify-end text-center gap-2">
              <div className="section section--p-none-top bg-yellow"></div>
              <p className='font-bold text-xl'>Medium</p>
              <p className='text-lg'>60px</p>
            </div>
            
            <div className="flex flex-col justify-end text-center gap-2">
              <div className="section section--p-small-bottom section--p-none-top bg-yellow"></div>
              <p className='font-bold text-xl'>Small</p>
              <p className='text-lg'>48px</p>
            </div>
          </div>

        </section>
        
        <div className='py-4 px-6 bg-black font-bold'>Containers</div>

        <section className='py-8 md:py-12 text-center text-sm font-bold'>
          <div className="container-fluid p-4 bg-yellow ">.container-fluid</div>
          <div className="container-extra-large p-4 bg-yellow mt-12">.container-extra-large</div>
          <div className="container-large p-4 bg-yellow mt-12">.container-large</div>
          <div className="container p-4 bg-yellow mt-12">.container</div>
          <div className="container-small p-4 bg-yellow mt-12">.container-small</div>
          <div className="container-extra-small p-4 bg-yellow mt-12">.container-extra-small</div>
        </section>
        
        <div className='py-4 px-6 bg-black font-bold'>Headlines</div>

        <section className='p-8 md:p-12'>
          <h1 className='headline-display'>We design and build workspaces where people love to work</h1>
          <h1 className='headline-1 mt-12'>We design and build workspaces where people love to work</h1>
          <h2 className='headline-2 mt-12'>We design and build workspaces where people love to work</h2>
          <h3 className='headline-3 mt-12'>We design and build workspaces where people love to work</h3>
          <h4 className='headline-4 mt-12'>We design and build workspaces where people love to work</h4>
          <h5 className='headline-5 mt-12'>We design and build workspaces where people love to work</h5>
          <h6 className='headline-6 mt-12'>We design and build workspaces where people love to work</h6>
        </section>
        
        <div className='py-4 px-6 bg-black font-bold'>Paragraphs</div>

        <section className='p-8 md:p-12'>

          <p className='mb-8'>
            <strong>Important Note!</strong> Remember that all paragraphs should have .content parent.
          </p>

          <div className="content">
            <p className='text-large'>
              Our passionate and creative team of designers, project managers and construction experts have been creating workspaces people love for over 18 years. Whether it’s a furniture brief across the globe or complete fit out project in the heart of Mayfair, we will deliver. It’s the K2 way.
            </p>
          </div>

          <div className="content mt-12">
            <p>
              Our passionate and creative team of designers, project managers and construction experts have been creating workspaces people love for over 18 years. Whether it’s a furniture brief across the globe or complete fit out project in the heart of Mayfair, we will deliver. It’s the K2 way.
            </p>
          </div>

          <div className="content mt-12">
            <p className='text-small'>
              Our passionate and creative team of designers, project managers and construction experts have been creating workspaces people love for over 18 years. Whether it’s a furniture brief across the globe or complete fit out project in the heart of Mayfair, we will deliver. It’s the K2 way.
            </p>
          </div>

        </section>

      </main>
    </>
  );
};

export default Theme;
