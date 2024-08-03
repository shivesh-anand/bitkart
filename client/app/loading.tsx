import { Spinner } from "@nextui-org/spinner";

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="lg" />
    </div>
  );
};

export default LoadingPage;
