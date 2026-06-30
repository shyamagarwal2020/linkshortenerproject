import { getLinksByUser } from '@/data/links';
import { CreateLinkDialog } from './_components/create-link-dialog';
import { LinkItem } from './_components/link-item';

export default async function DashboardPage() {
  const links = await getLinksByUser();

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Your Links</h1>
        <CreateLinkDialog />
      </div>

      {links.length === 0 ? (
        <p className="text-muted-foreground dark:text-muted-foreground">
          You haven&apos;t created any links yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.id}>
              <LinkItem link={link} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
