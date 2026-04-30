"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import TaskForm from "@/components/TaskForm";
import type { Task } from "@/db/schema";

export default function EditTaskPage(): React.ReactElement {
  const params = useParams();
  const id = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTask(): Promise<void> {
      const response = await fetch(`/api/tasks/${id}`);
      if (!response.ok) {
        setError("Tâche introuvable");
        setLoading(false);
        return;
      }
      const data = (await response.json()) as Task;
      setTask(data);
      setLoading(false);
    }
    void fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className={fr.cx("fr-container", "fr-my-6w")}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className={fr.cx("fr-container", "fr-my-6w")}>
        <Alert severity="error" title="Erreur" description={error ?? "Tâche introuvable"} />
      </div>
    );
  }

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>Modifier la tâche</h1>
      <TaskForm task={task} />
    </div>
  );
}
