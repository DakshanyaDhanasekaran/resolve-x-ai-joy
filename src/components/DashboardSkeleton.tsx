import { motion } from "framer-motion";

const DashboardSkeleton = () => {
  const shimmer = "animate-pulse bg-gradient-to-r from-muted via-muted/70 to-muted rounded-lg";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2.5">
          <div className={`${shimmer} h-8 w-72`} />
          <div className={`${shimmer} h-4 w-52`} />
        </div>
        <div className={`${shimmer} h-11 w-40 rounded-xl`} />
      </div>

      {/* Quick metrics */}
      <div className="flex gap-3">
        {[1, 2].map((i) => (
          <div key={i} className={`${shimmer} h-14 w-44 rounded-xl`} />
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-xl p-5 space-y-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex justify-between">
              <div className="space-y-1.5">
                <div className={`${shimmer} h-3 w-20`} />
                <div className={`${shimmer} h-2 w-14`} />
              </div>
              <div className={`${shimmer} h-10 w-10 rounded-xl`} />
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <div className={`${shimmer} h-9 w-14`} />
                <div className={`${shimmer} h-3 w-24`} />
              </div>
              <div className={`${shimmer} h-12 w-24`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex justify-between">
            <div className="space-y-1.5">
              <div className={`${shimmer} h-4 w-40`} />
              <div className={`${shimmer} h-3 w-56`} />
            </div>
            <div className={`${shimmer} h-8 w-32 rounded-lg`} />
          </div>
          <div className={`${shimmer} h-[280px] w-full rounded-xl`} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="space-y-1.5">
            <div className={`${shimmer} h-4 w-36`} />
            <div className={`${shimmer} h-3 w-48`} />
          </div>
          <div className={`${shimmer} h-[180px] w-full rounded-xl`} />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className={`${shimmer} h-3 w-20`} />
                <div className={`${shimmer} h-3 w-12`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="px-5 py-4 border-b border-border flex justify-between">
          <div className="space-y-1.5">
            <div className={`${shimmer} h-4 w-36`} />
            <div className={`${shimmer} h-3 w-44`} />
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-5 py-3.5 flex gap-5 border-b border-border last:border-0">
            <div className={`${shimmer} h-4 w-16`} />
            <div className={`${shimmer} h-4 w-36 flex-1`} />
            <div className={`${shimmer} h-4 w-24 hidden md:block`} />
            <div className={`${shimmer} h-4 w-28`} />
            <div className={`${shimmer} h-5 w-20 rounded-full`} />
            <div className={`${shimmer} h-4 w-16`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
