'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Animal, Plant, Product } from '@prisma/client';
import { Biome, Difficulty, Habitat, LightLevel, PriceRange } from '@prisma/client';
import { ProductImage } from '@/components/ProductImage';

type CatalogEntry = {
  kind: 'animal' | 'plant' | 'product';
  id: string;
  name: string;
  subtitle: string | null;
  category: string;
  difficulty: string | null;
  info: string;
  imageUrl: string | null;
  tags: string[];
  habitats?: Habitat[];
  biome?: Biome | null;
  lightRequirement?: LightLevel;
  priceRange?: PriceRange | null;
};

type InitialParams = {
  type: string;
  category: string;
  difficulty: string;
  habitat: string;
  biome: string;
  light: string;
  priceRange: string;
  search: string;
};

const humanize = (s: string) =>
  s.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const TYPE_COLORS: Record<CatalogEntry['kind'], { bg: string; color: string; label: string }> = {
  animal: { bg: '#e7f3ff', color: '#1a5490', label: 'Animal' },
  plant: { bg: '#d1fae5', color: '#065f46', label: 'Plant' },
  product: { bg: '#fef3c7', color: '#92400e', label: 'Product' },
};

const CATEGORY_ICONS: Record<CatalogEntry['kind'], string> = {
  animal: 'M6.5 12c0-3 2.5-6 7.5-6 4 0 7 2 7 2l3-2-1 4 1 4-3-2s-3 2-7 2c-5 0-7.5-3-7.5-6Z',
  plant: 'M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16Z',
  product: 'M3 7 12 3 21 7 12 11 3 7Z',
};

type TypeFilter = 'all' | CatalogEntry['kind'];

