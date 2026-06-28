import { Show, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Link2, BarChart3, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Zap,
    title: 'Instant Shortening',
    description:
      'Paste any long URL and get a clean short link in one click — no setup required.',
  },
  {
    icon: Link2,
    title: 'Clean, Shareable Links',
    description:
      'Generate short links that look great in emails, social posts, and messages.',
  },
  {
    icon: BarChart3,
    title: 'Click Analytics',
    description:
      'Track how many times each link has been clicked and monitor engagement over time.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description:
      'Every link is tied to your account, giving you full control to manage or delete them.',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-28 text-center">
        <Badge variant="secondary" className="text-xs font-medium">
          Free to use · No credit card required
        </Badge>

        <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Shorten links,{' '}
          <span className="text-primary">amplify reach</span>
        </h1>

        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Turn long, unwieldy URLs into clean short links in seconds. Track
          clicks, manage links, and share with confidence.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <Button size="lg" className="px-8">
                Get Started — it&apos;s free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg" className="px-8">
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Button asChild size="lg" className="px-8">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </Show>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-white px-6 py-20 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Everything you need
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              A simple, powerful toolset for managing all your links in one place.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className={cn(
                  'flex flex-col gap-0 transition-shadow hover:shadow-md',
                  'dark:hover:shadow-zinc-800/50'
                )}
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-6 py-20 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Ready to shorten your first link?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign up for free and start creating short links in under a minute.
          </p>
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <Button size="lg" className="px-10">
                Create a free account
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button asChild size="lg" className="px-10">
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
          </Show>
        </div>
      </section>
    </div>
  )
}
