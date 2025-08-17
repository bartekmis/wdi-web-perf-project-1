import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import Loading from './Loading';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const Map = ({
  latitude,
  longitude,
  fullscreen = false,
  className,
}: {
  latitude: number;
  longitude: number;
  fullscreen?: boolean;
  className?: string;
}) => {
  const lockRef = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  if (inView) {
    lockRef.current = true;
  }

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${
        fullscreen ? 'h-full' : 'h-0 pb-[56.25%]'
      } ${className || ''}`}
    >
      {lockRef.current && (
        <MapComponent latitude={latitude} longitude={longitude} />
      )}
    </div>
  );
};

const MapComponent = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  const center = { lat: latitude, lng: longitude };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) return <Loading active={true} />;

  return (
    <GoogleMap
      zoom={15}
      center={center}
      mapContainerClassName='absolute w-full h-full'
    >
      <MarkerF position={{ lat: latitude, lng: longitude }} />
    </GoogleMap>
  );
};

export default Map;
