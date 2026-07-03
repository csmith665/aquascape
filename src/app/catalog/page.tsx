import { prisma } from '@/lib/db';
import { CatalogTable } from './CatalogTable';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [animals, plants, products] = await Promise.all([
    prisma.animal.findMany({
      select: {
        id: true,
        name: true,
        scientificName: true,
        category: true,
        difficulty: true,
        description: true,
        imageUrl: true,
        minTankSize: true,
        tempMin: true,
        tempMax: true,
        habitats: true,
        biome: true,
        tags: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.plant.findMany({
      select: {
        id: true,
        name: true,
        scientificName: true,
        category: true,
        difficulty: true,
        description: true,
        imageUrl: true,
        lightRequirement: true,
        biome: true,
        tags: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        description: true,
        imageUrl: true,
        priceRange: true,
        rating: true,
        tags: true,
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  const initialParams = {
    type: typeof searchParams.type === 'string' ? searchParams.type : '',
    category: typeof searchParams.category === 'string' ? searchParams.category : '',
    difficulty: typeof searchParams.difficulty === 'string' ? searchParams.difficulty : '',
    habitat: typeof searchParams.habitat === 'string' ? searchParams.habitat : '',
    biome: typeof searchParams.biome === 'string' ? searchParams.biome : '',
    light: typeof searchParams.light === 'string' ? searchParams.light : '',
    priceRange: typeof searchParams.priceRange === 'string' ? searchParams.priceRange : '',
    search: typeof searchParams.search === 'string' ? searchParams.search : '',
  };

  return (
    <>
      <div className="hero">
        <h1>Catalog</h1>
        <p>Browse all animals, plants, and products in one place</p>
      </div>

      <section className="section">
        <CatalogTable animals={animals} plants={plants} products={products} initialParams={initialParams} />
      </section>
    </>
  );
}
