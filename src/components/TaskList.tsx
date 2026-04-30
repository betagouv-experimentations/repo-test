"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import type { Task } from "@/db/schema";
import { PRIORITY_LABELS } from "@/lib/validations";

type FilterStatus = "all" | "pending" | "completed";

const PRIORITY_SEVERITY: Record<string, "info" | "warning" | "error"> = {
  low: "info",
  normal: "warning",
  high: "error",
};

export default function TaskList(): React.ReactElement {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async (): Promise<void> => {
    setLoading(true);
    const params = filter !== "all" ? `?status=${filter}` : "";
    const response = await fetch(`/api/tasks${params}`);
    const data = (await response.json()) as Task[];
    setTasks(data);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const handleToggle = async (id: number): Promise<void> => {
    await fetch(`/api/tasks/${id}`, { method: "PATCH" });
    void fetchTasks();
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      return;
    }
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    void fetchTasks();
  };

  return (
    <div>
      <div className={fr.cx("fr-mb-3w")}>
        <ul className={fr.cx("fr-btns-group", "fr-btns-group--inline-sm")}>
          <li>
            <Button
              priority={filter === "all" ? "primary" : "secondary"}
              size="small"
              onClick={() => setFilter("all")}
            >
              Toutes
            </Button>
          </li>
          <li>
            <Button
              priority={filter === "pending" ? "primary" : "secondary"}
              size="small"
              onClick={() => setFilter("pending")}
            >
              À faire
            </Button>
          </li>
          <li>
            <Button
              priority={filter === "completed" ? "primary" : "secondary"}
              size="small"
              onClick={() => setFilter("completed")}
            >
              Terminées
            </Button>
          </li>
        </ul>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : tasks.length === 0 ? (
        <Alert
          severity="info"
          title="Aucune tâche"
          description="Vous n'avez aucune tâche pour le moment. Créez-en une !"
        />
      ) : (
        <div className={fr.cx("fr-table")} role="region" aria-label="Liste des tâches">
          <table>
            <thead>
              <tr>
                <th scope="col">Statut</th>
                <th scope="col">Titre</th>
                <th scope="col">Priorité</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => void handleToggle(task.id)}
                      aria-label={`Marquer "${task.title}" comme ${task.completed ? "à faire" : "terminée"}`}
                    />
                  </td>
                  <td>
                    <span
                      style={{
                        textDecoration: task.completed ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <span className={fr.cx("fr-hint-text")}>
                        {" — "}{task.description}
                      </span>
                    )}
                  </td>
                  <td>
                    <Badge severity={PRIORITY_SEVERITY[task.priority] ?? "info"}>
                      {PRIORITY_LABELS[task.priority] ?? task.priority}
                    </Badge>
                  </td>
                  <td>
                    <ul className={fr.cx("fr-btns-group", "fr-btns-group--inline-sm")}>
                      <li>
                        <Link
                          href={`/taches/${task.id}/modifier`}
                          className={fr.cx("fr-btn", "fr-btn--secondary", "fr-btn--sm")}
                        >
                          Modifier
                        </Link>
                      </li>
                      <li>
                        <Button
                          priority="tertiary no outline"
                          size="small"
                          onClick={() => void handleDelete(task.id)}
                        >
                          Supprimer
                        </Button>
                      </li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
