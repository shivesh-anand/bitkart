export default function EditProfilePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="text-center justify-center sm:w-full md:w-full lg:w-4/12 w-full">
        {children}
      </div>
    </section>
  );
}
