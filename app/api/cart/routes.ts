import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
  return Response.json({ msg: 'testing...' });
};
