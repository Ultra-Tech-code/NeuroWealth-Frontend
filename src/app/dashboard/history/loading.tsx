import { TableSkeleton } from "@/components/ui/Skeleton";

export default function HistoryLoading() {
  return (
    <div className="px-6 pt-8" aria-busy="true" aria-label="Loading history">
      <div className="mb-4 h-8 w-24 animate-pulse rounded-lg bg-white/5" />
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
