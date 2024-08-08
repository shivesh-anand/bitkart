export default function LoginPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="text-center justify-center lg:w-4/12 md:8/12 w-full">
        {children}
      </div>
    </section>
  );
}
