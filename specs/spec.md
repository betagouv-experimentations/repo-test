# Spec — Application Todo List

## Description

Application de gestion de tâches (todo list) permettant de créer, organiser et suivre ses tâches quotidiennes. Les tâches sont persistées en base de données PostgreSQL. Interface en français, conforme au DSFR.

## Écrans principaux

1. **Page d'accueil / Liste des tâches** (`/`) — Affiche toutes les tâches avec leur statut (à faire / terminée). Permet de filtrer par statut. Actions rapides : cocher/décocher, supprimer.
2. **Créer une tâche** (`/taches/nouvelle`) — Formulaire de création avec titre (obligatoire), description (optionnelle) et priorité (basse, normale, haute).
3. **Modifier une tâche** (`/taches/[id]/modifier`) — Formulaire pré-rempli pour modifier une tâche existante.

## Modèle de données

### Table `tasks`
| Colonne       | Type         | Contraintes          |
|---------------|--------------|----------------------|
| id            | serial       | PK                   |
| title         | text         | NOT NULL             |
| description   | text         | nullable             |
| priority      | text         | NOT NULL, défaut "normal" |
| completed     | boolean      | NOT NULL, défaut false |
| created_at    | timestamptz  | NOT NULL, défaut now |
| updated_at    | timestamptz  | NOT NULL, défaut now |

## Parcours utilisateur prioritaire

1. L'utilisateur arrive sur la page d'accueil et voit la liste de ses tâches
2. Il clique "Ajouter une tâche", remplit le formulaire, valide
3. La tâche apparaît dans la liste
4. Il peut cocher une tâche pour la marquer comme terminée
5. Il peut modifier ou supprimer une tâche existante
6. Il peut filtrer les tâches par statut (toutes / à faire / terminées)
