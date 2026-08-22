import { useState } from 'react'
import { Link } from 'react-router'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AudienceToggle } from './AudienceToggle'
import type { AudienceRole } from '../types'

interface NavbarProps {
  audience: AudienceRole
  onAudienceChange: (audience: AudienceRole) => void
}

const NAV_LINKS = [
  { label: 'Keuntungan', href: '#features' },
  { label: 'Cara Kerja', href: '#how-it-works' },
  { label: 'Komunitas', href: '#community' },
  { label: 'FAQ', href: '#faq' },
]

/**
 * Sticky responsive navigation header for the landing page.
 * Includes logo, smooth-scroll anchor links, audience segmented toggle pill, and login CTA.
 *
 * @param props - Navbar props with audience state and audience switcher handler.
 * @returns The rendered Navbar component.
 */
export function Navbar({ audience, onAudienceChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  /**
   * Smoothly scrolls to target anchor section and closes mobile menu if open.
   *
   * @param e - Mouse click event.
   * @param href - Target anchor href selector.
   */
  function HandleScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetElement = document.querySelector(href)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-block transition-opacity hover:opacity-80"
          >
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              Klip<span className="text-primary">day</span>
            </span>
          </Link>
        </div>

        {/* Center: Smooth scroll anchor links (Desktop) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 rounded-full bg-zinc-900/60 p-1 border border-zinc-800/60"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => HandleScroll(e, link.href)}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Audiences Toggle Switch & Login Button */}
        <div className="hidden sm:flex items-center gap-3">
          <AudienceToggle value={audience} onChange={onAudienceChange} />

          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            <Link to="/signin">
              Masuk
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90"
          >
            <Link
              to={audience === 'CREATOR' ? '/signup?role=creator' : '/signup?role=brand'}
              className="flex items-center gap-1"
            >
              <span>{audience === 'CREATOR' ? 'Mulai Creator' : 'Buat Campaign'}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <AudienceToggle value={audience} onChange={onAudienceChange} />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:text-white"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-zinc-800 bg-zinc-950/95 px-4 pt-2 pb-6 backdrop-blur-2xl">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => HandleScroll(e, link.href)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-zinc-800/80">
            <Button
              asChild
              variant="outline"
              className="w-full justify-center border-zinc-700 bg-zinc-900 text-zinc-200"
            >
              <Link to="/signin">Masuk ke Akun</Link>
            </Button>
            <Button
              asChild
              className="w-full justify-center bg-primary text-primary-foreground shadow-md shadow-primary/20"
            >
              <Link to={audience === 'CREATOR' ? '/signup?role=creator' : '/signup?role=brand'}>
                {audience === 'CREATOR' ? 'Daftar Jadi Creator' : 'Daftar Sebagai Brand'}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

