import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function AppLogo({ withWordmark = true, className = "" }: { withWordmark?: boolean; className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
        <img src={logo} alt="" width={20} height={20} className="invert brightness-200" />
      </span>
      {withWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Aria<span className="text-primary">.</span>
        </span>
      )}
    </Link>
  );
}
