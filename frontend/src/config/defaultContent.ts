import type { SiteContent } from '@/types/content'
import { defaultLegalContent } from '@/config/defaultLegal'

/** Contenu par défaut — aligné sur backend/src/services/defaults.ts */
export function defaultSiteContent(): SiteContent {
  return {
    seo: {
      title: "D.O.G. Dépann' Ordi Game | Tech haute performance",
      description:
        'Conception de setups gaming extrêmes, watercooling sur mesure et réparation matérielle de précision. Expertise D.O.G. pour PC haute performance.',
      keywords: 'dépannage PC, gaming, watercooling, réparation GPU, setup gaming, overclocking',
    },
    business: {
      name: "D.O.G. Dépann' Ordi Game",
      phone: '06 00 00 00 00',
      email: 'contact@dog-informatique.fr',
      address: '12 rue de la République',
      city: 'Lyon',
      hours: 'Lun–Ven 9h–18h, Sam 9h–12h',
    },
    sections: {
      hero: {
        badge: 'SYSTÈME PRÊT // HAUTE PERFORMANCE',
        title: "L'ART DE LA",
        titleAccent: 'PUISSANCE PC',
        subtitle:
          "Conception de setups gaming extrêmes, watercooling sur mesure et réparation matérielle de précision. Donnez à votre machine le soin qu'elle mérite avec l'expertise D.O.G.",
        ctaLabel: 'NOS PRESTATIONS',
        secondaryCtaLabel: 'VOIR LES RÉALISATIONS',
        image: '/uploads/hero.jpg',
        imageTag: '[MONTAGE-ALPHA-01]',
      },
      services: [
        {
          title: 'Réparation GPU',
          description:
            'Réparation de circuits imprimés et changement de VRAM pour cartes graphiques haut de gamme.',
          icon: 'memory',
        },
        {
          title: 'Refroidissement liquide',
          description:
            'Conception de circuits rigides ou souples pour une esthétique et un refroidissement premium.',
          icon: 'water_drop',
        },
        {
          title: 'Overclocking',
          description: 'Poussez votre CPU/RAM dans leurs derniers retranchements en toute sécurité.',
          icon: 'speed',
        },
        {
          title: 'Station gaming',
          description: 'Installation complète de votre station de jeu, du montage PC au bureau RGB.',
          icon: 'videogame_asset',
        },
      ],
      about: {
        title: 'Expertise technique & gaming',
        body: "Chez D.O.G. Dépann' Ordi Game, nous ne nous contentons pas de réparer des ordinateurs. Nous forgeons des stations de combat optimisées pour la compétition. Notre expertise couvre le diagnostic matériel avancé, la micro-soudure sur composants GPU, et le paramétrage BIOS/Windows pour une latence minimale.\n\nQue vous soyez un streameur en quête de stabilité ou un joueur e-sport cherchant le dernier FPS, nos solutions d'optimisation logicielle et matérielle garantissent un système toujours opérationnel. Nous maîtrisons l'installation de boucles de refroidissement liquide sur mesure pour une gestion thermique silencieuse et performante.",
        image: '',
      },
      contact: {
        intro:
          'Inscrivez-vous pour recevoir nos alertes « nouveautés matériel » et des conseils d\'entretien exclusifs.',
        newsletterTitle: "Besoin d'un coup de boost performance ?",
      },
      portfolio: [
        {
          title: 'Setup RGB complet',
          description:
            "Optimisation complète de l'écosystème lumineux et câblage discret pour un rendu studio.",
          image: '/uploads/portfolio-01.jpg',
          tag: '[RGB-MASTER]',
          badge: 'HAUT DE GAMME',
          badgeStyle: 'premium',
          buttonLabel: 'Détails du montage',
        },
        {
          title: 'Réparation GPU',
          description:
            "Sauvetage d'une RTX 3080 Ti après un court-circuit. Micro-soudure et repad thermique intégral.",
          image: '/uploads/portfolio-02.jpg',
          tag: '[GPU-FIX-09]',
          badge: 'RÉPARÉ',
          badgeStyle: 'fixed',
          buttonLabel: 'Rapport technique',
        },
        {
          title: 'Optimisation streameur',
          description:
            'Configuration double PC, optimisation OBS et réglages audio pour une qualité 4K sans perte.',
          image: '/uploads/portfolio-03.jpg',
          tag: '[STREAM-OPT]',
          badge: 'PRO',
          badgeStyle: 'pro',
          buttonLabel: 'Voir le montage',
        },
      ],
      social: {
        title: 'SUIVEZ LE DOG',
        subtitle:
          'Tutos, déballages matériel et timelapse de montages extrêmes. Rejoignez la meute sur nos réseaux.',
        youtubeUrl: 'https://youtube.com',
        tiktokUrl: 'https://tiktok.com',
        youtubeImage: '/uploads/social-youtube.jpg',
        tiktokImage: '/uploads/social-tiktok.jpg',
      },
    },
    legal: defaultLegalContent(),
  }
}
