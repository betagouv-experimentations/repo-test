import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, type Task } from "@/db/schema";
import { taskSchema } from "@/lib/validations";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let result: Task[];

  if (status === "completed") {
    result = await db.select().from(tasks).where(eq(tasks.completed, true)).orderBy(desc(tasks.createdAt));
  } else if (status === "pending") {
    result = await db.select().from(tasks).where(eq(tasks.completed, false)).orderBy(desc(tasks.createdAt));
  } else {
    result = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body: unknown = await request.json();
  const parsed = taskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const [task] = await db
    .insert(tasks)
    .values({
      title: parsed.data.title,
      description: parsed.data.description || null,
      priority: parsed.data.priority,
    })
    .returning();

  return NextResponse.json(task, { status: 201 });
}
