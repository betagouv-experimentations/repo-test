"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { fr } from "@codegouvfr/react-dsfr";
import { taskSchema, type TaskFormData } from "@/lib/validations";
import type { Task } from "@/db/schema";

interface TaskFormProps {
  task?: Task;
}

export default function TaskForm({ task }: TaskFormProps): React.ReactElement {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: (task?.priority as TaskFormData["priority"]) ?? "normal",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const parsed = taskSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      for (const [key, value] of Object.entries(fieldErrors)) {
        const messages = value as string[] | undefined;
        const first = messages?.[0];
        if (first) {
          newErrors[key] = first;
        }
      }
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    const url = task ? `/api/tasks/${task.id}` : "/api/tasks";
    const method = task ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      const data = await response.json() as { errors?: Record<string, string[]> };
      if (data.errors) {
        const newErrors: Record<string, string> = {};
        for (const [key, messages] of Object.entries(data.errors)) {
          const first = messages?.[0];
          if (first) {
            newErrors[key] = first;
          }
        }
        setErrors(newErrors);
      } else {
        setServerError("Une erreur est survenue. Veuillez réessayer.");
      }
      setSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && (
        <Alert
          severity="error"
          title="Erreur"
          description={serverError}
          className={fr.cx("fr-mb-3w")}
        />
      )}

      <Input
        label="Titre"
        state={errors.title ? "error" : "default"}
        stateRelatedMessage={errors.title}
        nativeInputProps={{
          name: "title",
          value: formData.title,
          onChange: (e) => setFormData({ ...formData, title: e.target.value }),
          required: true,
          maxLength: 200,
        }}
      />

      <Input
        label="Description"
        hintText="Optionnelle"
        state={errors.description ? "error" : "default"}
        stateRelatedMessage={errors.description}
        textArea
        nativeTextAreaProps={{
          name: "description",
          value: formData.description ?? "",
          onChange: (e) => setFormData({ ...formData, description: e.target.value }),
          rows: 4,
          maxLength: 1000,
        }}
      />

      <Select
        label="Priorité"
        state={errors.priority ? "error" : "default"}
        stateRelatedMessage={errors.priority}
        nativeSelectProps={{
          name: "priority",
          value: formData.priority,
          onChange: (e) =>
            setFormData({
              ...formData,
              priority: e.target.value as TaskFormData["priority"],
            }),
        }}
      >
        <option value="low">Basse</option>
        <option value="normal">Normale</option>
        <option value="high">Haute</option>
      </Select>

      <div className={fr.cx("fr-mt-3w")}>
        <Button type="submit" disabled={submitting}>
          {task ? "Modifier la tâche" : "Créer la tâche"}
        </Button>
        <Button
          type="button"
          priority="secondary"
          className={fr.cx("fr-ml-2w")}
          onClick={() => router.push("/")}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
