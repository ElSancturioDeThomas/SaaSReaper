import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-4">
          
          <div className="text-left flex flex-col items-start gap-2 w-full md:w-auto">
            <div>
              <h3 className="text-lg font-bold text-foreground font-serif tracking-tight">
                Tried our product?
              </h3>
              <p className="text-muted-foreground text-sm">
                Help us improve with a quick survey.
              </p>
            </div>
            
            <Link 
              href="https://form.typeform.com/to/placeholder" 
              target="_blank"
              className="inline-flex items-center justify-center font-medium text-primary hover:text-primary/80 group transition-colors text-sm whitespace-nowrap"
            >
              Give Feedback 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="text-xs text-muted-foreground whitespace-nowrap w-full md:w-auto text-right md:text-right mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} SaasReaper. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
