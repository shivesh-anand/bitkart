export default function CategoriesPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="text-center justify-center">{children}</div>
    </section>
  );
}
