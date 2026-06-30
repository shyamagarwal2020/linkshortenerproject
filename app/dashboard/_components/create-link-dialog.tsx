'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { createLinkAction } from './actions';

export function CreateLinkDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const result = await createLinkAction({ url, slug: slug || undefined });

    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setOpen(false);
    setUrl('');
    setSlug('');
    router.refresh();
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setUrl('');
      setSlug('');
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-card">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Create a new link
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="url" className="dark:text-white">
              Destination URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="dark:bg-background dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="dark:text-white">
              Short slug{' '}
              <span className="text-muted-foreground dark:text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="slug"
              type="text"
              placeholder="auto-generated if left blank"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="dark:bg-background dark:text-white"
            />
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Letters, numbers, hyphens, and underscores only.
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive dark:text-destructive">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="dark:border-border dark:text-white"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
