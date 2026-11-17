import WorkflowBlueprintDemo from '@/components/ui/demo';

export default function WorkflowSection() {
  return (
    <section
      id="workflow"
      style={{ backgroundColor: '#141414' }}
      className="halden-workflow-section relative w-full pt-28 sm:pt-32 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 bg-[#141414] text-white overflow-hidden border-t border-white/5"
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-500/15 text-teal-300 border border-teal-500/30 backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Interactive Agentic Blueprint
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Orchestrate Autonomous Enterprise Intelligence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Compose and simulate sovereign multi-agent blueprints. Seamlessly chain enterprise data sources, reasoning models, and human-in-the-loop governance gates in real time.
          </p>
        </div>

        {/* Blueprint Canvas Container matching #141414 theme */}
        <div className="rounded-2xl border border-white/10 bg-[#181818]/90 backdrop-blur-xl shadow-2xl shadow-black/80 overflow-hidden">
          <WorkflowBlueprintDemo />
        </div>
      </div>
    </section>
  );
}
