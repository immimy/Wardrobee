import { Dispatch } from 'react';
import { ControlPosition, MapControl, useMap } from '@vis.gl/react-google-maps';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Location } from '@/utils/types';
import { setAddress } from '@/utils/clientFunctions';

type ParamsType = {
  setLocation: Dispatch<Location>;
  location: Location;
};

function MapControlContainer({ setLocation, location }: ParamsType) {
  const map = useMap()!;

  const getAddress = async () => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.status !== 'OK') throw new Error(data.error_message);
      const address = data.results[0].formatted_address as string;
      setAddress(address);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to get an address';
      return toast.error(message);
    }
  };

  const panToCurrentLocation = async () => {
    // Google Maps API expires
    if (!map) return toast.error('The Geolocation service expired.');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(pos);
          map.setCenter(pos);
          map.setZoom(18);
        },
        () => handleLocationError(true)
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false);
    }
  };

  function handleLocationError(browserHasGeolocation: boolean) {
    const message = browserHasGeolocation
      ? 'The Geolocation service failed.'
      : "Your browser doesn't support geolocation.";
    toast.error(message);
  }

  return (
    <MapControl position={ControlPosition.TOP_CENTER}>
      <div className='pt-2'>
        <Button type='button' variant='outline' onClick={getAddress}>
          Get address
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={panToCurrentLocation}
          className='ml-2'
        >
          Pan to current location
        </Button>
      </div>
    </MapControl>
  );
}
export default MapControlContainer;
