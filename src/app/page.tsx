import Game from "@/components/Game";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full py-6 text-center">
        <p className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Turbotaal
        </p>
      </header>
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center gap-8 py-8 px-4">
        <Game />
      </main>
    </div>
  );
}