function buildEntries(
  animals: { id: string; name: string; scientificName: string | null; category: string; difficulty: string; description: string | null; imageUrl: string | null; minTankSize: number | null; tempMin: number | null; tempMax: number | null; habitats: Habitat[]; biome: Biome; tags: string[] }[],
  plants: { id: string; name: string; scientificName: string | null; category: string; difficulty: string; lightRequirement: LightLevel; description: string | null; imageUrl: string | null; biome: Biome; tags: string[] }[],
  products: { id: string; name: string; brand: string | null; category: string; priceRange: PriceRange | null; rating: number | null; description: string | null; imageUrl: string | null; tags: string[] }[]
): CatalogEntry[] {
  const animEntries: CatalogEntry[] = animals.map((a) => ({
    kind: 'animal',
    id: a.id,
    name: a.name,
    subtitle: a.scientificName,
    category: a.category,
    difficulty: a.difficulty,
    info: a.minTankSize ? `Min ${a.minTankSize} gal` : '',
    imageUrl: a.imageUrl,
    tags: a.tags,
    habitats: a.habitats,
    biome: a.biome,
  }));

  const plantEntries: CatalogEntry[] = plants.map((p) => ({
    kind: 'plant',
    id: p.id,
    name: p.name,
    subtitle: p.scientificName,
    category: p.category,
    difficulty: p.difficulty,
    info: `${humanize(p.lightRequirement)} light`,
    imageUrl: p.imageUrl,
    tags: p.tags,
    biome: p.biome,
    lightRequirement: p.lightRequirement,
  }));

  const prodEntries: CatalogEntry[] = products.map((p) => ({
    kind: 'product',
    id: p.id,
    name: p.name,
    subtitle: p.brand,
    category: p.category,
    difficulty: p.rating ? `★ ${p.rating}` : null,
    info: p.priceRange ? humanize(p.priceRange) : '',
    imageUrl: p.imageUrl,
    tags: p.tags,
    priceRange: p.priceRange,
  }));

  return [...animEntries, ...plantEntries, ...prodEntries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

function useUrlSyncedState(initial: InitialParams) {
  const [state, setState] = useState<InitialParams>(initial);

  useEffect(() => {
    const url = new URL(window.location.href);
    Object.entries(state).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    window.history.replaceState({}, '', url.toString());
  }, [state]);

  return [state, setState] as const;
}

export function CatalogTable({
  animals,
  plants,
  products,
  initialParams,
}: {
  animals: { id: string; name: string; scientificName: string | null; category: string; difficulty: string; description: string | null; imageUrl: string | null; minTankSize: number | null; tempMin: number | null; tempMax: number | null; habitats: Habitat[]; biome: Biome; tags: string[] }[];
  plants: { id: string; name: string; scientificName: string | null; category: string; difficulty: string; lightRequirement: LightLevel; description: string | null; imageUrl: string | null; biome: Biome; tags: string[] }[];
  products: { id: string; name: string; brand: string | null; category: string; priceRange: PriceRange | null; rating: number | null; description: string | null; imageUrl: string | null; tags: string[] }[];
  initialParams: InitialParams;
}) {
  const allEntries = useMemo(() => buildEntries(animals, plants, products), [animals, plants, products]);
  const [params, setParams] = useUrlSyncedState(initialParams);

  const typeFilter: TypeFilter =
    params.type === 'animal' || params.type === 'plant' || params.type === 'product'
      ? params.type
      : 'all';

  const setTypeFilter = (value: TypeFilter) => {
    setParams({
      ...params,
      type: value === 'all' ? '' : value,
      category: '',
      difficulty: '',
      habitat: '',
      biome: '',
      light: '',
      priceRange: '',
    });
  };

  const update = (key: keyof InitialParams, value: string) => {
    setParams({ ...params, [key]: value });
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    allEntries.forEach((e) => {
      if (typeFilter === 'all' || e.kind === typeFilter) set.add(e.category);
    });
    return Array.from(set).sort();
  }, [allEntries, typeFilter]);

  const filtered = useMemo(() => {
    const q = params.search.trim().toLowerCase();
    return allEntries.filter((e) => {
      if (typeFilter !== 'all' && e.kind !== typeFilter) return false;
      if (params.category && e.category !== params.category) return false;
      if (q) {
        const matches =
          e.name.toLowerCase().includes(q) ||
          e.subtitle?.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (params.difficulty) {
        if (e.kind === 'animal' || e.kind === 'plant') {
          if (e.difficulty !== params.difficulty) return false;
        }
      }
      if (params.habitat && e.kind === 'animal') {
        if (!e.habitats?.includes(params.habitat as Habitat)) return false;
      }
      if (params.biome) {
        if (e.biome !== params.biome) return false;
      }
      if (params.light && e.kind === 'plant') {
        if (e.lightRequirement !== params.light) return false;
      }
      if (params.priceRange && e.kind === 'product') {
        if (e.priceRange !== params.priceRange) return false;
      }
      return true;
    });
  }, [allEntries, typeFilter, params]);

  const typePills: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: `All (${allEntries.length})` },
    { value: 'animal', label: `Animals (${allEntries.filter((e) => e.kind === 'animal').length})` },
    { value: 'plant', label: `Plants (${allEntries.filter((e) => e.kind === 'plant').length})` },
    { value: 'product', label: `Products (${allEntries.filter((e) => e.kind === 'product').length})` },
  ];

  const showAnimalFilters = typeFilter === 'animal';
  const showPlantFilters = typeFilter === 'plant';
  const showProductFilters = typeFilter === 'product';

  return (
    <>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {typePills.map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => setTypeFilter(pill.value)}
              className="btn"
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.85rem',
                background:
                  typeFilter === pill.value
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
                    : 'var(--color-bg-subtle)',
                color: typeFilter === pill.value ? 'white' : 'var(--color-text)',
                boxShadow: 'none',
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="catalog-search" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Search
            </label>
            <input
              id="catalog-search"
              type="search"
              value={params.search}
              onChange={(e) => update('search', e.target.value)}
              placeholder="Name, scientific name, brand, or tag..."
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label htmlFor="catalog-category" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Category
            </label>
            <select
              id="catalog-category"
              value={params.category}
              onChange={(e) => update('category', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {humanize(c)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showAnimalFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Difficulty</label>
              <select value={params.difficulty} onChange={(e) => update('difficulty', e.target.value)} style={{ width: '100%' }}>
                <option value="">All difficulties</option>
                {Object.values(Difficulty).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Habitat</label>
              <select value={params.habitat} onChange={(e) => update('habitat', e.target.value)} style={{ width: '100%' }}>
                <option value="">All habitats</option>
                {Object.values(Habitat).map((h) => (
                  <option key={h} value={h}>{humanize(h)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Biome</label>
              <select value={params.biome} onChange={(e) => update('biome', e.target.value)} style={{ width: '100%' }}>
                <option value="">All biomes</option>
                {Object.values(Biome).map((b) => (
                  <option key={b} value={b}>{humanize(b)}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {showPlantFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Difficulty</label>
              <select value={params.difficulty} onChange={(e) => update('difficulty', e.target.value)} style={{ width: '100%' }}>
                <option value="">All difficulties</option>
                {Object.values(Difficulty).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Light</label>
              <select value={params.light} onChange={(e) => update('light', e.target.value)} style={{ width: '100%' }}>
                <option value="">All light levels</option>
                {Object.values(LightLevel).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Biome</label>
              <select value={params.biome} onChange={(e) => update('biome', e.target.value)} style={{ width: '100%' }}>
                <option value="">All biomes</option>
                {Object.values(Biome).map((b) => (
                  <option key={b} value={b}>{humanize(b)}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {showProductFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Price Range</label>
              <select value={params.priceRange} onChange={(e) => update('priceRange', e.target.value)} style={{ width: '100%' }}>
                <option value="">All prices</option>
                {Object.values(PriceRange).map((p) => (
                  <option key={p} value={p}>{humanize(p)}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
        {filtered.length} of {allEntries.length} item{filtered.length === 1 ? '' : 's'} shown
      </p>

      {filtered.length === 0 ? (
        <div className="card">
          <h3>No matches found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Type</th>
                <th>Name</th>
                <th style={{ width: '140px' }}>Category</th>
                <th style={{ width: '110px' }}>Rating/Diff.</th>
                <th style={{ width: '150px' }}>Key Info</th>
                <th style={{ width: '180px' }}>Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const colors = TYPE_COLORS[entry.kind];
                return (
                  <tr key={`${entry.kind}-${entry.id}`}>
                    <td>
                      <span className="badge" style={{ background: colors.bg, color: colors.color, margin: 0 }}>
                        {colors.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {entry.imageUrl ? (
                          <ProductImage src={entry.imageUrl} alt={entry.name} variant="thumb" />
                        ) : (
                          <span
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              background: colors.bg,
                              color: colors.color,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d={CATEGORY_ICONS[entry.kind]} />
                            </svg>
                          </span>
                        )}
                        <span>
                          <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{entry.name}</span>
                          {entry.subtitle && (
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                              {entry.subtitle}
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>{humanize(entry.category)}</td>
                    <td style={{ fontSize: '0.9rem' }}>{entry.difficulty ?? '—'}</td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{entry.info || '—'}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {entry.tags.slice(0, 3).join(', ')}
                      {entry.tags.length > 3 ? ` +${entry.tags.length - 3}` : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
