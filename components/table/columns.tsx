'use client';

import { ColumnDef } from '@tanstack/react-table';
import { fetchAllOrders } from '@/utils/actions';
import Link from 'next/link';
import { Button } from '../ui/button';
import { DateFormatter, priceFormatter } from '@/utils/format';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { TbMessageDots } from 'react-icons/tb';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { FaLocationDot } from 'react-icons/fa6';
import { HiArrowsUpDown } from 'react-icons/hi2';
import { cn } from '@/lib/utils';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderType = Awaited<ReturnType<typeof fetchAllOrders>>[0];

export const orderColumns: ColumnDef<OrderType>[] = [
  {
    accessorKey: 'id',
    header: () => <ColumnHeader text='Order' />,
    cell: ({ row }) => {
      const orderId = row.getValue('id') as string;
      const formatted = orderId.slice(-12);
      return (
        <Button
          asChild
          variant='link'
          className='uppercase text-secondary-foreground'
        >
          <Link href={`/dashboard/orders/${orderId}`}>{formatted}</Link>
        </Button>
      );
    },
  },
  { accessorKey: 'status', header: () => <ColumnHeader text='Status' /> },
  {
    accessorKey: 'shippingAddress',
    header: () => <ColumnHeader text='Shipping Address' />,
    cell: ({ row }) => {
      return (
        <ShippingAddressCell
          shippingAddress={row.getValue('shippingAddress') as string}
        />
      );
    },
  },
  {
    accessorKey: 'orderTotal',
    header: () => <ColumnHeader text='Amount' />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('orderTotal'));
      const formatted = priceFormatter(amount);
      return <p>{formatted}</p>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='font-bold'
        >
          Date
          <HiArrowsUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as Date;
      const formatted = DateFormatter(date);
      return <p>{formatted}</p>;
    },
  },
  {
    accessorKey: 'isOwner',
    header: () => <ColumnHeader text='Owner' />,
  },
];

function ColumnHeader({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return <div className={cn('font-bold', className)}>{text}</div>;
}

function ShippingAddressCell({ shippingAddress }: { shippingAddress: string }) {
  const [receiver, phoneNumber, address] = shippingAddress.split('\r\n');
  return (
    <div className='flex gap-x-2'>
      <p>
        {receiver} {phoneNumber}
      </p>
      <HoverCard>
        <HoverCardTrigger>
          <TbMessageDots />
        </HoverCardTrigger>
        <HoverCardContent asChild>
          <Alert>
            <FaLocationDot />
            <AlertTitle className='flex justify-between items-center'>
              <h6>{receiver}</h6>
            </AlertTitle>
            <AlertTitle>{phoneNumber}</AlertTitle>
            <AlertDescription className='whitespace-pre-wrap'>
              {address}
            </AlertDescription>
          </Alert>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
