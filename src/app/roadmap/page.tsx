import { PageHeader } from '@/components/layout/PageScaffold';
import { Card, Callout } from '@/components/ui';
import { Wrench, Sparkles, Globe2, Users, BookOpen, Stethoscope, Settings } from 'lucide-react';

export const metadata = {
  title: 'Roadmap and future work',
  description:
    'Future work items planned for MNM-Edu, author tooling, content gaps, infrastructure, and clinical features. A living list.',
};

interface RoadmapItem {
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'idea';
  priority: 'high' | 'medium' | 'low';
}

interface RoadmapSection {
  title: string;
  Icon: typeof Wrench;
  intro: string;
  items: RoadmapItem[];
}

const SECTIONS: RoadmapSection[] = [
  {
    title: 'Author tooling',
    Icon: Wrench,
    intro: 'Make the site easy to maintain and extend without engineer involvement.',
    items: [
      {
        title:
          'Robust authoring mechanism for editing, updating, and adding text, images, and figures',
        description:
          "Build (or integrate) a content-management interface so non-developer clinicians can author and revise foundation chapters, modality pages, integration scenarios, references, glossary entries, age-band normative values, and figures (SVG schematics + externally-sourced images via SourcedFigure). Should support: live preview, versioning / change history, draft → review → publish workflow, structured editors for the typed data files (modalities, integration cases, references, pediatric norms, symptom map), an image upload / curation flow that enforces the licence-attribution contract, and a permissions model so multiple contributors can work in parallel without collision. Candidate approaches: a Git-backed CMS (Decap CMS / Sveltia), a TinaCMS-style inline editor, or a custom admin UI built on the existing typed schemas.",
        status: 'planned',
        priority: 'high',
      },
      {
        title: 'Style guide + contributor checklist',
        description:
          'Document the writing voice, citation style, evidence-grading conventions, and the figure / SourcedFigure attribution contract so contributors know the bar before they start.',
        status: 'planned',
        priority: 'medium',
      },
    ],
  },
  {
    title: 'Content gaps',
    Icon: BookOpen,
    intro: 'Topics flagged as missing or thin during clinical review.',
    items: [
      {
        title: 'Sinovenous thrombosis (CSVT), modality + integration scenario',
        description:
          'Pediatric CSVT is on the differential alongside AIS but has its own monitoring needs (D-dimer, MR-venography, anticoagulation surveillance).',
        status: 'planned',
        priority: 'medium',
      },
      {
        title: 'Pre-hospital and inter-hospital transport monitoring',
        description:
          'How MNM signals carry (or fail) during retrieval, what to set up before transfer, what to watch en route, what to hand over on arrival.',
        status: 'planned',
        priority: 'medium',
      },
      {
        title: 'Substance overdose / toxidrome neuro-monitoring',
        description:
          'Opioid, sympathomimetic, anticholinergic, and serotonergic presentations affect pupillometry, NIRS, EEG and clinical exam in characteristic ways. A short scenario would round out the differential coverage.',
        status: 'idea',
        priority: 'low',
      },
      {
        title: 'Palliative-care neuromonitoring framework',
        description:
          'When the goal of care is comfort, MNM use changes, when to remove vs. retain monitors, how to interpret residual signals, family communication framing.',
        status: 'idea',
        priority: 'low',
      },
    ],
  },
  {
    title: 'Clinical / pedagogical features',
    Icon: Stethoscope,
    intro: 'Features that improve teaching value at the bedside or in lectures.',
    items: [
      {
        title: 'Audio summary per page',
        description:
          'Five-minute spoken summaries (TTS or recorded) for fellows commuting / on shift. Pairs with the existing TLDR cards.',
        status: 'planned',
        priority: 'medium',
      },
      {
        title: 'Self-quizzing dashboard',
        description:
          'Pull existing per-page Quiz components into a unified dashboard, track which a fellow has attempted, spaced-repetition prompts, exportable certificate of completion.',
        status: 'planned',
        priority: 'medium',
      },
      {
        title: 'Bedside trace replay tool',
        description:
          'Upload a real (de-identified) ICM+ / Moberg / NicoletOne export and replay it through the discordance-triage framework. Hands-on equivalent of the synthetic CPPopt widget.',
        status: 'idea',
        priority: 'medium',
      },
      {
        title: 'Pediatric ETT / vasopressor / inotrope dose calculators',
        description:
          'Extend the existing PediatricDoseCalculator beyond neuro-emergencies into the full PICU resuscitation set.',
        status: 'planned',
        priority: 'low',
      },
    ],
  },
  {
    title: 'Internationalisation &amp; reach',
    Icon: Globe2,
    intro: 'The site is English-only by design today. Future work would broaden access.',
    items: [
      {
        title: 'French and Arabic translations of foundation + quick-card pages',
        description:
          'Highest-impact starting set. Translation infrastructure was built and removed earlier, would need to be re-added together with an authoring workflow that keeps translations in sync.',
        status: 'idea',
        priority: 'medium',
      },
      {
        title: 'Region-specific dose / threshold variants',
        description:
          'Pediatric formularies differ across regions. A "region picker" that swaps default doses, sodium ceilings, and monitoring thresholds per local guideline (UK PICS, ANZICS, ESPNIC, AAP).',
        status: 'idea',
        priority: 'low',
      },
    ],
  },
  {
    title: 'Community',
    Icon: Users,
    intro: 'Let users contribute back, find issues, and request changes.',
    items: [
      {
        title: 'Inline "suggest an edit" + issue tracker',
        description:
          'Per-page button that opens a pre-filled GitHub issue or a built-in feedback form, so clinical reviewers can flag inaccuracies, dead references, or missing pediatric caveats.',
        status: 'planned',
        priority: 'high',
      },
      {
        title: 'Reference freshness automation',
        description:
          'CI job that checks for newer publications on key topics and flags references older than a configurable threshold for re-review.',
        status: 'idea',
        priority: 'medium',
      },
    ],
  },
  {
    title: 'Infrastructure',
    Icon: Settings,
    intro: 'Quality, accessibility, and developer-experience tasks.',
    items: [
      {
        title: 'Restore PWA + offline support to current spec',
        description:
          'Service worker exists; refresh the cache strategy for the new pages and the larger SVG illustrations, and verify offline behaviour on a clean install.',
        status: 'planned',
        priority: 'medium',
      },
      {
        title: 'Full axe-core a11y sweep across new pages',
        description:
          'The earlier audit covered 12 routes; the site now has 68. Re-run on the new scenarios + quick-card + teach pages, fix any contrast / aria gaps.',
        status: 'planned',
        priority: 'medium',
      },
      {
        title: 'Visual-regression snapshots of upgraded SVGs',
        description:
          'Lock the upgraded illustrations into a Playwright snapshot suite so unintentional layout regressions are caught at PR time.',
        status: 'planned',
        priority: 'low',
      },
    ],
  },
];

