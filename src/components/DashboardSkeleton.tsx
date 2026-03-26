import { motion } from "framer-motion";

const DashboardSkeleton = () => {
  const shimmer = "animate-pulse bg-muted rounded-lg";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className={`${shimmer} h-8 w-64`} />
          <div className={`${shimmer} h-4 w-48`} />
        </div>
        <div className={`${shimmer} h-10 w-40`} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-6 space-y-3"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex justify-between">
              <div className={`${shimmer} h-4 w-24`} />
              <div className={`${shimmer} h-10 w-10 rounded-xl`} />
            </div>
            <div className={`${shimmer} h-9 w-16`} />
            <div className={`${shimmer} h-2 w-full`} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className={`${shimmer} h-5 w-40`} />
            <div className={`${shimmer} h-[260px] w-full`} />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="px-6 py-4 border-b border-border">
          <div className={`${shimmer} h-5 w-48`} />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-6 py-4 flex gap-6 border-b border-border last:border-0">
            <div className={`${shimmer} h-4 w-20`} />
            <div className={`${shimmer} h-4 w-40 flex-1`} />
            <div className={`${shimmer} h-4 w-32`} />
            <div className={`${shimmer} h-6 w-20 rounded-full`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
