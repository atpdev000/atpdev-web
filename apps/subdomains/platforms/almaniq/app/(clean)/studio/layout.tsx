import type { Metadata } from 'next'
import StudioShell from '@/components/StudioShell'

export const metadata: Metadata = {
  title: 'Almaniq Studio | Panel Interno',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <StudioShell>{children}</StudioShell>
}
