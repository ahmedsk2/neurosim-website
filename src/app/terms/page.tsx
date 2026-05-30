import { PageHeader } from '@/components/layout/PageScaffold';

export const metadata = {
  title: 'Terms of use',
  alternates: { canonical: '/terms/' },
};

export default function TermsPage() {
  return (
    <div className="prose-mnm prose-wide">
      <PageHeader
        eyebrow="Terms"
        title="Terms of use"
        description="The rules for using MNM-Edu."
      />

      <p className="text-[12.5px] text-ink-muted">
        Effective date: 2026-05-30.
      </p>

      <h2>1. Acceptance of these terms</h2>
      <p>
        By accessing or using <strong>MNM-Edu</strong> (the website at{' '}
        <code>mnm.towardpcc.com</code>) you agree to these Terms of Use and to the{' '}
        <a href="/privacy/">Privacy Policy</a>. If you do not agree, please do not use the site.
      </p>

      <h2>2. What this site is</h2>
      <p>
        MNM-Edu is an <strong>educational resource</strong> on pediatric multimodal
        neuromonitoring, created and maintained by <strong>Ahmed S. Alkhalifah, MD, MBBS</strong>{' '}
        (the named author). It is an independent personal educational project, not affiliated
        with, endorsed by, or representing any hospital, university, professional society, or
        employer. Further background is on the <a href="/about/">About</a> page.
      </p>

      <h2>3. Medical disclaimer</h2>
      <p>
        <strong>MNM-Edu is an educational resource. It is NOT clinical advice and NOT a
        substitute for clinical judgement, formal training, or local protocols.</strong>
      </p>
      <p>
        Do not use any content on this site to drive a direct patient-care decision. Specific
        monitoring thresholds, drug doses, escalation pathways, and physiological interpretations
        must be cross-checked against the primary literature and your institution&apos;s
        protocols, and applied to the patient in front of you by the team responsible for that
        patient. Pediatric MNM evidence is, on the whole, low-grade and rapidly evolving; we make
        the evidence quality visible on each page rather than burying it.
      </p>
      <p>
        Use of this site does not create a doctor-patient relationship, a teacher-student
        relationship, or any professional relationship between you and the author.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree that you will not:</p>
      <ul>
        <li>
          Use the site in any way that is unlawful, harmful, or violates the rights of others.
        </li>
        <li>
          Attempt to scrape, crawl, or systematically copy the site in ways that the
          <code>robots.txt</code> file prohibits, or in ways that materially burden the server.
          Reasonable individual browsing, downloading pages for personal study, and citing the
          site are not in scope of this restriction.
        </li>
        <li>
          Attempt to bypass authentication, probe the reviewer system, or access reviewer routes
          you have not been invited to.
        </li>
        <li>
          Submit malicious content (malware, code, abusive material) through any input on the
          site.
        </li>
        <li>
          Misrepresent the site as endorsed by an institution it is not affiliated with.
        </li>
      </ul>
      <p>
        The reviewer system at <code>/review/</code> is invitation-only; there is no public signup.
        Attempts to register for or break into the reviewer system are out of scope of acceptable
        use.
      </p>

      <h2>5. Intellectual property and license</h2>
      <ul>
        <li>
          <strong>Educational content</strong> (the prose, diagrams, and structure of the
          educational pages) is licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noopener noreferrer">
            <strong>Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</strong>
          </a>{' '}
          unless otherwise noted on the page or figure. You are free to share and adapt the
          content with attribution and the same license.
        </li>
        <li>
          <strong>Source code</strong> for the site is licensed under the <strong>MIT License</strong>.
        </li>
        <li>
          <strong>Third-party figures and images</strong> appear with their own attributions next
          to the figure; those carry their own licenses (typically open-licence, see the{' '}
          <a href="/figure-credits/">Figure credits</a> page).
        </li>
        <li>
          Trademarks, product names, and brand names mentioned for educational purposes belong to
          their respective owners.
        </li>
      </ul>

      <h2>6. Content you submit (reviewers)</h2>
      <p>
        If you are an invited reviewer and submit findings, comments, or attachments through the
        reviewer system, you confirm that:
      </p>
      <ul>
        <li>You have the right to submit that content.</li>
        <li>
          The content does not include identifiable patient information (no PHI). The reviewer
          system is for educational improvement of the published content, not for clinical
          records.
        </li>
        <li>
          You grant the named author a non-exclusive licence to use, store, display, and act on
          your submissions for the purpose of improving MNM-Edu, including the operational
          audit-trail retention described in the Privacy Policy.
        </li>
      </ul>

      <h2>7. Disclaimer of warranties</h2>
      <p>
        The site and all content are provided <strong>&quot;as is&quot;</strong> and{' '}
        <strong>&quot;as available&quot;</strong> for educational purposes. To the maximum extent
        permitted by law, the named author disclaims all warranties of any kind, whether express
        or implied, including but not limited to warranties of merchantability, fitness for a
        particular purpose, accuracy, completeness, currency, non-infringement, and freedom from
        errors or interruption. Medical knowledge changes; pages may be out of date.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, in no event shall the named author be liable for
        any direct, indirect, incidental, consequential, special, exemplary, or punitive damages
        arising out of or in connection with your use of MNM-Edu, including but not limited to
        clinical decisions made or influenced by site content, loss of data, or service
        interruption, even if advised of the possibility of such damages. If liability cannot be
        excluded under applicable law, it is limited to the maximum extent permitted by that law.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless the named author from any claim, loss, or
        expense (including reasonable legal fees) arising from your misuse of the site, your
        breach of these terms, or your violation of any law or third-party right in connection
        with your use of the site.
      </p>

      <h2>10. Third-party services and links</h2>
      <p>
        The site is fronted by Cloudflare, hosted by <strong>Infomaniak</strong> (Switzerland),
        uses Google Analytics for consented public analytics, and links to external resources
        (journal DOIs, open-access articles, vendor documentation). The named author is not
        responsible for the content, availability, or privacy practices of third-party services
        or sites.
      </p>

      <h2>11. Suspension and changes</h2>
      <p>
        The named author may modify, suspend, or discontinue MNM-Edu or any part of it at any
        time, with or without notice. Reviewer access may be suspended at the author&apos;s
        discretion (with cause), most commonly for inactivity or for violation of these terms.
      </p>

      <h2>12. Governing law and jurisdiction</h2>
      <p>
        These terms are governed by the laws of Ontario, Canada, and the federal laws of Canada
        applicable therein. Any dispute will be subject to the exclusive jurisdiction of the
        courts of Ontario, Canada.
      </p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be reflected in the
        effective date at the top of this page. Continued use of the site after a change is
        effective constitutes acceptance of the updated Terms.
      </p>

      <h2>14. Severability</h2>
      <p>
        If any provision of these Terms is found unenforceable, the remaining provisions remain in
        full force and effect.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these terms: <a href="mailto:info@towardpcc.com">info@towardpcc.com</a>.
      </p>
    </div>
  );
}
