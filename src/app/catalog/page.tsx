import { prisma } from '@/lib/db';
import { CatalogTable } from './CatalogTable';

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
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

  return (
    <>
      <div className="hero">
        <h1>Catalog</h1>
        <p>Browse all animals, plants, and products in one place</p>
      </div>

      <section className="section">
        <CatalogTable animals={animals} plants={plants} products={products} />
      </section>
    </>
  );
}
