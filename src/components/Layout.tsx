import { Logo } from "./Logo";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main>
      <header className="mb-12 border-b-2 border-black pb-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Logo
              size={48}
              className="text-black transition-transform duration-300 hover:scale-110"
            />
          </Link>
          <h1 className="font-black tracking-tight">Universal FT</h1>
        </div>
        <p className="text-neutral-500">
          Premarket news analysis for the modern investor.
        </p>
      </header>
      {children}
      <footer className="my-8 text-center">
        <p className="text-neutral-500">Made with ❤️ in Texas</p>
      </footer>
    </main>
  );
}
