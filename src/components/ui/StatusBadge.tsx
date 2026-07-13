import { Badge } from "@/components/ui/badge";
import { EntryStatus } from "@/lib/api/entries";

const STATUS_STYLES: Record<EntryStatus, string> = {
  submitted: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({ status }: { status: EntryStatus }) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {status}
    </Badge>
  );
}
