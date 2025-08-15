import { FaXmark } from 'react-icons/fa6';
import { Button } from '../ui/button';
import MapComponent from '../map/MapComponent';
import { mapDisplay } from '@/utils/clientFunctions';

function MapContainer() {
  return (
    <div className='mb-4'>
      <input type='checkbox' id='map-display' className='hidden peer' />
      <div className='hidden peer-checked:block text-end'>
        <Button
          type='button'
          variant='destructive'
          size='sm'
          onClick={() => mapDisplay(false)}
          className='mb-1 uppercase tracking-widest font-medium hover:bg-muted-foreground hover:text-muted transition-all'
        >
          close map
          <span>
            <FaXmark />
          </span>
        </Button>
        <div className='h-96'>
          <MapComponent />
        </div>
      </div>
    </div>
  );
}
export default MapContainer;
