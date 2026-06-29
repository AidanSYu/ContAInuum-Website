import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, FolderKanban, Lock } from 'lucide-react';
import {
  listProjects,
  createProject,
  deleteProject,
  getMySubscription,
  hasAccess,
  type Project,
} from '@/lib/api';
import { flags } from '@/lib/flags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ProjectsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const { data: sub } = useQuery({ queryKey: ['subscription'], queryFn: getMySubscription });
  const { data: projects, isLoading } = useQuery({ queryKey: ['projects'], queryFn: listProjects });
  const access = hasAccess(sub ?? null);

  const createMut = useMutation({
    mutationFn: (t: string) => createProject({ title: t, data: {} }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created.');
      setTitle('');
      setOpen(false);
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Could not create project.'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted.');
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Could not delete project.'),
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="lab-label text-safety">PROJECTS</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">Projects</h1>
          <p className="mt-1 text-ink-muted">Your ATLAS projects and agent runs.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={!access} className="bg-safety text-white hover:bg-safety/90">
              <Plus className="mr-2 h-4 w-4" /> New project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a project</DialogTitle>
              <DialogDescription>Give your ATLAS project a name to get started.</DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              placeholder="e.g. RNA folding sweep"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && title.trim()) createMut.mutate(title.trim());
              }}
            />
            <DialogFooter>
              <Button
                onClick={() => createMut.mutate(title.trim())}
                disabled={!title.trim() || createMut.isPending}
                className="bg-safety text-white hover:bg-safety/90"
              >
                {createMut.isPending ? 'Creating…' : 'Create project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!access && (
        <div className="flex items-center gap-3 border border-safety/30 bg-safety/[0.05] px-5 py-4 text-sm text-ink-muted">
          <Lock className="h-4 w-4 shrink-0 text-safety" />
          <span>
            {flags.selfServeBilling ? (
              <>
                Start a trial to create projects.{' '}
                <Link to="/app/billing" className="text-safety hover:underline">Choose a plan →</Link>
              </>
            ) : (
              <>
                Project access unlocks once your pilot engagement is set up.{' '}
                <Link to="/app/escrow" className="text-safety hover:underline">View your engagement →</Link>
              </>
            )}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-px border border-line bg-line">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse bg-panel" />
          ))}
        </div>
      ) : projects?.length ? (
        <ul className="border border-line">
          {projects.map((p: Project) => (
            <li key={p.id} className="flex items-center justify-between gap-4 border-b border-line bg-surface px-5 py-4 last:border-b-0">
              <div className="flex items-center gap-3">
                <FolderKanban className="h-5 w-5 text-ink" strokeWidth={1.5} />
                <div>
                  <p className="font-medium text-ink">{p.title}</p>
                  <p className="font-mono-tech text-[11px] text-ink-faint">
                    Created {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteMut.mutate(p.id)}
                disabled={deleteMut.isPending}
                className="rounded-md p-2 text-ink-faint transition-colors hover:bg-panel hover:text-safety"
                aria-label={`Delete ${p.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border border-dashed border-line px-6 py-16 text-center">
          <FolderKanban className="mx-auto h-10 w-10 text-ink-faint" strokeWidth={1.3} />
          <p className="mt-4 font-display text-lg text-ink">No projects yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            {access ? 'Create your first ATLAS project to get started.' : 'Start a trial to create your first project.'}
          </p>
        </div>
      )}
    </div>
  );
}
