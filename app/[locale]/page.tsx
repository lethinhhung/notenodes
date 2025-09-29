import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";

export default async function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <ModeToggle />
        <LanguageToggle />
      </div>
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center">Welcome</h1>
      </main>
    </div>
  );
}