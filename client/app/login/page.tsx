/* eslint-disable prettier/prettier */
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { LockIcon, MailIcon } from "lucide-react";
import React from "react";

import GradualSpacing from "@/components/magicui/gradual-spacing";
import { BorderBeam } from "@/components/magicui/border-beam";
import { GoogleIcon, SignIn } from "@/components/icons";

const LoginPage = () => {
  return (
    <Card fullWidth={true} shadow="lg">
      <CardHeader className="text-center text-5xl font-extrabold justify-center">
        <GradualSpacing
          className="font-display text-center text-5xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-5xl md:leading-[5rem]"
          text="Log In"
        />
      </CardHeader>
      <CardBody>
        <form className="flex flex-col py-4 px-4 gap-4 w-full">
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
            className="font-bold text-lg w-full transition duration-200 hover:bg-green-500 hover:text-black"
            size="lg"
            startContent={<SignIn />}
            variant="shadow"
            type="submit"
          >
            Login
          </Button>{" "}
        </form>
        <h1 className="text-center">OR</h1>
        <form className="flex flex-col py-4 px-4 gap-4 w-full">
          <Button
            className="font-bold text-lg w-full transition duration-200 hover:bg-green-500 hover:text-black"
            size="lg"
            startContent={<GoogleIcon />}
            variant="shadow"
            type="submit"
          >
            Login with Google
          </Button>
        </form>
      </CardBody>
      <CardFooter className="justify-center">
        Don&apos;t have an account yet?
        <Link
          showAnchorIcon
          className="px-4 font-bold text-lg"
          color="foreground"
          href="/signup"
        >
          Sign Up
        </Link>
      </CardFooter>
      <BorderBeam
        borderWidth={3}
        colorFrom="#0093E9"
        colorTo="#80D0C7"
        delay={9}
        duration={12}
        size={300}
      />
    </Card>
  );
};

export default LoginPage;
