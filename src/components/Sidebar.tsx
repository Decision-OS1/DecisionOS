"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Target,
  BarChart3,
  Lightbulb,
  History,
  Bot,
  Trophy,
  User,
  HelpCircle,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/decision", label: "Today's Decision", icon: Target },
  { href: "/progress", label: "My Progress", icon: BarChart3 },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/history", label: "History", icon: History },
  { href: "/coach", label: "AI Coach", icon: Bot },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/help", label: "Help & FAQ", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-border bg-surface px-4 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-text">DecisionOS</p>
          <p className="text-[11px] leading-tight text-text-muted">
            Understand Decisions.
            <br />
            Improve Lives.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-primary-soft text-primary"
                  : "text-text-muted hover:bg-bg hover:text-text"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="mt-3">
        <button
          type="submit"
          className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-text-muted transition hover:bg-bg hover:text-text"
        >
          Log out
        </button>
      </form>
    </aside>
  );
}
