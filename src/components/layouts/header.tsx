import ThemeToggler from "@/components/theme-toggle";
import NavLinks from "@/components/layouts/nav";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-8">
          <span className="text-primary text-headline-lg font-bold">
            LedgerLite
          </span>

          <NavLinks />
        </div>

        <div>
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}

export default Header;
