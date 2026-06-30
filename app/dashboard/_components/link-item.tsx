'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Pencil, Trash2 } from 'lucide-react';
import { updateLinkAction, deleteLinkAction } from './actions';

type LinkData = {
  id: number;
  slug: string;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function LinkItem({ link }: { link: LinkData }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [url, setUrl] = useState(link.url);
  const [slug, setSlug] = useState(link.slug);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const result = await updateLinkAction({ id: link.id, url, slug });
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setEditOpen(false);
    router.refresh();
  }

  function handleEditOpenChange(value: boolean) {
    setEditOpen(value);
    if (!value) {
      setUrl(link.url);
      setSlug(link.slug);
      setError(null);
    }
  }

  async function handleDelete() {
    await deleteLinkAction({ id: link.id });
    router.refresh();
  }

  return (
    <>
      <Card className="dark:bg-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Link className="h-4 w-4 shrink-0 text-muted-foreground dark:text-muted-foreground" />
          <CardTitle className="text-base font-semibold dark:text-white">
            /{link.slug}
          </CardTitle>
          <Badge
            variant="secondary"
            className="ml-auto dark:bg-secondary dark:text-secondary-foreground"
          >
            {new Date(link.createdAt).toLocaleDateString()}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 dark:text-white"
            onClick={() => setEditOpen(true)}
            aria-label="Edit link"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive dark:text-destructive"
            onClick={() => setDeleteOpen(true)}
            aria-label="Delete link"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400 truncate block"
          >
            {link.url}
          </a>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-md dark:bg-card">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit link</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor={`url-${link.id}`} className="dark:text-white">
                Destination URL
              </Label>
              <Input
                id={`url-${link.id}`}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="dark:bg-background dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`slug-${link.id}`} className="dark:text-white">
                Short slug
              </Label>
              <Input
                id={`slug-${link.id}`}
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
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
                onClick={() => handleEditOpenChange(false)}
                className="dark:border-border dark:text-white"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="dark:bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Delete this link?
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-muted-foreground">
              This will permanently delete{' '}
              <span className="font-medium text-foreground dark:text-white">
                /{link.slug}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-border dark:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
