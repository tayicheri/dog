import type { SiteContent } from '../types.js'

export function defaultSiteContent(): SiteContent {
  return {
    seo: {
      title: "D.O.G. Dépann' Ordi Game | High-Performance Tech",
      description:
        'Conception de setups gaming extrêmes, watercooling custom et réparation hardware de précision. Expertise D.O.G. pour PC haute performance.',
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
        badge: 'SYSTEM READY // HIGH PERFORMANCE',
        title: "L'ART DE LA",
        titleAccent: 'PUISSANCE PC',
        subtitle:
          "Conception de setups gaming extrêmes, watercooling custom et réparation hardware de précision. Donnez à votre machine le soin qu'elle mérite avec l'expertise D.O.G.",
        ctaLabel: 'NOS PRESTATIONS',
        secondaryCtaLabel: 'VOIR LE PORTFOLIO',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDShfwN8z5YQJQv9gHjBzkcB63QyxGAMkcuzN0hQAaNZ9Z9l43EhiE_NbbzRu2kmbHp6Y_m_ji4iY65gHRcsJjp9q1iTqvv4SRGbJPNWuz4JQwX8FYt3f5UBupE4zIPWk44Nj0vckCPqeB_KSTqJoGLbWICyB_tB-oF5vswYwJYfY--CuC0TGxDHmgHThfParbACeQnHpadVqjBUQzSaMIVHxqOUJk_USR0wzAVGkU9GsIFy13wsf8vza5Iccp-rk3XpWyky8c0leGW',
        imageTag: '[BUILD-ALPHA-01]',
      },
      services: [
        {
          title: 'Repairs GPU',
          description:
            'Réparation de circuits imprimés et changement de VRAM pour cartes graphiques haut de gamme.',
          icon: 'memory',
        },
        {
          title: 'Watercooling',
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
          title: 'Setup Gaming',
          description: 'Installation complète de votre station de jeu, du montage PC au bureau RGB.',
          icon: 'videogame_asset',
        },
      ],
      about: {
        title: 'Expertise Tech & Gaming',
        body: "Chez D.O.G. Dépann' Ordi Game, nous ne nous contentons pas de réparer des ordinateurs. Nous forgeons des stations de combat optimisées pour la compétition. Notre expertise couvre le diagnostic hardware avancé, la micro-soudure sur composants GPU, et le paramétrage BIOS/Windows pour une latence minimale.\n\nQue vous soyez un Streamer en quête de stabilité ou un joueur e-sport cherchant le dernier FPS, nos solutions d'optimisation logicielle et matérielle garantissent un système \"Always-On\". Nous maîtrisons l'installation de boucles de Watercooling Custom pour une gestion thermique silencieuse et performante.",
        image: '',
      },
      contact: {
        intro:
          'Inscrivez-vous pour recevoir nos alertes "Hardware Drop" et des conseils d\'entretien exclusifs.',
        newsletterTitle: "Besoin d'un Boost de Performance ?",
      },
      portfolio: [
        {
          title: 'Setup Full RGB',
          description:
            "Optimisation complète de l'écosystème lumineux et câblage discret pour un rendu studio.",
          image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBh9cPElnTmvty1ykclCwt7xunm02X8Cq-2iJ6RYPWOisgLRk3D9nozPMhyd5_krWJ4wIznM3rH7159VB5EjlKVDrJ1K7RToW7kbWUUcoNeplb9vGUIvthLgK-sIiSf6WtOFUtXzagJeqmIDKEhO8clV0kRWSXE_EOEepvOydvz5fm1ImffXqhqg49n94EF1Y7GqBtSp6PLGKcSkuvpQTVOC8ry4z39sLV0Wo204Xe0CRsfb5CoIeXUBR4SAuFHS2Us55MuGwbnIQO5',
          tag: '[RGB-MASTER]',
          badge: 'PREMIUM',
          badgeStyle: 'premium',
          buttonLabel: 'Détails du build',
        },
        {
          title: 'Réparation GPU',
          description:
            "Sauvetage d'une RTX 3080 Ti après un court-circuit. Micro-soudure et repad thermique intégral.",
          image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCvGZMbpzP-dGP0DgVlVHtOvBEdK5jBuIxk3obNY22rf1Wfzt51ycRji1IC8n4rP4jeULpFnNohLt02NPSBfuSGPvOpvE7PHHBnHrlCF8snwdnU5ippR5I67cwHsXkxSjGTBh0m35AFIyEryQQtjck36QSu2Rcn-svernxKZsPjovCjrWyoxGGaWfvgbZaaIA8A4XzZ6TOsKTRC1lXAn2RAF4ZH7UeSmA16XLIn6PVRZvoKU8HQS68rRc8FlYV9sQ-TN6040heYNxYS',
          tag: '[GPU-FIX-09]',
          badge: 'FIXED',
          badgeStyle: 'fixed',
          buttonLabel: 'Rapport technique',
        },
        {
          title: 'Optimisation Streamer',
          description:
            'Configuration dual-PC, optimisation OBS et réglages audio pour une qualité 4K sans perte.',
          image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBj_8j05TEU9S4ZWFthrVPeH7Xlh1RR4K1ZdaYmu9r9dmERW_7RwIiXOvnR3E1lU71VNXBwv3SaedXTjhrtByat3YudJUDSwy6IRELRff7r4RL94U0k8PYVTJylvULvMmW64tNFP7pv-aHX8yEMfsOYhcjTz0rm_4xG58N9RgpIIrIKBgLuvk7ux3-DhQtvB0BSnx5rArUO5jNECKqX_hbv_McAw2oGK1rxYqeJ3sN2rrC4CnbZjkYCwgXVZI2R7sUCnLieCllKYrvx',
          tag: '[STREAM-OPT]',
          badge: 'PRO-GEAR',
          badgeStyle: 'pro',
          buttonLabel: 'Voir le setup',
        },
      ],
      social: {
        title: 'SUIVEZ LE DOG',
        subtitle:
          'Tutos, déballages hardware et timelapse de montages extrêmes. Rejoignez la meute sur nos réseaux.',
        youtubeUrl: 'https://youtube.com',
        tiktokUrl: 'https://tiktok.com',
      },
    },
  }
}
