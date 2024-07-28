export default function ProductPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="items-center justify-center gap-4">
      <div className="text-center justify-center">{children}</div>
    </section>
  );
}
