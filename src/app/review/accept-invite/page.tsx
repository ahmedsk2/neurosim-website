import { SetPasswordForm } from '../_components/SetPasswordForm';

export const dynamic = 'force-dynamic';

// PUBLIC (no auth): an invited reviewer lands here from their one-time email link to choose a
// password and activate. An invalid/missing/expired/used token surfaces a single generic message
// (handled by the form + the API) rather than a 404, so the page itself never enumerates tokens.
export default async function AcceptInvitePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <div className="max-w-sm space-y-4">
      <h1 className="text-[15px] font-bold text-[#5eead4]">Activate your account</h1>
      <p className="text-[#94a3b8]">
        Welcome to the MNM-Edu Review Console. Choose a password to finish setting up your account.
      </p>
      <SetPasswordForm token={token ?? ''} endpoint="/api/reviewers/accept-invite/" cta="Activate account" />
    </div>
  );
}
