import { Roles } from '@/types/globals';
import { auth } from '@clerk/nextjs/server';

export const getRole = async (): Promise<Roles | 'user'> => {
  return (await auth())?.sessionClaims?.metadata?.role ?? 'user';
};
