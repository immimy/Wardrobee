import { cn } from '@/lib/utils';

function Title({ title, className }: { title: string; className?: string }) {
  return (
    <h1
      className={cn(
        'capitalize text-3xl tracking-wider p-2 border-b text-primary',
        className
      )}
    >
      {title}
    </h1>
  );
}
export default Title;
