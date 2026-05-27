import { SetPasswordForm } from '../_components/SetPasswordForm';

export const dynamic = 'force-dynamic';

// PUBLIC (no auth): a reviewer lands here from a one-time password-reset email link to set a new
// password. Same generic-error behavior as accept-invite (no token enumeration). Redeeming does
// NOT change isActive, so a reset link cannot reactivate a deactivated account.
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <div className="max-w-sm space-y-4">
      <h1 className="text-[15px] font-bold text-[#5eead4]">Reset your password</h1>
      <p className="text-[#94a3b8]">Choose a new password for your MNM-Edu Review Console account.</p>
      <SetPasswordForm token={token ?? ''} endpoint="/api/reviewers/reset-password/" cta="Set new password" />
    </div>
  );
}
