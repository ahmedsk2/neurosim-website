import { PageHeader } from '@/components/layout/PageScaffold';

export const metadata = {
  title: 'Privacy policy',
  alternates: { canonical: '/privacy/' },
};

export default function PrivacyPage() {
  return (
    <div className="prose-mnm prose-wide">
      <PageHeader
        eyebrow="Privacy"
        title="Privacy policy"
        description="How MNM-Edu handles personal data."
      />

      <p className="text-[12.5px] text-ink-muted">
        Effective date: 2026-05-30.
      </p>

      <h2>1. Who we are</h2>
      <p>
        MNM-Edu is an <strong>independent personal educational project</strong> created and
        maintained by <strong>Ahmed S. Alkhalifah, MD, MBBS</strong>, a pediatric intensivist with
        subspecialty training in neurocritical care. The project is operated from Canada and is not
        affiliated with, endorsed by, or representing any hospital, university, professional
        society, or employer. For the purposes of this policy, the data controller is the named
        author. Privacy contact:{' '}
        <a href="mailto:info@towardpcc.com">info@towardpcc.com</a>.
      </p>

      <h2>2. What this policy covers</h2>
      <p>
        This policy explains what personal information MNM-Edu collects, how it is used, who it is
        shared with, how long it is kept, and how to contact us about it. It applies to the public
        educational site at <code>mnm.towardpcc.com</code> and to the reviewer system that lives
        under <code>/review/</code> on the same domain.
      </p>

      <h2>3. Public visitors (the educational pages)</h2>
      <p>
        The public site exists to read. You can use every page without creating an account.
      </p>
      <ul>
        <li>
          <strong>No login or account is required</strong> to read the educational content.
        </li>
        <li>
          <strong>No cookies are set on public pages</strong> until you give consent for analytics
          (see &quot;Cookies&quot; below). The site stores your dark/light theme preference in
          <code>localStorage</code> on your device; this is not a cookie and is not transmitted to
          the server.
        </li>
        <li>
          <strong>Google Analytics</strong> (when enabled, and only after you give consent through
          the cookie banner) collects standard web analytics: page views, referrer, approximate
          location (city/region inferred from the IP, which is anonymized before storage in our
          configuration), device and browser type, and time on page. We do not enable Google
          Analytics&apos; advertising features and do not share data for ad personalization.
        </li>
        <li>
          <strong>Server logs and Cloudflare</strong>: your IP address, request URL, user agent,
          and timestamp are processed transiently for service delivery, security (rate-limiting,
          DDoS protection), and debugging by Cloudflare (which proxies all traffic) and by the
          hosting platform. These logs are retained for a short operational period and are not
          used to build a profile of you.
        </li>
      </ul>

      <h2>4. Reviewers (the authenticated minority)</h2>
      <p>
        The reviewer system at <code>/review/</code> is invitation-only and is used by a small
        group of clinical reviewers who provide feedback on the educational content. For reviewers,
        we collect and store:
      </p>
      <ul>
        <li>
          <strong>Account information</strong>: name, email address (used as the login identity),
          a bcrypt hash of your password (never the password itself), role
          (validator / admin / implementer / observer), and optional self-supplied fields
          (specialty, credentials, conflict-of-interest disclosure).
        </li>
        <li>
          <strong>Content you submit</strong>: review findings (title, detail, severity, category,
          suggested fix), comments on findings, screenshot attachments you upload, and metadata
          about which page and section the finding applies to.
        </li>
        <li>
          <strong>Audit trail</strong>: an append-only log of actions you take in the reviewer
          system (filed, status changes, comments, deletions). This is the governance value of the
          system and is retained for the integrity of the review record.
        </li>
        <li>
          <strong>Session</strong>: when you log in, a session cookie is set so you stay signed in.
          Sessions expire and can be revoked by signing out or by an admin deactivating your account.
        </li>
        <li>
          <strong>Notification metadata</strong>: when an admin emails you about a finding, we
          record the fact that an email was sent (recipient, subject, status at send), but never
          the body. The email itself goes through our SMTP provider.
        </li>
      </ul>
      <p>
        Reviewer accounts are not for the public; there is no signup form. Reviewer access also
        passes a Cloudflare Access challenge (email allow-list at the edge) before reaching the
        login page.
      </p>

      <h2>5. Cookies and similar technologies</h2>
      <ul>
        <li>
          <strong>Essential session cookies (reviewers only)</strong>: set by the authentication
          system when a reviewer signs in. Required for the reviewer workflow to function. Not set
          for public visitors.
        </li>
        <li>
          <strong>Analytics cookies (public, consent-gated)</strong>: Google Analytics sets
          first-party cookies (<code>_ga</code>, <code>_ga_*</code>) when, and only when, you accept
          analytics in the consent banner. Declining the banner means GA is not loaded at all and
          no analytics cookies are set. You can change your choice at any time using the
          &quot;Cookie settings&quot; link in the footer.
        </li>
        <li>
          <strong>localStorage (not a cookie)</strong>: your dark/light theme preference is stored
          in your browser&apos;s <code>localStorage</code>. It is not transmitted to the server
          and is not used to identify you.
        </li>
      </ul>

      <h2>6. Third parties that process data</h2>
      <ul>
        <li>
          <strong>Cloudflare</strong>: proxies all traffic to the site and provides DDoS protection,
          CDN, and (for the reviewer surface) access control. Receives IP and request metadata.
        </li>
        <li>
          <strong>Hosting platform</strong>: hosts the application, the MySQL/MariaDB database,
          and the attachment storage. The provider is <strong>Infomaniak</strong> (a Swiss managed-
          hosting company, based in Switzerland within the European Economic Area). Receives all
          data the application processes.
        </li>
        <li>
          <strong>Google (Analytics)</strong>: when a public visitor consents to analytics,
          Google receives the analytics events described above. Google processes this data on its
          standard infrastructure, primarily in the United States.
        </li>
        <li>
          <strong>SMTP email provider</strong>: when a reviewer is notified about a finding by
          email, our configured SMTP provider transmits the message. The provider sees the
          recipient&apos;s email address, the subject, and the message body for the period required
          to deliver it.
        </li>
        <li>
          <strong>GitHub</strong>: the educational content and the application source code live in
          a public GitHub repository; reviewer data does NOT live in GitHub.
        </li>
      </ul>

      <h2>7. Data retention</h2>
      <ul>
        <li>
          <strong>Public-side analytics</strong>: per Google Analytics&apos; default retention
          window for the property.
        </li>
        <li>
          <strong>Reviewer accounts</strong>: retained while the account is active. Deactivated
          accounts are retained because their audit-trail entries are referenced by other records.
          Deletion on request is supported in principle; see section 9.
        </li>
        <li>
          <strong>Findings and audit trail</strong>: retained for the integrity of the review
          record. Soft-deleted findings remain in the database with a deletion marker so the
          audit chain stays intact; they are not visible to reviewers.
        </li>
        <li>
          <strong>Backups</strong>: encrypted backups of the database are taken on a routine
          cadence and retained for a short rolling window.
        </li>
      </ul>

      <h2>8. Where the data is stored and processed</h2>
      <p>
        The application and its database are hosted by <strong>Infomaniak</strong> in{' '}
        <strong>Switzerland</strong> (within the European Economic Area). Cloudflare may process
        traffic at edge locations worldwide. Google Analytics (when consented) processes data
        primarily in the United States on Google&apos;s standard infrastructure.
      </p>

      <h2>9. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to: access the personal information
        we hold about you; have inaccurate information corrected; have your information deleted in
        certain circumstances; restrict or object to certain processing; withdraw consent (for
        analytics, this is the cookie banner&apos;s decline option); and lodge a complaint with
        your local data-protection authority.
      </p>
      <p>
        To exercise any of these rights, email <a href="mailto:info@towardpcc.com">info@towardpcc.com</a>.
        Because this is a personal project run alongside clinical work, response is best-effort
        but taken seriously.
      </p>

      <h2>10. Security</h2>
      <p>
        We take reasonable measures appropriate to the scale of this project: HTTPS everywhere,
        a strict Content-Security-Policy, security response headers, AES-256-GCM encryption of the
        outbound email credential at rest, bcrypt password hashing for reviewer accounts, and an
        email allow-list (Cloudflare Access) in front of the reviewer login. No system is
        absolutely secure; we cannot guarantee that data will never be compromised.
      </p>

      <h2>11. Children</h2>
      <p>
        MNM-Edu is intended for clinicians and trainees. It is not directed to children, does not
        knowingly collect personal information from children, and does not advertise to children.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be reflected in the
        effective date at the top, and (for significant changes) in a note on the home page or via
        direct email to reviewers.
      </p>

      <h2>13. Contact</h2>
      <p>
        For privacy questions, access requests, or complaints:{' '}
        <a href="mailto:info@towardpcc.com">info@towardpcc.com</a>. If you are not satisfied with
        our response, you may contact your local data-protection authority - for example, the
        Office of the Privacy Commissioner of Canada, the Commission d&apos;acc&egrave;s &agrave;
        l&apos;information du Qu&eacute;bec, the UK Information Commissioner&apos;s Office (ICO),
        or the relevant EU Data Protection Authority.
      </p>
    </div>
  );
}
