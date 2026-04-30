import { test, expect } from "@playwright/test";

test.describe("Todo List", () => {
  test("displays the task list page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Mes tâches");
    await expect(page.getByRole("link", { name: "Ajouter une tâche" })).toBeVisible();
  });

  test("can create a new task", async ({ page }) => {
    const name = `Créer-${Date.now()}`;
    await page.goto("/taches/nouvelle");
    await expect(page.locator("h1")).toContainText("Ajouter une tâche");

    await page.fill('input[name="title"]', name);
    await page.fill('textarea[name="description"]', "Description de test");
    await page.selectOption('select[name="priority"]', "high");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/");
    await expect(page.locator("tr", { hasText: name })).toBeVisible();
  });

  test("shows validation error on empty title", async ({ page }) => {
    await page.goto("/taches/nouvelle");

    await page.click('button[type="submit"]');

    await expect(page.getByText("Le titre est obligatoire")).toBeVisible();
  });

  test("can toggle task completion", async ({ page }) => {
    const name = `Toggle-${Date.now()}`;

    await page.goto("/taches/nouvelle");
    await page.fill('input[name="title"]', name);
    await page.selectOption('select[name="priority"]', "normal");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");

    const row = page.locator("tr", { hasText: name });
    const checkbox = row.getByRole("checkbox");
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
    await checkbox.click();

    await page.waitForTimeout(1000);

    await page.reload();
    await page.waitForTimeout(1000);
    const rowAfter = page.locator("tr", { hasText: name });
    const checkboxAfter = rowAfter.getByRole("checkbox");
    await expect(checkboxAfter).toBeChecked();
  });

  test("can edit a task", async ({ page }) => {
    const name = `Modifier-${Date.now()}`;
    const newName = `Modifié-${Date.now()}`;

    await page.goto("/taches/nouvelle");
    await page.fill('input[name="title"]', name);
    await page.selectOption('select[name="priority"]', "low");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");

    const row = page.locator("tr", { hasText: name });
    await row.getByRole("link", { name: "Modifier" }).click();

    await expect(page.locator("h1")).toContainText("Modifier la tâche");

    await page.fill('input[name="title"]', newName);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/");
    await expect(page.locator("tr", { hasText: newName })).toBeVisible();
  });

  test("can delete a task", async ({ page }) => {
    const name = `Supprimer-${Date.now()}`;

    await page.goto("/taches/nouvelle");
    await page.fill('input[name="title"]', name);
    await page.selectOption('select[name="priority"]', "normal");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");

    page.on("dialog", (dialog) => dialog.accept());

    const row = page.locator("tr", { hasText: name });
    await row.getByRole("button", { name: "Supprimer" }).click();

    await expect(page.locator("tr", { hasText: name })).not.toBeVisible();
  });

  test("can filter tasks by status", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Toutes" })).toBeVisible();
    await expect(page.getByRole("button", { name: "À faire" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Terminées" })).toBeVisible();

    await page.getByRole("button", { name: "À faire" }).click();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "Terminées" }).click();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "Toutes" }).click();
    await page.waitForTimeout(500);
  });
});
