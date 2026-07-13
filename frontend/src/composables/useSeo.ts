import { computed, type DeepReadonly, type Ref } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { defineLocalBusiness, useSchemaOrg } from '@unhead/schema-org/vue'
import type { SiteContent } from '@/types/content'

const siteUrl = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173'

const defaultTitle = "D.O.G. Dépann' Ordi Game | Tech haute performance"
const defaultDescription =
  'Conception de setups gaming extrêmes, watercooling sur mesure et réparation matérielle de précision.'
const defaultKeywords =
  'dépannage PC, gaming, watercooling, réparation GPU, setup gaming, overclocking'

const ogImageUrl = `${siteUrl}/og-image.jpg`

const defaultOpeningHours = [
  {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const,
    opens: '09:00',
    closes: '18:00',
  },
  {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: 'Saturday' as const,
    opens: '09:00',
    closes: '12:00',
  },
]

type ContentRef = Ref<SiteContent | DeepReadonly<SiteContent> | undefined>

export function useSiteSeo(content: ContentRef) {
  const title = computed(() => content.value?.seo.title ?? defaultTitle)
  const description = computed(() => content.value?.seo.description ?? defaultDescription)
  const keywords = computed(() => content.value?.seo.keywords ?? defaultKeywords)

  useHead({
    htmlAttrs: { lang: 'fr' },
    link: [{ rel: 'canonical', href: siteUrl }],
    meta: [{ name: 'keywords', content: keywords }],
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogLocale: 'fr_FR',
    ogUrl: siteUrl,
    ogImage: ogImageUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImageUrl,
  })

  useSchemaOrg(
    computed(() => {
      const business = content.value?.business
      const social = content.value?.sections.social
      const sameAs = social
        ? [social.youtubeUrl, social.tiktokUrl].filter((url): url is string => Boolean(url))
        : []

      return [
        defineLocalBusiness({
          name: business?.name ?? "D.O.G. Dépann' Ordi Game",
          description: description.value,
          url: siteUrl,
          image: ogImageUrl,
          email: business?.email ?? 'contact@dog-informatique.fr',
          telephone: business?.phone ?? '',
          address: {
            '@type': 'PostalAddress',
            streetAddress: business?.address ?? '',
            addressLocality: business?.city ?? '',
            addressCountry: 'FR',
          },
          sameAs,
          openingHoursSpecification: defaultOpeningHours,
        }),
      ]
    }),
  )
}

type LegalTitleRef = Ref<string> | string
type LegalPathRef = Ref<string> | string

export function useLegalSeo(pageTitle: LegalTitleRef, pagePath: LegalPathRef) {
  const title = computed(() => {
    const label = typeof pageTitle === 'string' ? pageTitle : pageTitle.value
    return `${label} | D.O.G. Dépann' Ordi Game`
  })

  const canonical = computed(() => {
    const path = typeof pagePath === 'string' ? pagePath : pagePath.value
    return `${siteUrl}${path}`
  })

  const description =
    "Informations légales du site D.O.G. Dépann' Ordi Game — dépannage PC, montage gaming et réparation matérielle."

  useHead({
    htmlAttrs: { lang: 'fr' },
    link: [{ rel: 'canonical', href: canonical }],
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogLocale: 'fr_FR',
    ogUrl: canonical,
    ogImage: ogImageUrl,
    twitterCard: 'summary',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImageUrl,
  })
}
