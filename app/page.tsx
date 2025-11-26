import { Navbar } from '@/components/navbar'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { SubscriptionManager } from '@/components/subscription-manager'
import { SiteFooter } from '@/components/site-footer'

export default async function Home() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-8 flex-1">
        <SubscriptionManager />
      </div>
      <SiteFooter />
    </main>
  )
}
