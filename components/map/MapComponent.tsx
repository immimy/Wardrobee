'use client';

import { useState } from 'react';
import { BKK_LOCATION } from '@/utils/constants';
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapMouseEvent,
  Pin,
} from '@vis.gl/react-google-maps';
import MapControlContainer from './MapControlContainer';
import { Location } from '@/utils/types';

function MapComponent() {
  const [location, setLocation] = useState<Location>({
    lat: BKK_LOCATION.latitude,
    lng: BKK_LOCATION.longitude,
  });

  const mapClickHandler = (e: MapMouseEvent) => {
    const position = e.detail.latLng;
    if (!position) return;
    setLocation({ lat: position.lat, lng: position.lng });
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
      <Map
        mapId='map'
        colorScheme='FOLLOW_SYSTEM'
        defaultZoom={13}
        defaultCenter={{
          lat: BKK_LOCATION.latitude,
          lng: BKK_LOCATION.longitude,
        }}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        reuseMaps
        onClick={mapClickHandler}
      >
        <MapControlContainer setLocation={setLocation} location={location} />
      </Map>
      <AdvancedMarker position={location}>
        <Pin />
      </AdvancedMarker>
    </APIProvider>
  );
}
export default MapComponent;
