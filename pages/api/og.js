import { ImageResponse } from 'next/og';

export const config = { runtime: 'edge' };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0f0a',
          color: '#00ff66',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: 30, color: '#9effc4' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#00ff66' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#00ff66' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#00ff66' }} />
          </div>
          <div style={{ display: 'flex' }}>chris@portfolio: ~</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, color: '#ffffff', letterSpacing: '2px' }}>
            CHRIS CARRILLO
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: '#00ff66', marginTop: '16px' }}>
            a miami based creative &amp; software engineer
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, color: '#00ff66', marginTop: '44px' }}>
            $&nbsp;
            <div style={{ display: 'flex', width: 20, height: 40, background: '#00ff66' }} />
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
