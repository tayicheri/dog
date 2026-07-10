import { computed, type DeepReadonly, type Ref } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import type { SiteContent } from '@/types/content'

const siteUrl = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173'

const defaultTitle = "D.O.G. Dépann' Ordi Game | High-Performance Tech"
const defaultDescription =
  'Conception de setups gaming extrêmes, watercooling custom et réparation hardware de précision.'

type ContentRef = Ref<SiteContent | DeepReadonly<SiteContent> | null | undefined>

export function useSiteSeo(content: ContentRef) {
  const title = computed(() => content.value?.seo.title ?? defaultTitle)
  const description = computed(() => content.value?.seo.description ?? defaultDescription)

  useHead({
    htmlAttrs: { lang: 'fr' },
    link: [{ rel: 'canonical', href: siteUrl }],
    script: computed(() => {
      const business = content.value?.business
      if (!business) return []

      return [
        {
          key: 'local-business-schema',
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: business.name,
            description: description.value,
            url: siteUrl,
            email: business.email,
            telephone: business.phone,
            address: {
              '@type': 'PostalAddress',
              streetAddress: business.address,
              addressLocality: business.city,
              addressCountry: 'FR',
            },
            openingHours: business.hours,
          }),
        },
      ]
    }),
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogLocale: 'fr_FR',
    ogUrl: siteUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
  })
}
