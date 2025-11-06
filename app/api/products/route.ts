import { fetchAllProducts } from '@/utils/actions';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const { search, cursor, limit, promotion, bestseller } = Object.fromEntries(
    searchParams.entries()
  );
  try {
    const resp = await fetchAllProducts({
      search,
      cursor,
      limit,
      promotion,
      bestseller,
    });
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected errors';
    return new Response(message, { status: 500 });
  }
};
