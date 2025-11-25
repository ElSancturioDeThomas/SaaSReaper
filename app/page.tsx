import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { SubscriptionManager } from '@/components/subscription-manager'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'

export default async function Home() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              SaaS<span className="text-primary">Reaper</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Stop getting screwed by auto-renewals
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <form action={signOut}>
              <Button variant="outline" size="sm" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 flex-1">
        <SubscriptionManager />
      </div>
      <SiteFooter />
    </main>
  )
}
