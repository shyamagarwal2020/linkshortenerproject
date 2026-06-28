import { Show, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            Link Shortener
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Shorten your long URLs into clean, shareable links in seconds.
          </p>
        </div>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button size="lg">Get Started</Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <Button asChild size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </Show>
      </main>
    </div>
  );
}
