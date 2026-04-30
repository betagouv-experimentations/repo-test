import { fr } from "@codegouvfr/react-dsfr";
import TaskForm from "@/components/TaskForm";

export default function NewTaskPage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>Ajouter une tâche</h1>
      <TaskForm />
    </div>
  );
}
