'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const TOTAL_SECONDS = 45 * 60;

const SEGMENTS = [
  { label: 'Hook', start: 0, end: 3 * 60 },
  { label: 'Foundation', start: 3 * 60, end: 9 * 60 },
  { label: 'Toolkit', start: 9 * 60, end: 20 * 60 },
  { label: 'Maya', start: 20 * 60, end: 30 * 60 },
  { label: 'Yusuf', start: 30 * 60, end: 37 * 60 },
  { label: 'Pediatrics', start: 37 * 60, end: 42 * 60 },
  { label: 'Take-homes', start: 42 * 60, end: 45 * 60 },
];

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
}

export function LectureTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => Math.min(TOTAL_SECONDS, e + 1));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    // Stop the timer once it reaches the end. Intentional derived stop in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (elapsed >= TOTAL_SECONDS) setRunning(false);
  }, [elapsed]);

  const remaining = TOTAL_SECONDS - elapsed;
  const currentSeg = SEGMENTS.find((s) => elapsed >= s.start && elapsed < s.end) ?? SEGMENTS[SEGMENTS.length - 1];
  const progress = (elapsed / TOTAL_SECONDS) * 100;

  return (
    <div className="my-6 rounded-md border border-line bg-surface-deeper p-4" data-no-print>
      <div className="flex flex-wrap items-center gap-3">
        <Clock className="h-5 w-5 text-brand-tealLight" aria-hidden />
        <div className="flex flex-col">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim">
            Lecture timer
          </div>
          <div className="font-mono text-[20px] font-bold text-ink leading-tight">
            {fmt(elapsed)} <span className="text-ink-dim text-[14px]">/ 45:00</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="text-[11px] text-ink-dim">
            {currentSeg ? (
              <>
                Now: <span className="font-bold text-brand-tealLight">{currentSeg.label}</span> · {fmt(remaining)} remaining
              </>
            ) : (
              `${fmt(remaining)} remaining`
            )}
          </div>
          <Button
            variant="demo"
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? 'Pause timer' : 'Start timer'}
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? 'Pause' : elapsed === 0 ? 'Start' : 'Resume'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setRunning(false);
              setElapsed(0);
            }}
            aria-label="Reset timer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-card">
        <div
          className="h-full bg-brand-teal transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>

      <div className="mt-2 grid grid-cols-7 gap-0.5">
        {SEGMENTS.map((s) => {
          const active = elapsed >= s.start && elapsed < s.end;
          const done = elapsed >= s.end;
          return (
            <div
              key={s.label}
              className={cn(
                'rounded-sm px-1 py-0.5 text-center text-[9px] font-mono font-bold uppercase tracking-wider',
                active ? 'bg-brand-teal text-surface-darker' : done ? 'bg-status-good/30 text-status-good' : 'bg-surface-card text-ink-dim',
              )}
            >
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
