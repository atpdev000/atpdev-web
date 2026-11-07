'use client'

import React, { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

interface TOCItem {
    id: string
    text: string
}

export default function TableOfContents({ content }: { content: string }) {
    const { t } = useI18n()
    const [items, setItems] = useState<TOCItem[]>([])

    useEffect(() => {
        // Parser simple para extraer H2 del contenido HTML
        const div = document.createElement('div')
        div.innerHTML = content
        const headings = div.querySelectorAll('h2')

        const tocItems: TOCItem[] = Array.from(headings).map((h, index) => {
            const text = h.textContent || ''
            const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `section-${index}`
            return { id, text }
        })

        setItems(tocItems)
    }, [content])

    if (items.length === 0) return null

    const scrollToId = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <nav className="bg-blue-50/80 dark:bg-slate-800/80 p-6 rounded-2xl border border-blue-100 dark:border-slate-700/80 mb-8" suppressHydrationWarning>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {t.blog?.tableOfContents || 'Contenido de esta guía'}
            </h3>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item.id}>
                        <button
                            onClick={() => scrollToId(item.id)}
                            className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium hover:underline text-left block w-full cursor-pointer"
                        >
                            • {item.text}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
