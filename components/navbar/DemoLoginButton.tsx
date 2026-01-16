'use client';

import { Button } from '../ui/button';
import { useSignIn } from '@clerk/nextjs';
import LoadingContainer from '../global/LoadingContainer';

type ParamsType = { role: 'user' | 'moderator' };
function DemoLoginButton({ role }: ParamsType) {
  const { isLoaded, signIn, setActive } = useSignIn();
  if (!isLoaded) return <LoadingContainer />;
  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      onClick={async () => {
        const identifier =
          role === 'moderator'
            ? process.env.NEXT_PUBLIC_MOD_EMAIL!
            : process.env.NEXT_PUBLIC_USER_EMAIL!;
        const password =
          role === 'moderator'
            ? process.env.NEXT_PUBLIC_MOD_PASSWORD!
            : process.env.NEXT_PUBLIC_USER_PASSWORD!;
        const { createdSessionId } = await signIn?.create({
          identifier,
          password,
          strategy: 'password',
        });
        await setActive({
          session: createdSessionId,
        });
      }}
      className='w-full hover:cursor-pointer capitalize font-medium tracking-wider text-chart-4'
    >
      {role}
    </Button>
  );
}
export default DemoLoginButton;
