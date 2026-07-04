import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#020B07',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#10B981',
            marginBottom: 8,
          }}
        >
          asiri/
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#E7F5EE',
            fontWeight: 700,
          }}
        >
          Asiri Harischandra
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#6EE7B7',
            marginTop: 8,
          }}
        >
          Full-stack developer · University of Moratuwa
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
