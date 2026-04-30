import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire").max(200, "Le titre ne peut pas dépasser 200 caractères"),
  description: z.string().max(1000, "La description ne peut pas dépasser 1000 caractères").optional().or(z.literal("")),
  priority: z.enum(["low", "normal", "high"], {
    errorMap: () => ({ message: "La priorité doit être basse, normale ou haute" }),
  }),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
};
