export interface SiteSeo {
  title: string
  description: string
  keywords: string
}

export interface SiteBusiness {
  name: string
  phone: string
  email: string
  address: string
  city: string
  hours: string
}

export interface HeroSection {
  badge: string
  title: string
  titleAccent: string
  subtitle: string
  ctaLabel: string
  secondaryCtaLabel: string
  image: string
  imageTag: string
}

export interface ServiceItem {
  title: string
  description: string
  icon: string
}

export interface AboutSection {
  title: string
  body: string
  image: string
}

export interface ContactSection {
  intro: string
  newsletterTitle: string
}

export interface PortfolioItem {
  title: string
  description: string
  image: string
  tag: string
  badge: string
  badgeStyle: 'premium' | 'fixed' | 'pro'
  buttonLabel: string
}

export interface SocialSection {
  title: string
  subtitle: string
  youtubeUrl: string
  tiktokUrl: string
}

export interface SiteSections {
  hero: HeroSection
  services: ServiceItem[]
  about: AboutSection
  contact: ContactSection
  portfolio: PortfolioItem[]
  social: SocialSection
}

export interface SiteContent {
  seo: SiteSeo
  business: SiteBusiness
  sections: SiteSections
}

export interface AuthData {
  username: string
  passwordHash: string
}

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  message: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface JwtPayload {
  sub: string
  role: 'admin'
}
