import type { GLRow, LedgerAccount } from "../../types/generalLedger";

interface AccountBalanceChartProps {
  rows: GLRow[];
  accounts: LedgerAccount[];
}

export default function AccountBalanceChart({ rows, accounts }: AccountBalanceChartProps) {
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  const totals = new Map<number, { debit: number; credit: number }>();
  for (const row of rows) {
    const existing = totals.get(row.accountId) ?? { debit: 0, credit: 0 };
    existing.debit += row.debit;
    existing.credit += row.credit;
    totals.set(row.accountId, existing);
  }

  const bars = Array.from(totals.entries())
    .map(([accountId, t]) => {
      const acc = accountMap.get(accountId);
      const netAbs = acc?.normal_balance === "DEBIT" ? t.debit - t.credit : t.credit - t.debit;
      return { accountId, name: acc?.account_name ?? "Unknown", code: acc?.account_code ?? "", net: netAbs };
    })
    .sort((a, b) => Math.abs(b.net) - Math.abs(a.net))
    .slice(0, 8);

  const maxAbs = Math.max(1, ...bars.map((b) => Math.abs(b.net)));

  if (bars.length === 0) {
    return <p className="text-xs text-text-muted">No data to chart for the current filters.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {bars.map((b) => {
        const widthPct = (Math.abs(b.net) / maxAbs) * 100;
        const isNegative = b.net < 0;
        return (
          <div key={b.accountId} className="flex items-center gap-3">
            <div className="w-40 shrink-0 truncate text-xs text-text-muted" title={b.name}>
              {b.code} · {b.name}
            </div>
            <div className="flex-1">
              <div className="h-4 w-full overflow-hidden rounded-full bg-background">
                <div
                  className={`h-full rounded-full ${isNegative ? "bg-danger/70" : "bg-primary"}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
            <div className={`w-24 shrink-0 text-right text-xs font-medium ${isNegative ? "text-danger" : "text-secondary"}`}>
              {b.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        );
      })}
    </div>
  );
}