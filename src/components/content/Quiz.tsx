'use client';

import { useState, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  answer: string;
  explanation: ReactNode;
}

export function Quiz({
  title = 'Retrieval check',
  questions,
}: {
  title?: string;
  questions: QuizQuestion[];
}) {
  return (
    <section className="my-8 rounded-lg border border-line bg-surface-deeper p-4 md:p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-amber mb-3">
        {title}
      </div>
      <div className="space-y-5">
        {questions.map((q) => (
          <QuestionItem key={q.id} q={q} />
        ))}
      </div>
    </section>
  );
}

function QuestionItem({ q }: { q: QuizQuestion }) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === q.answer;

  return (
    <div className="">
      <div className="text-[14px] text-ink mb-2 leading-[1.5]">{q.prompt}</div>
      <div className="grid gap-1.5">
        {q.options.map((o) => {
          const isPicked = picked === o.id;
          const isAnswer = q.answer === o.id;
          const showResult = picked != null;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setPicked(o.id)}
              disabled={picked != null}
              className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2 text-left text-[13px] transition-colors',
                'border-line bg-surface-card hover:border-brand-teal',
                showResult && isPicked && correct && 'border-status-good bg-status-good/10',
                showResult && isPicked && !correct && 'border-status-danger bg-status-danger/10',
                showResult && !isPicked && isAnswer && 'border-status-good',
              )}
            >
              {showResult && isAnswer && (
                <Check className="h-4 w-4 text-status-good" aria-hidden />
              )}
              {showResult && isPicked && !correct && (
                <X className="h-4 w-4 text-status-dangerText" aria-hidden />
              )}
              <span className="flex-1">{o.label}</span>
            </button>
          );
        })}
      </div>
      {picked != null && (
        <div className="mt-2 rounded-md border-l-[3px] border-l-brand-purple bg-surface-deeper px-3 py-2 text-[12.5px] text-ink/90 leading-[1.55]">
          <strong className="text-brand-purple">Why:</strong> {q.explanation}
        </div>
      )}
    </div>
  );
}
