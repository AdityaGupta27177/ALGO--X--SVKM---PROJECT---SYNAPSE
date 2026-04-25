import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoSmall } from "@/components/Logo";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/games/pong": "Pong",
  "/games/pong/tutorial": "Tutorial",
  "/games/pong/test": "Test",
  "/games/snake": "Snake",
  "/games/snake/tutorial": "Tutorial",
  "/games/snake/test": "Test",
};

export default function Navbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; path: string }[] = [];
  let currentPath = "";
  for (const seg of pathSegments) {
    currentPath += `/${seg}`;
    if (breadcrumbMap[currentPath]) {
      breadcrumbs.push({ label: breadcrumbMap[currentPath], path: currentPath });
    }
  }

  const displayName = profile?.display_name ?? "Student";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/sign-in");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center transition-colors hover:opacity-90">
            <LogoSmall />
          </Link>
          {breadcrumbs.length > 1 && (
            <div className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
              {breadcrumbs.map((bc, i) => (
                <span key={bc.path} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5" />
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-foreground">{bc.label}</span>
                  ) : (
                    <Link to={bc.path} className="transition-colors hover:text-foreground">{bc.label}</Link>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials}
          </div>
          <span className="hidden text-sm text-muted-foreground sm:block">{displayName}</span>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
            <LogOut className="mr-1 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  );
}
