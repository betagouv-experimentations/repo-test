import Link from "next/link";
import { fr } from "@codegouvfr/react-dsfr";
import TaskList from "@/components/TaskList";

export default function HomePage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--middle", "fr-mb-4w")}>
        <div className={fr.cx("fr-col")}>
          <h1>Mes tâches</h1>
        </div>
        <div>
          <Link
            href="/taches/nouvelle"
            className={fr.cx("fr-btn")}
          >
            Ajouter une tâche
          </Link>
        </div>
      </div>
      <TaskList />
    </div>
  );
}
