import AdvisorNavigation from '@/components/project-advisor/AdvisorNavigation';

export default function ProjectAdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AdvisorNavigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
