import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminView from '@/views/AdminView.vue'
import LegalPageView from '@/views/LegalPageView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/conditions-utilisation',
    name: 'terms',
    component: LegalPageView,
    meta: {
      legalKey: 'terms',
      pageTitle: "Conditions d'utilisation",
      pageDescription:
        "Conditions générales d'utilisation du site D.O.G. Dépann' Ordi Game : services, responsabilités et droit applicable.",
    },
  },
  {
    path: '/politique-de-confidentialite',
    name: 'privacy',
    component: LegalPageView,
    meta: {
      legalKey: 'privacy',
      pageTitle: 'Politique de confidentialité',
      pageDescription:
        "Politique de confidentialité et traitement des données personnelles (RGPD) — D.O.G. Dépann' Ordi Game.",
    },
  },
  { path: '/admin', name: 'admin', component: AdminView },
]
