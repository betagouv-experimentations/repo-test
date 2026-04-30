Le PM décrit ce qu'il veut construire. Suis ce workflow en séquence.

## Phase 1 — Comprendre

Pose uniquement les questions CRITIQUES. Maximum 3 questions.
Exemples de bonnes questions :
- "Qui sont les utilisateurs de cet outil ?"
- "Quelles sont les 3 actions principales qu'ils doivent pouvoir faire ?"
- "Y a-t-il des données sensibles ou personnelles à gérer ?"

Si le besoin est déjà clair et précis, passe directement à la phase 2.

## Phase 2 — Spécifier

Génère une spec concise dans `specs/spec.md`. La spec doit contenir :
- Description du projet (2-3 phrases)
- Liste des écrans principaux
- Modèle de données (entités et relations)
- Parcours utilisateur prioritaire

Montre au PM un **résumé en 10-15 lignes max** (pas le fichier entier).
Demande : "Ça correspond à ce que tu veux ? Si oui je lance la
construction. Sinon dis-moi ce qu'il faut changer."

ATTENDS la validation du PM avant de continuer.

## Phase 3 — Construire

Enchaîne SANS interruption :

1. **Planifier** : Écris le plan technique dans `specs/plan.md`
   (architecture, modèle de données détaillé, endpoints API, composants)

2. **Schéma DB** : Écris le schéma Drizzle dans `src/db/schema.ts`,
   génère et applique la migration :
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

3. **Implémenter écran par écran** :
   Pour chaque écran du plan :
   a. Crée la page dans `src/app/`
   b. Crée les composants nécessaires dans `src/components/`
   c. Crée les API routes dans `src/app/api/` si nécessaire
   d. Utilise UNIQUEMENT les composants `@codegouvfr/react-dsfr`
   e. Écris un test E2E dans `tests/` pour le parcours de cet écran

4. **Seed data** : Écris des données de test réalistes dans
   `scripts/seed.ts` et exécute `npm run seed`

5. **Tester** : Lance TOUS les tests E2E :
   ```bash
   npx playwright test
   ```
   Si un test échoue, corrige et relance jusqu'à 100% vert.

6. **Review rapide** : Vérifie mentalement :
   - Tous les composants sont du DSFR ?
   - Les pages obligatoires existent ?
   - Le lien d'évitement est dans le layout ?
   - Les formulaires ont des labels et des validations zod ?
   - Les migrations sont commitées ?

7. **Dev server** : Lance le serveur :
   ```bash
   npm run dev
   ```

8. **Smoke test** : utilise le MCP Playwright pour vérifier que le
   serveur répond correctement AVANT de rendre la main au PM :

   - Navigue sur `http://localhost:3000`
   - Vérifie que la réponse HTTP est 200
   - Capture les messages console (`browser_console_messages`) — il
     ne doit pas y avoir d'erreur JS au chargement
   - Prends un snapshot accessibility (`browser_snapshot`) — vérifie
     qu'un `<h1>` est présent et que la page n'est pas cassée
   - Visite **au moins** un écran principal du parcours utilisateur
     (le plus important du plan), idem : pas d'erreur, page rend.

   Si le smoke test détecte un problème :
   - Diagnostique (route 404, erreur de serveur, erreur Hydration,
     bundle qui ne charge pas, etc.)
   - Corrige
   - Relance le dev server si besoin
   - Refais le smoke test
   - Itère jusqu'à ce que tout passe.

   NE rends PAS la main au PM tant que le smoke test n'est pas vert.

## Phase 4 — Livrer

Affiche au PM :

"✅ Ton proto est prêt !

→ Ouvre http://localhost:3000 dans ton navigateur pour le voir
→ Navigue dans les écrans, teste les formulaires
→ Dis-moi si tu veux changer quelque chose (/change)
→ Quand c'est bon, tape /save pour le mettre en ligne"
