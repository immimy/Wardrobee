import { Card, CardAction, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

type ParamsType = { number: number };
function CardsSkeleton({ number }: ParamsType) {
  return (
    <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {Array.from({ length: number }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
export default CardsSkeleton;

function CardSkeleton() {
  return (
    <Card className='pt-0 pb-4'>
      <CardHeader className='px-0 rounded-t-xl'>
        <Skeleton className='h-54' />
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-y-2'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-32' />
        </div>
        <CardAction className='mt-1.5'>
          <Skeleton className='size-8 rounded' />
        </CardAction>
      </CardContent>
    </Card>
  );
}
