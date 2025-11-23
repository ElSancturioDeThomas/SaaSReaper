import Link from 'next/link'
import { ArrowLeft, Search, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteFooter } from '@/components/site-footer'
import { Input } from '@/components/ui/input'
import { getSaaSProducts } from '@/app/actions/catalog'
import { ProductLogo } from '@/components/product-logo-fallback'

export default async function CatalogPage() {
  const products = await getSaaSProducts()

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <h1 className="text-xl font-semibold hidden sm:block">
              Reaper's List
            </h1>
          </div>
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md ml-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search global catalog..." 
                className="w-full pl-9 bg-background"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Global SaaS Catalog</h2>
          <p className="text-muted-foreground">
            The definitive directory of subscription services. Verified by the community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group relative flex flex-col bg-card hover:bg-accent/5 border border-border hover:border-primary rounded-lg p-5 transition-all hover:shadow-md min-h-[320px]"
            >
              {/* Card Header with Icon and Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-md bg-background border border-border flex items-center justify-center overflow-hidden">
                  <ProductLogo 
                    src={product.logo_url} 
                    alt={`${product.name} logo`}
                    fallback={product.name}
                  />
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  product.status === 'verified' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {product.status === 'verified' ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Pending'}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  {product.category && (
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10">
                      {product.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Action Area (Future) */}
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {product.default_cost ? `Est. $${product.default_cost}/mo` : 'Price varies'}
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Add to My List
                </Button>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No products found. Run the seed script to populate the catalog.
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
