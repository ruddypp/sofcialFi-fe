"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Search, PenTool, Vote, Zap, Settings, ChevronRight, Menu, X } from "lucide-react"

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Search, label: "Explore Campaigns", href: "/campaigns" },
  { icon: PenTool, label: "Create Petition", href: "/create" },
  { icon: Vote, label: "DAO Governance", href: "/governance" },
  { icon: Zap, label: "My Actions", href: "/my-actions" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card hover:bg-muted"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen w-64 
          bg-sidebar border-r border-sidebar-border
          transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ImpactChain
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">DAO Platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group flex items-center gap-3 px-4 py-3 rounded-lg
                  text-sidebar-foreground hover:text-sidebar-primary
                  hover:bg-sidebar-primary/10 transition-all
                  border border-transparent hover:border-sidebar-primary/20
                "
              >
                <Icon size={20} className="group-hover:text-sidebar-primary" />
                <span className="text-sm font-medium">{item.label}</span>
                <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50 text-center">© 2025 ImpactChain DAO</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 lg:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
