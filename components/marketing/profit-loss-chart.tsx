import { ChartSpline } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { profitLossFixtures } from "@/lib/data/fixtures";

const maxMove = Math.max(...profitLossFixtures.map((item) => Math.abs(item.rMultiple)));
const netMove = profitLossFixtures.reduce((sum, item) => sum + item.rMultiple, 0);
const winCount = profitLossFixtures.filter((item) => item.rMultiple > 0).length;

export function ProfitLossChart() {
  return (
    <Card className="border-[rgba(255,209,102,0.34)]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Badge tone="info">Demo P/L Chart</Badge>
          <h3 className="mt-4 text-2xl font-black">Profit and loss journal view.</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Sample R-multiple chart for website layout only. Replace with verified, approved records before production.
          </p>
        </div>
        <ChartSpline aria-hidden className="h-8 w-8 shrink-0 text-[var(--premium)]" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="line-tile p-3">
          <p className="text-xs font-bold uppercase text-[var(--muted)]">Demo net</p>
          <p className="mt-1 text-2xl font-black text-[var(--primary)]">+{netMove.toFixed(1)}R</p>
        </div>
        <div className="line-tile p-3">
          <p className="text-xs font-bold uppercase text-[var(--muted)]">Positive months</p>
          <p className="mt-1 text-2xl font-black">{winCount}/{profitLossFixtures.length}</p>
        </div>
        <div className="line-tile p-3">
          <p className="text-xs font-bold uppercase text-[var(--muted)]">Status</p>
          <p className="mt-1 text-sm font-black text-[var(--premium)]">Pending live data</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="grid h-64 grid-rows-2 overflow-hidden border border-[var(--border)] bg-[rgba(255,255,255,0.025)]">
          <div className="grid grid-cols-8 items-end gap-2 border-b border-[rgba(255,209,102,0.28)] px-3 pt-4">
            {profitLossFixtures.map((item) => (
              <span
                aria-hidden
                className="block min-h-1 bg-[linear-gradient(180deg,#b7f3df,#25b88a)]"
                key={`${item.period}-profit`}
                style={{ height: item.rMultiple > 0 ? `${(item.rMultiple / maxMove) * 92}%` : 0 }}
              />
            ))}
          </div>
          <div className="grid grid-cols-8 items-start gap-2 px-3 pb-4">
            {profitLossFixtures.map((item) => (
              <span
                aria-hidden
                className="block min-h-1 bg-[linear-gradient(180deg,#ff6b45,#8f2f1b)]"
                key={`${item.period}-loss`}
                style={{ height: item.rMultiple < 0 ? `${(Math.abs(item.rMultiple) / maxMove) * 92}%` : 0 }}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-8 gap-2 px-3 text-center text-[10px] font-bold uppercase text-[var(--muted)]">
          {profitLossFixtures.map((item) => (
            <span key={item.period}>{item.period}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}
