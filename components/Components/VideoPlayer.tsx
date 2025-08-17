import { useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useInView } from 'react-intersection-observer';
import { FaPlay } from 'react-icons/fa';

import ContentImage from './ContentImage';
import Loading from './Loading';

const VideoPlayer = ({
  id,
  autoplay,
  poster,
}: {
  id: string;
  autoplay?: boolean;
  poster?: string;
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isError, setIsError] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      mute: autoplay ? 1 : 0,
      controls: autoplay ? 0 : 1,
      showinfo: autoplay ? 0 : 1,
      autohide: autoplay ? 1 : 0,
    },
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    event.target.playVideo();
  };

  const onPlay: YouTubeProps['onPlay'] = () => {
    setHasStarted(true);
  };

  const onError: YouTubeProps['onError'] = (event) => {
    setIsError(true);
    event.target.destroy();
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // loop video https://developers.google.com/youtube/iframe_api_reference?hl=pl#Events
    if (event.data === 0) {
      event.target.playVideo();
    }
  };

  return (
    <>
      {autoplay && (
        <div ref={ref} className='relative w-full pb-[56.25%] overflow-hidden'>
          {inView && (
            <>
              <YouTube
                className='absolute w-full h-full top-0 left-0'
                videoId={id}
                opts={opts}
                onPlay={onPlay}
                onError={onError}
                onReady={onReady}
                onStateChange={onStateChange}
              />

              {!hasStarted && !isError && (
                <div className='absolute w-full h-full top-0 left-0'>
                  {poster && (
                    <ContentImage
                      className='absolute w-full h-full top-0 left-0 object-cover'
                      sizes='80vw'
                      id={poster}
                    />
                  )}
                  <Loading active={!hasStarted} />
                </div>
              )}

              {!hasStarted && isError && (
                <div className='absolute w-full h-full top-0 left-0 bg-black flex flex-col items-center justify-center content'>
                  <p>Could not play the video, please try again later.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!autoplay && (
        <div className='relative w-full pb-[56.25%] overflow-hidden'>
          {showVideo && (
            <YouTube
              className='absolute w-full h-full top-0 left-0'
              videoId={id}
              opts={opts}
              onPlay={onPlay}
              onError={onError}
              onReady={onReady}
              onStateChange={onStateChange}
            />
          )}
          
          {(!showVideo || !hasStarted) && !isError && (
            <button
              aria-label='Play'
              type='button'
              className='absolute w-full h-full top-0 left-0'
              onClick={() => {
                setShowVideo(true);
              }}
            >
              <div className='absolute w-full h-full top-0 left-0'>
                {poster && (
                  <ContentImage
                    className='absolute w-full h-full top-0 left-0 object-cover'
                    sizes='80vw'
                    id={poster}
                  />
                )}
                {!showVideo && (
                  <FaPlay className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-yellow cursor-pointer w-[48px] h-[48px] md:w-[60px] md:h-[60px]' />
                )}
                {showVideo && !hasStarted && <Loading active={!hasStarted} />}
              </div>
              <div className='absolute top-0 left-0 w-full h-full bg-gradient-yellow opacity-0 transition duration-500 hover:opacity-50'></div>
            </button>
          )}

          {!hasStarted && isError && (
            <div className='absolute w-full h-full top-0 left-0 bg-black flex flex-col items-center justify-center content'>
              <p>Could not play the video, please try again later.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
