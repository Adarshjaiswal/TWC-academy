import { Card } from "@/components/ui/card";

export function AdminTable({
  title,
  description,
  columns,
  rows
}: {
  title: string;
  description: string;
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <Card>
      <h1 className="text-4xl font-black">{title}</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">{description}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-[var(--muted)]">
            <tr>
              {columns.map((column) => <th className="py-3" key={column}>{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row, index) => (
              <tr className="border-t border-[var(--border)]" key={index}>
                {row.map((cell, cellIndex) => <td className="py-3 pr-4" key={cellIndex}>{cell}</td>)}
              </tr>
            )) : (
              <tr><td className="py-4 text-[var(--muted)]" colSpan={columns.length}>No records available. Seed the database to view demo data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
