import React from 'react';
import { HerramientasGuide } from '@/components/HerramientasGuide';

export default function HerramientasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <HerramientasGuide />
    </>
  );
}

