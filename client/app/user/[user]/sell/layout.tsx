export default function SellPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="text-center justify-center sm:w-screen md:w-10/12 lg:w-6/12">
        {children}
      </div>
    </section>
  );
}
