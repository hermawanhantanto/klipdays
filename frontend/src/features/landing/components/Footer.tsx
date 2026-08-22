import { Link } from 'react-router'
import { DiscordIcon } from './DiscordIcon'
import { DISCORD_INVITE_URL } from '../data/landing-content'

/**
 * Footer component for Klipday landing page.
 * Includes logo, brand narrative, smooth-scroll navigation links, Discord community link,
 * legal placeholders, and copyright notice.
 *
 * @returns The rendered Footer component.
 */
export function Footer() {
  /**
   * Smoothly scrolls to target anchor section.
   *
   * @param e - Mouse click event.
   * @param href - Target anchor selector.
   */
  function HandleScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetElement = document.querySelector(href)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col items-start">
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

            <p className="mt-3 max-w-sm text-sm text-zinc-400 leading-relaxed">
              Performance-based Short Video Marketplace. Menghubungkan brand dengan creator terbaik melalui sistem rekening bersama (rekber) & CPM yang transparan.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Klipday Discord Community"
                className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:border-[#5865F2] hover:bg-[#5865F2]/10 hover:text-[#5865F2]"
              >
                <DiscordIcon className="size-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-heading text-sm font-semibold text-white">Navigasi Cepat</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  onClick={(e) => HandleScroll(e, '#features')}
                  className="transition-colors hover:text-white"
                >
                  Keuntungan & Fitur
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => HandleScroll(e, '#how-it-works')}
                  className="transition-colors hover:text-white"
                >
                  Cara Kerja
                </a>
              </li>
              <li>
                <a
                  href="#community"
                  onClick={(e) => HandleScroll(e, '#community')}
                  className="transition-colors hover:text-white"
                >
                  Komunitas Discord
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => HandleScroll(e, '#faq')}
                  className="transition-colors hover:text-white"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div className="md:col-span-4">
            <h4 className="font-heading text-sm font-semibold text-white">Akses Akun & Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/signin" className="transition-colors hover:text-white">
                  Masuk ke Akun
                </Link>
              </li>
              <li>
                <Link to="/signup?role=creator" className="transition-colors hover:text-white">
                  Daftar Jadi Creator
                </Link>
              </li>
              <li>
                <Link to="/signup?role=brand" className="transition-colors hover:text-white">
                  Daftar Sebagai Brand
                </Link>
              </li>
              <li>
                <span className="text-zinc-500 cursor-not-allowed">Syarat & Ketentuan (Segera)</span>
              </li>
              <li>
                <span className="text-zinc-500 cursor-not-allowed">Kebijakan Privasi (Segera)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Klipday. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
