import { KanbanBoard } from "@/src/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-screen-2xl">
        <KanbanBoard />
      </div>
    </main>
  );
}
