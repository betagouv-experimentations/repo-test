import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { taskSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
  if (!task) {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const body: unknown = await request.json();
  const parsed = taskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const [task] = await db
    .update(tasks)
    .set({
      title: parsed.data.title,
      description: parsed.data.description || null,
      priority: parsed.data.priority,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning();

  if (!task) {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const [existing] = await db.select().from(tasks).where(eq(tasks.id, taskId));
  if (!existing) {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }

  const [task] = await db
    .update(tasks)
    .set({
      completed: !existing.completed,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning();

  return NextResponse.json(task);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const [task] = await db
    .delete(tasks)
    .where(eq(tasks.id, taskId))
    .returning();

  if (!task) {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
