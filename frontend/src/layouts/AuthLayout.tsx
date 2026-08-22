import { Outlet } from 'react-router'
import { Card } from '@/components/ui/card'

/**
 * Layout for the authentication pages (sign in / sign up).
 * Shows the Klipday brand on the top-left and renders the active
 * auth form inside a card centered on the screen.
 *
 * @returns The auth layout wrapper with a centered card outlet.
 */
function AuthLayout() {
  return (
    <main className="flex min-h-svh flex-col bg-muted/40">
      <header className="p-6">
        <span className="font-heading text-2xl font-bold">Klip<span className="text-primary">day</span></span>
      </header>
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <Outlet />
        </Card>
      </div>
    </main>
  )
}

export default AuthLayout
