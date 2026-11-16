import type { Metadata } from 'next';
import { getRecipeBySlug } from '@/data/recipes';
import { AdSenseInjector } from '@/components/AdSenseInjector';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) {
    return {
      title: 'Receta no encontrada | Perú Sabor Inteligente',
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${recipe.name} — Receta Técnica, Gramajes y Costeo | Perú Sabor`,
    description: recipe.description || `Ficha técnica gastronómica de ${recipe.name} (${recipe.region}): ingredientes exactos en gramos, paso a paso profesional y costeo por porción.`,
    alternates: {
      canonical: `/recetas/${recipe.slug}`,
    },
    other: {
      'google-adsense-account': 'ca-pub-5414009811868137',
    },
  };
}

export default async function RecipeSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  return (
    <>
      {recipe ? <AdSenseInjector /> : null}
      {children}
    </>
  );
}
