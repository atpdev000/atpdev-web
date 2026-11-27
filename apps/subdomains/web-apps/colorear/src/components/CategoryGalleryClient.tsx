'use client';

import React, { useState } from 'react';
import { ColoringSheet } from '@/data/catalog';
import SheetCard from './SheetCard';
import InlineNotice from './InlineNotice';

export default function CategoryGalleryClient({ sheets }: { sheets: ColoringSheet[] }) {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {notice && (
        <InlineNotice
          tone="success"
          title="Añadido al Estudio KDP"
          message={`"${notice}" se agregó a tu cola de páginas del Estudio KDP.`}
          onClose={() => setNotice(null)}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sheets.map((sheet) => (
          <SheetCard key={sheet.id} sheet={sheet} onAddedToStudio={(t) => setNotice(t)} />
        ))}
      </div>
    </div>
  );
}

