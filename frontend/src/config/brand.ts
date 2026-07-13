/** Design Stitch — projet dog (D.O.G. Dépann' Ordi Game) */
export const brand = {
  name: "D.O.G.",
  fullName: "D.O.G. Dépann' Ordi Game",
  tagline: 'Tech haute performance',
} as const

export const navLinks = [
  { href: '#expertise', label: 'Expertise' },
  { href: '#portfolio', label: 'Réalisations' },
  { href: '#expertise', label: 'Prestations' },
  { href: '#social', label: 'Réseaux' },
] as const

export const heroDefaultImage = '/uploads/hero.jpg'

/** @deprecated use heroDefaultImage */
export const heroBackgroundImage = heroDefaultImage
