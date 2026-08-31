export type PageHeroMedia = {
  image: string;
  alt: string;
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`;

/**
 * Background imagery for the inner page heroes, keyed by route.
 *
 * Deliberately architectural or landscape only: none of these are AKD
 * properties, so nothing here should read as a portfolio photograph or show
 * staff the Company does not have. Swap for the client's own photography when
 * it is supplied.
 */
export const pageHeroes: Record<string, PageHeroMedia> = {
  "/about": {
    image: u("photo-1653163517210-2e3b56190680"),
    alt: "Mountain range under a clouded sky in northern Pakistan",
  },
  "/governance": {
    image: u("photo-1600531529272-023c4b821f14"),
    alt: "Facade of a modern concrete office building against a clear sky",
  },
  "/investors": {
    image: u("photo-1497366754035-f200968a6e72"),
    alt: "Corridor of glass-panelled doors in an office building",
  },
  "/media": {
    image: u("photo-1531972111231-7482a960e109"),
    alt: "Interior of a glass-walled building looking upward",
  },
  "/contact": {
    image: u("photo-1759323050124-eb669cec0b72"),
    alt: "Aerial view of the Karachi coastline",
  },
  "/esg": {
    image: u("photo-1441974231531-c6227db76b6e"),
    alt: "Sunlight through the canopy of a dense forest",
  },
};

/** Used by the legal and utility pages. */
export const defaultPageHero: PageHeroMedia = {
  image: u("photo-1614595737476-42487331b8a1"),
  alt: "Detail of a plain concrete building facade",
};
