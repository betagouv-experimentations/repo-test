// scripts/seed.ts — Seed data pour le développement local.
// Lancer avec : npm run seed

import { db } from "../src/db";
import { tasks } from "../src/db/schema";

async function seed(): Promise<void> {
  console.log("→ Seeding database...");

  await db.delete(tasks);

  await db.insert(tasks).values([
    {
      title: "Préparer le compte-rendu de réunion",
      description: "Rédiger le CR de la réunion d'équipe du lundi",
      priority: "high",
      completed: false,
    },
    {
      title: "Envoyer le rapport trimestriel",
      description: "Compiler les données et envoyer le rapport au comité de pilotage",
      priority: "high",
      completed: true,
    },
    {
      title: "Mettre à jour la documentation",
      description: "Actualiser la documentation technique du projet",
      priority: "normal",
      completed: false,
    },
    {
      title: "Réserver la salle pour le séminaire",
      priority: "normal",
      completed: false,
    },
    {
      title: "Acheter des fournitures de bureau",
      description: "Stylos, cahiers, post-it",
      priority: "low",
      completed: true,
    },
  ]);

  console.log("✓ Seed terminé. 5 tâches insérées.");
}

seed()
  .catch((error: unknown) => {
    console.error("✗ Erreur durant le seed :", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
