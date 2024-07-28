import { GoogleIcon, SignIn } from "@/components/icons";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import ShineBorder from "@/components/magicui/shine-border";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { LockIcon, MailIcon, User2Icon } from "lucide-react";

const SignUpPage = () => {
  return (
    <ShineBorder color={["#A07CFE", "#2BD2FF", "#2BFF88"]}>
      <Card shadow="lg" fullWidth={true}>
        <CardHeader className="text-center text-5xl font-extrabold justify-center">
          <GradualSpacing
            className="font-display text-center text-5xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-5xl md:leading-[5rem]"
            text="Sign Up"
          />
        </CardHeader>
        <CardBody>
          <form className="flex flex-col py-4 px-4 gap-4 w-full">
            <Input
              endContent={
                <User2Icon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Name"
              placeholder="Enter your name"
              variant="bordered"
            />
            <Input
              endContent={
                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
            />
            <Input
              endContent={
                <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
            />
            <Button
              className="w-full"
              size="lg"
              variant="shadow"
              color="success"
              startContent={<SignIn />}
            >
              Sign Up
            </Button>
          </form>
          <h1 className="text-center">OR</h1>
          <form className="flex flex-col py-4 px-4 gap-4 w-full">
            <Button
              className="w-full"
              size="lg"
              variant="shadow"
              color="success"
              startContent={<GoogleIcon />}
            >
              Sign Up with Google
            </Button>
          </form>
        </CardBody>
        <CardFooter className="justify-center">
          Already have an account?
          <Link
            href="/login"
            className="px-4 font-bold text-lg"
            color="foreground"
            showAnchorIcon
          >
            Log In
          </Link>
        </CardFooter>
      </Card>
    </ShineBorder>
  );
};

export default SignUpPage;
