export default function VerifyOtpPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="text-center justify-center lg:w-4/12 xl:w-4/12 w-full">
        {children}
      </div>
    </section>
  );
}
