'use client';

import dynamic from 'next/dynamic';

const Aurora = dynamic(() => import('./aurora'), { 
  ssr: false,
  loading: () => null
});

interface AuroraBackgroundProps {
  colorStops: string[];
  blend: number;
  amplitude: number;
  speed: number;
}

export default function AuroraBackground({ colorStops, blend, amplitude, speed }: AuroraBackgroundProps) {
  return (
    <Aurora
      colorStops={colorStops}
      blend={blend}
      amplitude={amplitude}
      speed={speed}
    />
  );
}
