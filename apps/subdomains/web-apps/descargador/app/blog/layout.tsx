'use client'

import BlogHeader from '@/components/Layout/MainHeader'
import Footer from '@/components/Layout/Footer'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <BlogHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
