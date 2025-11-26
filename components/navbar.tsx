import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import { User } from '@/lib/auth'

interface NavbarProps {
  user?: User | null
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
            <Link href="/">
                <h1 className="text-3xl font-bold">
                SaaS<span className="text-primary">Reaper</span>
                </h1>
            </Link>
             <nav className="hidden md:flex items-center gap-4">
                <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Subscriptions
                </Link>
                <Link href="/catalog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Reaper's List
                </Link>
             </nav>
        </div>

        <div className="flex items-center gap-4">
            <ModeToggle />
          {user ? (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <form action={signOut}>
                <Button variant="outline" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
             <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                 <Button asChild variant="default" size="sm">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
             </div>
          )}
        </div>
      </div>
    </header>
  )
}

