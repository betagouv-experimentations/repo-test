# CLAUDE.md — Constitution du projet

## Contexte

Ce projet est un prototype de service public numérique français,
développé dans le cadre de beta.gouv.fr.

Le développeur principal est un Product Manager non technique qui
communique en français. Tu es son unique outil de développement.
Tu dois produire du code de qualité professionnelle, comme si un
dev senior allait le relire demain.

## Commandes disponibles

Le PM utilise 4 commandes. Ne le redirige pas vers d'autres outils :

- `/build` — Créer le projet ou une refonte majeure
- `/change` — Modifier l'existant (feature, fix, amélioration)
- `/save` — Tests, commit, push, déploiement
- `/preview` — Lancer ou relancer le serveur de dev

## Stack technique imposée

- **Framework** : Next.js 15 (App Router) + TypeScript strict
- **UI** : `@codegouvfr/react-dsfr` exclusivement
  - NE PAS utiliser Tailwind, Material UI, shadcn, Chakra, ou autre
  - NE PAS écrire du CSS custom sauf cas exceptionnel documenté
  - Importer les composants depuis `@codegouvfr/react-dsfr`
  - Consulter docs/guidelines/dsfr.md pour la liste des composants
- **ORM** : Drizzle ORM avec PostgreSQL
  - Toujours passer par des migrations (voir docs/guidelines/migrations.md)
- **Validation** : zod pour toutes les entrées utilisateur
- **Tests** : Playwright pour les tests E2E
- **Langue du code** : anglais (variables, fonctions, commentaires)
- **Langue de l'interface** : français

## Règles de développement

### Architecture Next.js

- Utiliser l'App Router (dossier `src/app/`)
- Server Components par défaut, Client Components uniquement si
  nécessaire (interactivité, hooks, effets)
- Marquer explicitement les Client Components avec `"use client"`
- API Routes dans `src/app/api/` pour les endpoints backend
- Server Actions pour les mutations simples (formulaires)
- Pas de dossier `pages/` (ancien router)

### Base de données

- **TOUJOURS** utiliser des migrations Drizzle pour chaque changement
  de schéma
- Workflow :
  1. Modifier `src/db/schema.ts`
  2. `npx drizzle-kit generate` (génère la migration SQL)
  3. `npx drizzle-kit migrate` (applique la migration)
  4. Vérifier que la migration est dans `drizzle/`
- **JAMAIS** de modification manuelle de la DB (pas de `ALTER TABLE`
  direct, pas de `psql` pour changer le schéma)
- Seed data dans `scripts/seed.ts`, exécutable via `npm run seed`
- En développement, la DB tourne dans Docker (docker-compose.yml)
- En production, la DB est provisionnée par Coolify (DATABASE_URL
  injectée automatiquement)
- **En production, les migrations sont appliquées automatiquement au
  démarrage du container** via `scripts/migrate.mjs`. Tu n'as pas à
  les déclencher manuellement après un déploiement. Si la migration
  échoue, le container ne démarre pas et Coolify rapporte l'erreur.

### Tests

- **Au minimum un test E2E Playwright par parcours utilisateur
  critique** : créer, modifier, supprimer, lister, chercher
- Lancer les tests AVANT de considérer une tâche terminée
- Commande : `npx playwright test`
- Si un test échoue, le corriger IMMÉDIATEMENT. Ne JAMAIS :
  - Skipper un test avec `.skip`
  - Supprimer un test qui échoue
  - Committer avec des tests rouges
- Les tests doivent être indépendants (chaque test setup/teardown
  ses propres données)
- Consulter docs/guidelines/testing.md pour les patterns

### Qualité TypeScript

- `"strict": true` dans tsconfig.json — pas de dérogation
- JAMAIS de `any` — utiliser `unknown` + type guard si nécessaire
- JAMAIS de `@ts-ignore` ou `@ts-expect-error`
- Typer explicitement les props de composants, les retours de fonctions,
  les schémas Drizzle, les paramètres d'API
- Utiliser les types utilitaires TypeScript (Partial, Pick, Omit, etc.)
  plutôt que de redéfinir des types

### Accessibilité (RGAA)

Obligatoire, pas optionnel. Consulter docs/guidelines/rgaa.md.

