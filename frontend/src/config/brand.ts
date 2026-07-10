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

export const heroDefaultImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDShfwN8z5YQJQv9gHjBzkcB63QyxGAMkcuzN0hQAaNZ9Z9l43EhiE_NbbzRu2kmbHp6Y_m_ji4iY65gHRcsJjp9q1iTqvv4SRGbJPNWuz4JQwX8FYt3f5UBupE4zIPWk44Nj0vckCPqeB_KSTqJoGLbWICyB_tB-oF5vswYwJYfY--CuC0TGxDHmgHThfParbACeQnHpadVqjBUQzSaMIVHxqOUJk_USR0wzAVGkU9GsIFy13wsf8vza5Iccp-rk3XpWyky8c0leGW'

/** @deprecated use heroDefaultImage */
export const heroBackgroundImage = heroDefaultImage