const STATUS_STYLE: Record<RoadmapItem['status'], { label: string; cls: string }> = {
  planned: { label: 'Planned', cls: 'bg-brand-teal/15 text-brand-tealLight border-brand-teal/40' },
  'in-progress': {
    label: 'In progress',
    cls: 'bg-brand-amber/15 text-brand-amber border-brand-amber/40',
  },
  idea: { label: 'Idea', cls: 'bg-brand-purple/15 text-brand-purple border-brand-purple/40' },
};

const PRIORITY_DOT: Record<RoadmapItem['priority'], string> = {
  high: 'bg-status-danger',
  medium: 'bg-brand-amber',
  low: 'bg-ink-dim',
};

export default function RoadmapPage() {
  return (
    <div className="prose-mnm prose-wide">
      <PageHeader
        eyebrow="Roadmap"
        title="Future work"
        description="A living list of features, content gaps, and infrastructure work. Items are grouped by theme and tagged with status (planned / in-progress / idea) and priority."
      />

      <Callout type="real-world" title="How to read this list">
        <p className="m-0">
          Items here are not commitments, they are public ideas, sequenced roughly by impact. The
          highest-priority item is at the top of <strong>Author tooling</strong>: building a robust
          mechanism so clinicians (not engineers) can edit and extend the site directly. If
          you&apos;d like to contribute or sponsor any item, open an issue on the repo or contact
          the maintainer.
        </p>
      </Callout>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px]">
        <span className="font-bold uppercase tracking-[0.16em] text-ink-dim">Legend:</span>
        {(['planned', 'in-progress', 'idea'] as const).map((s) => (
          <span
            key={s}
            className={
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold ' +
              STATUS_STYLE[s].cls
            }
          >
            {STATUS_STYLE[s].label}
          </span>
        ))}
        <span className="ml-2 text-ink-dim">priority:</span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-status-danger" /> high
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-brand-amber" /> medium
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-ink-dim" /> low
        </span>
      </div>

      {SECTIONS.map((section) => {
        const Icon = section.Icon;
        return (
          <section key={section.title} className="mt-8">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="h-5 w-5 text-brand-tealLight" aria-hidden />
              <h2 className="m-0 text-[20px] font-bold leading-tight">{section.title}</h2>
            </div>
            <p className="m-0 text-[13px] text-ink-muted">{section.intro}</p>

            <div className="mt-3 space-y-3">
              {section.items.map((item) => (
                <Card key={item.title} className="!my-0">
                  <div className="flex items-start gap-3">
                    <span
                      className={
                        'mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full ' +
                        PRIORITY_DOT[item.priority]
                      }
                      aria-label={`${item.priority} priority`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="m-0 text-[14.5px] font-bold text-ink leading-snug">
                          {item.title}
                        </h3>
                        <span
                          className={
                            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ' +
                            STATUS_STYLE[item.status].cls
                          }
                        >
                          {STATUS_STYLE[item.status].label}
                        </span>
                      </div>
                      <p className="m-0 text-[12.5px] text-ink/85 leading-[1.6]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      <Callout type="teaching" title="Suggest an item">
        <p className="m-0">
          This list is meant to be added to. If you&apos;ve spotted a gap during teaching or at the
          bedside, a missing scenario, a pediatric caveat that should be louder, an integration the
          site doesn&apos;t cover, open an issue or send a pull request adding the item to{' '}
          <code>src/app/roadmap/page.tsx</code>.
        </p>
      </Callout>

      <div className="mt-6 flex items-center gap-2 text-[11px] text-ink-dim">
        <Sparkles className="h-3.5 w-3.5" />
        Last updated: <span className="font-mono">2026-05-10</span>
      </div>
    </div>
  );
}