Règles minimales à respecter SYSTÉMATIQUEMENT :
- Lien d'évitement "Aller au contenu" dans le layout principal
- `<html lang="fr">` sur toutes les pages
- Titres hiérarchiques (`<h1>` unique par page, `<h2>`, `<h3>` en ordre)
- Alternatives textuelles (`alt`) sur TOUTES les images informatives
- `alt=""` sur les images décoratives
- Labels explicites sur TOUS les champs de formulaire (`<label htmlFor>`)
- Messages d'erreur associés aux champs via `aria-describedby`
- Navigation au clavier fonctionnelle (tab, enter, escape)
- Focus visible sur tous les éléments interactifs (DSFR le gère, ne pas
  l'overrider avec `outline: none`)
- Contrastes de couleur conformes (utiliser les couleurs DSFR uniquement)
- Deux systèmes de navigation (menu principal + un autre : recherche,
  plan du site, ou fil d'Ariane)

### Sécurité

Consulter docs/guidelines/security.md.

- Variables d'environnement dans `.env.local` (jamais committé)
- JAMAIS de secret en dur dans le code (API keys, mots de passe, tokens)
- Valider TOUTES les entrées utilisateur avec zod :
  - Côté serveur (API routes, Server Actions)
  - Côté client (formulaires) pour l'UX, mais la validation serveur
    est la source de vérité
- Pas de requêtes SQL brutes — utiliser Drizzle ORM exclusivement
- Échapper les données affichées (React le fait par défaut, ne pas
  utiliser `dangerouslySetInnerHTML`)
- CSRF : Next.js le gère nativement avec les Server Actions
- Headers de sécurité : configurés dans `next.config.ts`

### Commits et Git

Le PM ne connaît pas Git. C'est la commande `/save` qui gère.
Quand `/save` est appelée :
- Message de commit en anglais, format conventionnel :
  `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`
- Message descriptif et clair (pas "update", pas "fix stuff")
- Un commit par `/save` (tout le travail depuis le dernier save)

### Style de code

- Indentation : 2 espaces
- Guillemets : doubles pour JSX, simples pour JS/TS
- Point-virgule : oui
- Trailing comma : oui
- Max ligne : 100 caractères (flexible pour JSX)
- Nommage : camelCase pour variables/fonctions, PascalCase pour
  composants/types, SCREAMING_SNAKE_CASE pour constantes
- Fichiers : kebab-case (ex: `user-profile.tsx`)
- Un composant React par fichier

### Pages obligatoires

Ces pages DOIVENT exister dans le projet. Des templates sont fournis
dans le starter kit :
- `/mentions-legales`
- `/accessibilite`
- `/donnees-personnelles`

Quand le projet a des utilisateurs réels, ajouter :
- `/stats` (métriques d'impact, cf. standards beta)

### Éco-conception

- Pas de dépendances inutiles. Chaque `npm install` doit avoir une
  raison claire.
- Pas de polyfills ou libs de compatibilité sauf si nécessaire
- Optimiser les images (format WebP, lazy loading)
- Utiliser `next/image` pour toutes les images
- Pas de requêtes en cascade (N+1). Utiliser les jointures Drizzle.
- Pagination des listes longues (pas de "charger tout d'un coup")

### Ce que tu ne dois JAMAIS faire

1. Supprimer ou modifier du code existant sans qu'on te l'ait demandé
2. Utiliser des composants UI qui ne sont pas du DSFR
3. Modifier la DB sans migration Drizzle
4. Ignorer ou supprimer un test qui échoue
5. Committer des secrets ou des données personnelles
6. Installer des dépendances sans justification
7. Faire des requêtes fetch vers des APIs non documentées dans le projet
8. Utiliser `any`, `@ts-ignore`, ou `@ts-expect-error`
9. Écrire du CSS custom quand un composant DSFR existe
10. Supprimer les pages obligatoires (mentions légales, accessibilité, etc.)

### Références contextuelles

Consulte ces fichiers quand tu travailles sur le domaine correspondant :
- UI et composants → `docs/guidelines/dsfr.md`
- Accessibilité → `docs/guidelines/rgaa.md`
- Base de données → `docs/guidelines/migrations.md`
- Tests → `docs/guidelines/testing.md`
- Sécurité → `docs/guidelines/security.md`
- Standards beta → `docs/guidelines/beta-standards.md`
