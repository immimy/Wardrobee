import { Roles } from '@/types/globals';
import { auth } from '@clerk/nextjs/server';

export const getRole = async (): Promise<Roles | undefined> => {
  return (await auth())?.sessionClaims?.metadata?.role;
};
