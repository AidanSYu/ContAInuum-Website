import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMyProfile, updateMyProfile } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SettingsPage() {
  const qc = useQueryClient();
  const { user, updatePassword } = useAuth();
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getMyProfile });

  // `null` means "not edited yet", fall back to the loaded profile name so the
  // input reflects server data without syncing state in an effect.
  const [edited, setEdited] = useState<string | null>(null);
  const fullName = edited ?? profile?.full_name ?? '';
  const [password, setPassword] = useState('');

  const profileMut = useMutation({
    mutationFn: (name: string) => updateMyProfile({ full_name: name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated.');
      setEdited(null); // fall back to the freshly-fetched profile value
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Could not update profile.'),
  });

  const passwordMut = useMutation({
    mutationFn: (pw: string) => updatePassword(pw),
    onSuccess: () => {
      toast.success('Password updated.');
      setPassword('');
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Could not update password.'),
  });

  return (
    <div className="max-w-2xl space-y-8">
      <div className="border-b border-line pb-6">
        <p className="lab-label text-safety">SETTINGS</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-ink-muted">Manage your account details.</p>
      </div>

      {/* Profile */}
      <section className="border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Profile</h2>
        <div className="mt-5 space-y-4">
          <div>
            <Label className="mb-2 block text-ink-muted">Email</Label>
            <Input value={user?.email ?? ''} disabled className="opacity-70" />
          </div>
          <div>
            <Label htmlFor="fullName" className="mb-2 block text-ink-muted">Full name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setEdited(e.target.value)} />
          </div>
          <Button
            onClick={() => profileMut.mutate(fullName.trim())}
            disabled={profileMut.isPending || !fullName.trim() || fullName.trim() === profile?.full_name}
            className="bg-safety text-white hover:bg-safety/90"
          >
            {profileMut.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </section>

      {/* Password */}
      <section className="border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Password</h2>
        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="newPassword" className="mb-2 block text-ink-muted">New password</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            onClick={() => passwordMut.mutate(password)}
            disabled={passwordMut.isPending || password.length < 8}
            className="bg-safety text-white hover:bg-safety/90"
          >
            {passwordMut.isPending ? 'Updating…' : 'Update password'}
          </Button>
        </div>
      </section>
    </div>
  );
}
