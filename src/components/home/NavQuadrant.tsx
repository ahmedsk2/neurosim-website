import Link from 'next/link';
import { ArrowRight, Activity, Microscope, Workflow, Baby } from 'lucide-react';
import { Card } from '@/components/ui';

const cards = [
  {
    href: '/foundations/',
    eyebrow: 'Foundations',
    title: 'Cerebral physiology, primer',
    desc: 'Autoregulation, CO₂/O₂ reactivity, the Monro-Kellie doctrine, the Marmarou pressure-volume curve, the Astrup ischemic cascade, spreading depolarisations. Nine compact chapters.',
    icon: Activity,
  },
  {
    href: '/modalities/',
    eyebrow: 'Modalities',
    title: '24 monitors, one template',
    desc: 'Each modality opens with the bedside view, walks through the physical signal, links physiology to a hands-on widget, and ends with pediatric-specific evidence and recent literature.',
    icon: Microscope,
  },
  {
    href: '/integration/',
    eyebrow: 'Integration',
    title: 'When monitors disagree',
    desc: 'Eighteen clinical scenarios where two or three modalities tell different stories. Walk through the discordance, learn the heuristics, and try the decision points.',
    icon: Workflow,
  },
  {
    href: '/pediatrics/',
    eyebrow: 'Pediatrics',
    title: 'Newborn to adolescent',
    desc: 'Age-band normative values for HR, MAP, ICP, CPP target, NIRS rSO₂, TCD MFV, NPi, and ONSD, with explicit evidence-sparseness flags everywhere data are thin.',
    icon: Baby,
  },
];

export function NavQuadrant() {
  return (
    <section aria-labelledby="nav-quadrant-title" className="py-2">
      <h2 id="nav-quadrant-title" className="sr-only">
        Four entry points into the site
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href} className="group">
              <Card className="h-full transition-colors hover:border-brand-teal">
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-brand-teal" aria-hidden />
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-tealLight">
                    {c.eyebrow}
                  </div>
                </div>
                <div className="mb-2 text-[16px] font-bold text-ink group-hover:text-brand-tealLight">
                  {c.title}
                </div>
                <div className="text-[12.5px] leading-[1.55] text-ink/85">{c.desc}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-tealLight">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
