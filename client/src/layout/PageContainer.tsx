import PageHeader, { type Breadcrumb } from "./PageHeader";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function PageContainer({
  title,
  subtitle,
  breadcrumbs,
  actions,
  icon,
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-4 sm:py-4 lg:px-2">
      <div className="mb-3">
        <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} actions={actions} icon={icon} />
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}