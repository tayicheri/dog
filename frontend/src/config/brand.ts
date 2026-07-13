/** Design Stitch — projet dog (D.O.G. Dépann' Ordi Game) */
export const brand = {
  name: "D.O.G.",
  fullName: "D.O.G. Dépann' Ordi Game",
  tagline: 'High-Performance Tech',
} as const

export const navLinks = [
  { href: '#expertise', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#expertise', label: 'Prestations' },
  { href: '#social', label: 'Social' },
] as const

export const heroDefaultImage = '/uploads/hero.jpg'

/** @deprecated use heroDefaultImage */
export const heroBackgroundImage = heroDefaultImage
