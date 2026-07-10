# Design — dog (Stitch)

Source Google Stitch : projet **dog** (`projects/14119259982672537321`)

Écran principal : `68b433006b5a4eaf9e1d4d3d98bb3206` — **Accueil - D.O.G. Gaming & Tech**

## Identité

- **Marque** : D.O.G. Dépann' Ordi Game
- **Style** : Cyber / gaming, fond sombre, glassmorphism, néons cyan & violet
- **Polices** : Sora (titres) + JetBrains Mono (corps)

## Tokens principaux

| Token | Valeur | Usage |
|-------|--------|-------|
| `background` | `#131318` | Fond page |
| `primary-fixed-dim` | `#00dbe9` | Accents cyan, CTA |
| `secondary-fixed-dim` | `#ebb2ff` | Accents violet |
| `tertiary-fixed-dim` | `#79ff5b` | Accents vert néon |
| `on-surface` | `#e4e1e9` | Texte principal |
| `on-surface-variant` | `#b9cacb` | Texte secondaire |

## Sections (one-page)

1. **Header** — fixe, logo D.O.G., nav, bouton Contact (modale)
2. **Hero** — badge, titre accent, 2 CTA, image glass-card
3. **Expertise** — texte + barres de progression + 4 cartes services
4. **Portfolio** — 3 réalisations avec tags et badges
5. **Social** — YouTube + TikTok
6. **Contact** — newsletter CTA glass-card
7. **Footer** — 3 colonnes

## Composants CSS custom

- `.cyber-grid`, `.glass-card`, `.neon-glow-primary`, `.scanline`, `.id-tag`

## Fichiers cache Stitch

- `.stitch-source.html` — HTML source
- `.stitch-screen.json`
- `.stitch-projects.json`

## Rafraîchir depuis Stitch

```bash
node scripts/fetch-stitch.mjs
```
