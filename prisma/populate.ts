import { PrismaClient, AnimalCategory, Habitat, Biome, Difficulty, Temperament, DietType, PlantCategory, LightLevel, GrowthRate, PlantPlacement, ProductCategory, PriceRange, CompatibilityLevel } from '@prisma/client';

const prisma = new PrismaClient();

const img = (type: 'animal' | 'plant' | 'product', name: string) => {
  const colors = { animal: '#1a5490', plant: '#2d5a27', product: '#666666' };
  const bg = colors[type];
  const safeName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="bold">${safeName}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

async function main() {
  console.log('Populating Aquascape databases with additional entries...');

  const newAnimals = [
    { name: 'Blue Tang', scientificName: 'Paracanthurus hepatus', category: AnimalCategory.FISH, habitats: [Habitat.SALTWATER], biome: Biome.REEF, difficulty: Difficulty.INTERMEDIATE, temperament: Temperament.SEMI_AGGRESSIVE, dietType: DietType.HERBIVORE, minTankSize: 75, tempMin: 75, tempMax: 82, phMin: 8.1, phMax: 8.4, maxSize: 12, lifespan: '8-12 years', origin: 'Indo-Pacific', imageUrl: img('animal', 'Blue Tang'), description: 'Iconic blue surgeonfish that needs plenty of swimming room and algae to graze.', careGuide: 'Stable marine parameters, large tank, plenty of live rock for grazing.', feedingGuide: 'Marine algae sheets, spirulina pellets, occasional mysis.', socialNeeds: 'Semi-aggressive; keep one per tank unless very large.', breedingInfo: 'Not bred in captivity.', commonDiseases: 'Marine ich, HLLE from poor nutrition.', waterChangeNeeds: '10-20% biweekly', stockingRecommendations: 'Single tang in 75+ gallons.', specialConsiderations: 'Requires excellent filtration and swimming space.', tags: ['saltwater', 'surgeonfish', 'herbivore'] },
    { name: 'Royal Gramma', scientificName: 'Gramma loreto', category: AnimalCategory.FISH, habitats: [Habitat.SALTWATER], biome: Biome.REEF, difficulty: Difficulty.BEGINNER, temperament: Temperament.PEACEFUL, dietType: DietType.CARNIVORE, minTankSize: 30, tempMin: 72, tempMax: 78, phMin: 8.1, phMax: 8.4, maxSize: 3, lifespan: '5-6 years', origin: 'Caribbean', imageUrl: img('animal', 'Royal Gramma'), description: 'Colorful purple-and-yellow reef fish that stays small and peaceful.', careGuide: 'Provide rock caves and stable reef parameters.', feedingGuide: 'Frozen mysis, brine shrimp, small marine pellets.', socialNeeds: 'Peaceful but territorial about its cave.', breedingInfo: 'Mouthbrooder; spawned in captivity.', commonDiseases: 'Marine ich.', waterChangeNeeds: '10-20% biweekly', stockingRecommendations: 'One per 30 gallons.', specialConsiderations: 'May chase similar-looking fish.', tags: ['saltwater', 'reef-safe', 'colorful'] },
    { name: 'Firefish Goby', scientificName: 'Nemateleotris magnifica', category: AnimalCategory.FISH, habitats: [Habitat.SALTWATER], biome: Biome.REEF, difficulty: Difficulty.BEGINNER, temperament: Temperament.PEACEFUL, dietType: DietType.CARNIVORE, minTankSize: 20, tempMin: 72, tempMax: 78, phMin: 8.1, phMax: 8.4, maxSize: 3, lifespan: '3-5 years', origin: 'Indo-Pacific', imageUrl: img('animal', 'Firefish Goby'), description: 'Peaceful dartfish with a brilliant red tail that hovers near the rockwork.', careGuide: 'Provide a secure lid and plenty of hiding places.', feedingGuide: 'Frozen mysis, brine shrimp, small pellets.', socialNeeds: 'Peaceful. Often kept singly or in mated pairs.', breedingInfo: 'Difficult in captivity.', commonDiseases: 'Marine ich.', waterChangeNeeds: '10-20% biweekly', stockingRecommendations: 'One or a pair in 20+ gallons.', specialConsiderations: 'Jumps when startled — tight-fitting lid essential.', tags: ['saltwater', 'reef-safe', 'colorful'] },
    { name: 'Lawnmower Blenny', scientificName: 'Salarias fasciatus', category: AnimalCategory.FISH, habitats: [Habitat.SALTWATER], biome: Biome.REEF, difficulty: Difficulty.BEGINNER, temperament: Temperament.PEACEFUL, dietType: DietType.HERBIVORE, minTankSize: 30, tempMin: 72, tempMax: 78, phMin: 8.1, phMax: 8.4, maxSize: 5, lifespan: '2-4 years', origin: 'Indo-Pacific', imageUrl: img('animal', 'Lawnmower Blenny'), description: 'Algae-grazing blenny with tons of personality and googly eyes.', careGuide: 'Mature tank with plenty of algae-covered live rock.', feedingGuide: 'Algae sheets, spirulina, vegetable-based foods once algae runs low.', socialNeeds: 'Peaceful; one per tank.', breedingInfo: 'Not bred in captivity.', commonDiseases: 'Starvation in algae-poor tanks.', waterChangeNeeds: '10-20% biweekly', stockingRecommendations: 'One per 30+ gallons.', specialConsiderations: 'Needs a mature tank with natural algae.', tags: ['saltwater', 'algae-eater', 'reef-safe'] },
    { name: 'Longfin Bannerfish', scientificName: 'Heniochus acuminatus', category: AnimalCategory.FISH, habitats: [Habitat.SALTWATER], biome: Biome.REEF, difficulty: Difficulty.INTERMEDIATE, temperament: Temperament.PEACEFUL, dietType: DietType.OMNIVORE, minTankSize: 75, tempMin: 72, tempMax: 78, phMin: 8.1, phMax: 8.4, maxSize: 9, lifespan: '5-7 years', origin: 'Indo-Pacific', imageUrl: img('animal', 'Longfin Bannerfish'), description: 'Striking black-and-white fish with elongated dorsal fin.', careGuide: 'Large tank with open swimming and reef-safe decor.', feedingGuide: 'Frozen mysis, brine shrimp, marine flakes, nori.', socialNeeds: 'Peaceful; best kept singly or in pairs in large tanks.', breedingInfo: 'Not bred in captivity.', commonDiseases: 'Marine ich and refusal to feed in new tanks.', waterChangeNeeds: '10-20% biweekly', stockingRecommendations: 'Single in 75+ gallons.', specialConsiderations: 'Needs a varied diet and stable conditions.', tags: ['saltwater', 'centerpiece', 'reef-safe'] },
    { name: 'Hammer Coral', scientificName: 'Euphyllia ancora', category: AnimalCategory.CORAL, habitats: [Habitat.SALTWATER], biome: Biome.REEF, difficulty: Difficulty.INTERMEDIATE, temperament: Temperament.PEACEFUL, dietType: DietType.OMNIVORE, minTankSize: 30, tempMin: 75, tempMax: 80, phMin: 8.1, phMax: 8.4, maxSize: 6, lifespan: 'Indefinite', origin: 'Indo-Pacific', imageUrl: img('animal', 'Hammer Coral'), description: 'Large-polyp stony coral with branching hammer-shaped tentacles.', careGuide: 'Moderate light and flow. Leave space for sweeper tentacles.', feedingGuide: 'Photosynthetic, benefits from target feeding mysis and reef roids.', socialNeeds: 'Aggressive toward nearby corals with sweeper tentacles.', breedingInfo: 'Propagated by fragging branches.', commonDiseases: 'Tissue recession from poor flow or参数 swings.', waterChangeNeeds: '10-20% biweekly', stockingRecommendations: 'Place in lower to middle light with room around it.', specialConsiderations: 'Sweeper tentacles can sting neighbors 6+ inches away.', tags: ['coral', 'lps', 'advanced'] },
    { name: 'Zoanthids', scientificName: 'Zoanthus spp.', category: AnimalCategory.CORAL, habitats: [Habitat.SALTWATER], biome: Biome.REEF, difficulty: Difficulty.BEGINNER, temperament: Temperament.PEACEFUL, dietType: DietType.OMNIVORE, minTankSize: 10, tempMin: 75, tempMax: 80, phMin: 8.1, phMax: 8.4, maxSize: 4, lifespan: 'Indefinite', origin: 'Indo-Pacific', imageUrl: img('animal', 'Zoanthids'), description: 'Colorful colonial soft corals available in endless patterns.', careGuide: 'Low to moderate light and flow. Can spread quickly across rocks.', feedingGuide: 'Photosynthetic, occasional reef roids or phytoplankton.', socialNeeds: 'Peaceful but can overgrow nearby corals.', breedingInfo: 'Spreads by budding and can be fragged.', commonDiseases: 'Zoa pox, bacterial infections if stressed.', waterChangeNeeds: '10-20% biweekly', stockingRecommendations: 'Easy beginner coral in any reef tank.', specialConsiderations: 'Some varieties contain palytoxin — handle carefully.', tags: ['coral', 'soft-coral', 'beginner'] },
    { name: 'Mushroom Coral', scientificName: 'Rhodactis / Discosoma spp.', category: AnimalCategory.CORAL, habitats: [Habitat.SALTWATER], biome: Biome.REEF, difficulty: Difficulty.BEGINNER, temperament: Temperament.PEACEFUL, dietType: DietType.OMNIVORE, minTankSize: 10, tempMin: 75, tempMax: 80, phMin: 8.1, phMax: 8.4, maxSize: 3, lifespan: 'Indefinite', origin: 'Indo-Pacific', imageUrl: img('animal', 'Mushroom Coral'), description: 'Low-light tolerant soft coral with round fleshy polyps.', careGuide: 'Very forgiving coral for new reef keepers.', feedingGuide: 'Photosynthetic, occasional fine particulate foods.', socialNeeds: 'Peaceful but can detach and move.', breedingInfo: 'Spreads by splitting.', commonDiseases: 'Few issues.', waterChangeNeeds: '10-20% biweekly', stockingRecommendations: 'Great starter coral for low-flow areas.', specialConsiderations: 'Some mushrooms grow very large and shade neighbors.', tags: ['coral', 'soft-coral', 'beginner'] },
    { name: 'Duncan Coral', scientificName: 'Duncanopsammia axifuga', category: AnimalCategory.CORAL, habitats: [Habitat.SALTWATER], biome: Biome.REEF, difficulty: Difficulty.INTERMEDIATE, temperament: Temperament.PEACEFUL, dietType: DietType.CARNIVORE, minTankSize: 20, tempMin: 75, tempMax: 80, phMin: 8.1, phMax: 8.4, maxSize: 4, lifespan: 'Indefinite', origin: 'Indo-Pacific', imageUrl: img('animal', 'Duncan Coral'), description: 'Large-polyp stony coral with long flowing tentacles that sway in current.', careGuide: 'Moderate light and low to moderate flow.', feedingGuide: 'Target feed mysis, brine shrimp, or coral pellets 2-3 times weekly.', socialNeeds: 'Peaceful; tentacles generally do not sting far.', breedingInfo: 'Fragged by cutting heads from base.', commonDiseases: 'Tissue recession from too much flow or poor nutrition.', waterChangeNeeds: '10-20% biweekly', stockingRecommendations: 'Middle to lower light placement.', specialConsiderations: 'Grows faster with regular feeding.', tags: ['coral', 'lps', 'colorful'] },
    { name: 'Altum Angelfish', scientificName: 'Pterophyllum altum', category: AnimalCategory.FISH, habitats: [Habitat.FRESHWATER], biome: Biome.RIVER, difficulty: Difficulty.EXPERT, temperament: Temperament.PEACEFUL, dietType: DietType.CARNIVORE, minTankSize: 55, tempMin: 78, tempMax: 84, phMin: 5.5, phMax: 6.5, maxSize: 7, lifespan: '10-15 years', origin: 'South America', imageUrl: img('animal', 'Altum Angelfish'), description: 'Taller and more delicate than common angelfish; a showpiece for expert keepers.', careGuide: 'Very soft, acidic, warm water. Tall tank with excellent filtration.', feedingGuide: 'Frozen bloodworms, brine shrimp, high-quality carnivore pellets.', socialNeeds: 'Peaceful but may eat very small fish. Form pairs.', breedingInfo: 'Pairs lay eggs on vertical surfaces.', commonDiseases: 'Sensitive to transport and parameter swings.', waterChangeNeeds: '30-50% weekly', stockingRecommendations: 'Pair or small group in 55+ tall tanks.', specialConsiderations: 'Difficult to acclimate; wild-caught common.', tags: ['centerpiece', 'expert', 'sensitive'] },
    { name: 'Electric Blue Ram', scientificName: 'Mikrogeophagus ramirezi', category: AnimalCategory.FISH, habitats: [Habitat.FRESHWATER], biome: Biome.RIVER, difficulty: Difficulty.ADVANCED, temperament: Temperament.PEACEFUL, dietType: DietType.OMNIVORE, minTankSize: 20, tempMin: 78, tempMax: 85, phMin: 5.5, phMax: 7, maxSize: 2.5, lifespan: '2-3 years', origin: 'South America', imageUrl: img('animal', 'Electric Blue Ram'), description: 'Bright blue selectively bred variant of the German blue ram.', careGuide: 'Warm soft acidic water, stable parameters, planted tank with caves.', feedingGuide: 'Small frozen foods, pellets, live foods.', socialNeeds: 'Forms pairs. Peaceful community fish.', breedingInfo: 'Cave spawner; both parents care for eggs.', commonDiseases: 'Sensitive to poor water and parasites.', waterChangeNeeds: '20-25% weekly', stockingRecommendations: 'Pair in 20+ gallons.', specialConsiderations: 'Inbred strains can be delicate; buy from quality sources.', tags: ['colorful', 'dwarf-cichlid', 'pair'] },
  ];

  const newPlants = [
    { name: 'Staurogyne Repens', scientificName: 'Staurogyne repens', category: PlantCategory.AQUATIC, habitats: [Habitat.FRESHWATER], biome: Biome.STREAM, difficulty: Difficulty.INTERMEDIATE, lightRequirement: LightLevel.MEDIUM, growthRate: GrowthRate.SLOW, maxHeight: 4, placement: PlantPlacement.FOREGROUND, co2Required: false, tempMin: 68, tempMax: 82, phMin: 6, phMax: 7.5, imageUrl: img('plant', 'Staurogyne Repens'), description: 'Compact stem plant that forms a low bushy foreground carpet.', careGuide: 'Plant stems vertically and trim tops to encourage lateral growth.', propagation: 'Stem cuttings.', trimmingNeeds: 'Trim tops to maintain carpet.', nutrientNeeds: 'Moderate.', substrateNeeds: 'Nutrient-rich preferred.', co2Notes: 'Optional but helpful.', tags: ['foreground', 'carpet', 'bushy'] },
    { name: 'Ludwigia Super Red', scientificName: 'Ludwigia palustris', category: PlantCategory.AQUATIC, habitats: [Habitat.FRESHWATER], biome: Biome.RIVER, difficulty: Difficulty.INTERMEDIATE, lightRequirement: LightLevel.HIGH, growthRate: GrowthRate.FAST, maxHeight: 12, placement: PlantPlacement.BACKGROUND, co2Required: false, tempMin: 68, tempMax: 82, phMin: 6, phMax: 7.5, imageUrl: img('plant', 'Ludwigia Super Red'), description: 'Intensely red stem plant under high light and iron.', careGuide: 'Provide high light and iron for best color.', propagation: 'Cuttings.', trimmingNeeds: 'Prune tops and replant.', nutrientNeeds: 'Moderate-high. Iron essential.', substrateNeeds: 'Any.', co2Notes: 'Optional but improves color.', tags: ['stem-plant', 'colorful', 'high-light'] },
    { name: 'Alternanthera Reineckii', scientificName: 'Alternanthera reineckii', category: PlantCategory.AQUATIC, habitats: [Habitat.FRESHWATER], biome: Biome.STREAM, difficulty: Difficulty.ADVANCED, lightRequirement: LightLevel.HIGH, growthRate: GrowthRate.MODERATE, maxHeight: 12, placement: PlantPlacement.MIDGROUND, co2Required: false, tempMin: 70, tempMax: 80, phMin: 6, phMax: 7.5, imageUrl: img('plant', 'Alternanthera Reineckii'), description: 'Stunning red-leaf stem plant for highlight aquascapes.', careGuide: 'High light, iron, and CO2 recommended for vibrant red.', propagation: 'Cuttings.', trimmingNeeds: 'Trim tops; replant cuttings.', nutrientNeeds: 'High.', substrateNeeds: 'Nutrient-rich.', co2Notes: 'Recommended.', tags: ['stem-plant', 'red', 'advanced'] },
    { name: 'Utricularia Graminifolia', scientificName: 'Utricularia graminifolia', category: PlantCategory.AQUATIC, habitats: [Habitat.FRESHWATER], biome: Biome.STREAM, difficulty: Difficulty.EXPERT, lightRequirement: LightLevel.MEDIUM, growthRate: GrowthRate.SLOW, maxHeight: 2, placement: PlantPlacement.FOREGROUND, co2Required: false, tempMin: 68, tempMax: 78, phMin: 5.5, phMax: 7, imageUrl: img('plant', 'Utricularia Graminifolia'), description: 'Carnivorous grass-like carpet that traps micro-organisms.', careGuide: 'Clean water, moderate light, no algae competition.', propagation: 'Spreads as a mat.', trimmingNeeds: 'Trim to contain spread.', nutrientNeeds: 'Very low.', substrateNeeds: 'Nutrient-poor inert substrate.', co2Notes: 'Optional.', tags: ['carpet', 'carnivorous', 'expert'] },
    { name: 'Begonia', scientificName: 'Begonia spp.', category: PlantCategory.TERRESTRIAL, habitats: [Habitat.VIVARIUM, Habitat.TERRARIUM], biome: Biome.TROPICAL_RAINFOREST, difficulty: Difficulty.BEGINNER, lightRequirement: LightLevel.LOW, growthRate: GrowthRate.MODERATE, maxHeight: 8, placement: PlantPlacement.MIDGROUND, co2Required: false, tempMin: 65, tempMax: 80, phMin: 5.5, phMax: 7, imageUrl: img('plant', 'Begonia'), description: 'Colorful terrestrial plant with many compact varieties for vivariums.', careGuide: 'High humidity, moist but not soggy substrate, indirect light.', propagation: 'Leaf or stem cuttings.', trimmingNeeds: 'Remove old leaves and flowers.', nutrientNeeds: 'Low.', substrateNeeds: 'Well-draining humus mix.', co2Notes: 'Atmospheric.', tags: ['vivarium', 'colorful', 'terrestrial'] },
    { name: 'Tillandsia Ionantha', scientificName: 'Tillandsia ionantha', category: PlantCategory.EPIPHYTE, habitats: [Habitat.VIVARIUM, Habitat.TERRARIUM], biome: Biome.TROPICAL_RAINFOREST, difficulty: Difficulty.BEGINNER, lightRequirement: LightLevel.MEDIUM, growthRate: GrowthRate.SLOW, maxHeight: 3, placement: PlantPlacement.ATTACHED, co2Required: false, tempMin: 60, tempMax: 85, phMin: 5.5, phMax: 7.5, imageUrl: img('plant', 'Tillandsia Ionantha'), description: 'Small air plant that absorbs moisture through leaves; turns red when blooming.', careGuide: 'Mist 2-3 times weekly or soak weekly; provide bright indirect light.', propagation: 'Pups form at base.', trimmingNeeds: 'Remove dead leaves.', nutrientNeeds: 'Low.', substrateNeeds: 'None.', co2Notes: 'Atmospheric.', tags: ['vivarium', 'air-plant', 'epiphyte'] },
  ];

  const newProducts = [
    { name: 'Tetra Whisper AP300', brand: 'Tetra', category: ProductCategory.AIR_PUMP, description: 'Powerful air pump for deep tanks and multiple sponge filters.', imageUrl: img('product', 'Tetra Whisper AP300'), priceRange: PriceRange.MID_RANGE, rating: 4.4, tags: ['air-pump', 'powerful', 'sponge-filter'] },
    { name: 'USB Nano Air Pump', brand: 'Generic', category: ProductCategory.AIR_PUMP, description: 'Tiny portable USB-powered air pump for nano tanks and travel.', imageUrl: img('product', 'USB Nano Air Pump'), priceRange: PriceRange.BUDGET, rating: 4.0, tags: ['air-pump', 'nano', 'usb'] },
    { name: 'Silicone Airline Tubing', brand: 'Generic', category: ProductCategory.HOSE_TUBING, description: 'Flexible clear silicone tubing for air pumps and small filters.', imageUrl: img('product', 'Silicone Airline Tubing'), priceRange: PriceRange.BUDGET, rating: 4.6, tags: ['hose', 'airline', 'silicone'] },
    { name: 'PVC Braided Tubing', brand: 'Generic', category: ProductCategory.HOSE_TUBING, description: 'Reinforced tubing for canister filters and water changers.', imageUrl: img('product', 'PVC Braided Tubing'), priceRange: PriceRange.MID_RANGE, rating: 4.5, tags: ['hose', 'reinforced', 'filter'] },
    { name: 'Repashy Calcium Plus', brand: 'Repashy', category: ProductCategory.SUPPLEMENT, description: 'All-in-one calcium and vitamin supplement for reptiles and amphibians.', imageUrl: img('product', 'Repashy Calcium Plus'), priceRange: PriceRange.MID_RANGE, rating: 4.7, tags: ['supplement', 'calcium', 'reptile', 'amphibian'] },
    { name: 'Zoo Med Reptivite', brand: 'Zoo Med', category: ProductCategory.SUPPLEMENT, description: 'Complete multivitamin powder for reptiles.', imageUrl: img('product', 'Zoo Med Reptivite'), priceRange: PriceRange.BUDGET, rating: 4.4, tags: ['supplement', 'multivitamin', 'reptile'] },
    { name: 'Lava Rock', brand: 'Generic', category: ProductCategory.HARDSCAPE, description: 'Porous volcanic rock that provides surface area for beneficial bacteria.', imageUrl: img('product', 'Lava Rock'), priceRange: PriceRange.BUDGET, rating: 4.5, tags: ['hardscape', 'porous', 'biological-media'] },
    { name: 'Slate Stone', brand: 'Generic', category: ProductCategory.HARDSCAPE, description: 'Flat sedimentary stone useful for caves, basking, and aquascaping.', imageUrl: img('product', 'Slate Stone'), priceRange: PriceRange.BUDGET, rating: 4.3, tags: ['hardscape', 'stone', 'caves'] },
  ];

  const compatPairs: [string, string, CompatibilityLevel, string][] = [
    ['Clownfish', 'Royal Gramma', CompatibilityLevel.COMPATIBLE, 'Both are small, reef-safe, and occupy different niches.'],
    ['Clownfish', 'Firefish Goby', CompatibilityLevel.COMPATIBLE, 'Peaceful reef fish that ignore each other.'],
    ['Royal Gramma', 'Firefish Goby', CompatibilityLevel.COMPATIBLE, 'Two small peaceful reef fish that prefer different hiding spots.'],
    ['Clownfish', 'Yellow Tang', CompatibilityLevel.CAUTION, 'Both can be semi-aggressive; monitor in smaller tanks.'],
    ['Zoanthids', 'Mushroom Coral', CompatibilityLevel.COMPATIBLE, 'Both are forgiving soft corals that tolerate similar conditions.'],
    ['Hammer Coral', 'Zoanthids', CompatibilityLevel.CAUTION, 'Keep space for hammer coral sweeper tentacles.'],
    ['Electric Blue Ram', 'Neon Tetra', CompatibilityLevel.COMPATIBLE, 'Both appreciate warm, soft water and peaceful communities.'],
    ['Peacock Cichlid', 'Neon Tetra', CompatibilityLevel.INCOMPATIBLE, 'Very different water parameters and peacocks may eat neons.'],
    ['Peacock Cichlid', 'Corydoras Catfish', CompatibilityLevel.INCOMPATIBLE, 'Corydoras need cooler, softer water than African cichlids.'],
    ['Altum Angelfish', 'Cardinal Tetra', CompatibilityLevel.CAUTION, 'Cardinals tolerate discus/altum temps but may be eaten as adults grow.'],
    ['Tiger Barb', 'Pearl Gourami', CompatibilityLevel.CAUTION, 'Tiger barbs may nip the long fins of pearl gouramis.'],
    ['Lawnmower Blenny', 'Clownfish', CompatibilityLevel.COMPATIBLE, 'Peaceful herbivore that ignores clownfish.'],
  ];

  let animalCount = 0;
  for (const data of newAnimals) {
    const existing = await prisma.animal.findFirst({ where: { name: data.name } });
    if (!existing) {
      await prisma.animal.create({ data });
      animalCount++;
    }
  }

  let plantCount = 0;
  for (const data of newPlants) {
    const existing = await prisma.plant.findFirst({ where: { name: data.name } });
    if (!existing) {
      await prisma.plant.create({ data });
      plantCount++;
    }
  }

  let productCount = 0;
  for (const data of newProducts) {
    const existing = await prisma.product.findFirst({ where: { name: data.name } });
    if (!existing) {
      await prisma.product.create({ data });
      productCount++;
    }
  }

  let compatCount = 0;
  for (const [aName, bName, level, notes] of compatPairs) {
    const animalA = await prisma.animal.findFirst({ where: { name: aName } });
    const animalB = await prisma.animal.findFirst({ where: { name: bName } });
    if (!animalA || !animalB) {
      console.warn(`Skipping compat rule: missing ${aName} or ${bName}`);
      continue;
    }
    const existing = await prisma.animalCompatibility.findFirst({
      where: {
        OR: [
          { animalAId: animalA.id, animalBId: animalB.id },
          { animalAId: animalB.id, animalBId: animalA.id },
        ],
      },
    });
    if (!existing) {
      await prisma.animalCompatibility.create({
        data: { animalAId: animalA.id, animalBId: animalB.id, level, notes },
      });
      compatCount++;
    }
  }

  console.log(`Added ${animalCount} animals, ${plantCount} plants, ${productCount} products, ${compatCount} compat rules.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
