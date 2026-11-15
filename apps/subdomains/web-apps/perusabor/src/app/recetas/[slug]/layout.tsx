import type { Metadata } from 'next';
import { getRecipeBySlug } from '@/data/recipes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) {
    return {
      title: 'Receta Peruana | Perú Sabor Inteligente',
      alternates: { canonical: `/recetas/${slug}` },
    };
  }
  return {
    title: `${recipe.name} — Receta Técnica, Gramajes y Costeo | Perú Sabor`,
    description: recipe.description || `Ficha técnica gastronómica de ${recipe.name} (${recipe.region}): ingredientes exactos en gramos, paso a paso profesional y costeo por porción.`,
    alternates: {
      canonical: `/recetas/${recipe.slug}`,
    },
  };
}

export default function RecipeSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
