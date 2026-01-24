import { fetchAllProducts, getAuthUser } from '@/utils/actions';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const queryParams = Object.fromEntries(searchParams.entries());
  try {
    if (queryParams.admin) {
      const { userId, role } = await getAuthUser();
      if (role !== 'admin') {
        queryParams.creatorId = userId;
      }
    }
    const resp = await fetchAllProducts(queryParams);
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected errors';
    return new Response(message, { status: 500 });
  }
};
