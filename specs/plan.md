# Plan technique — Todo List

## Architecture

- **Next.js 15 App Router** avec Server Components par défaut
- **API Routes** pour le CRUD des tâches (JSON API)
- **Drizzle ORM** + PostgreSQL pour la persistance
- **Zod** pour la validation des entrées
- **DSFR** pour tous les composants UI

## Modèle de données

### Table `tasks`

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',  -- 'low', 'normal', 'high'
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Endpoints

| Méthode | Route                  | Description              |
|---------|------------------------|--------------------------|
| GET     | /api/tasks             | Liste des tâches (+ filtre ?status=) |
| POST    | /api/tasks             | Créer une tâche          |
| GET     | /api/tasks/[id]        | Détail d'une tâche       |
| PUT     | /api/tasks/[id]        | Modifier une tâche       |
| PATCH   | /api/tasks/[id]        | Toggle completed         |
| DELETE  | /api/tasks/[id]        | Supprimer une tâche      |

## Pages

| Route                    | Composant          | Type            |
|--------------------------|--------------------|-----------------|
| `/`                      | HomePage           | Server Component |
| `/taches/nouvelle`       | NewTaskPage        | Client Component |
| `/taches/[id]/modifier`  | EditTaskPage       | Client Component |

## Composants

| Composant       | Description                          | DSFR utilisé            |
|-----------------|--------------------------------------|-------------------------|
| TaskList        | Liste des tâches avec filtres        | Table, Badge, Button    |
| TaskForm        | Formulaire création/modification     | Input, Select, Button   |
| TaskFilters     | Filtres par statut                   | Button (group)          |
| DeleteButton    | Bouton suppression avec confirmation | Button, Modal (native)  |

## Validation (Zod)

```ts
const taskSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire").max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  priority: z.enum(["low", "normal", "high"]),
});
```
