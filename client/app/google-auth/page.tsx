"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { setCredentials } from "@/redux/slices/authSlice";

const GoogleAuthPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token")!;
    const firstName = searchParams.get("firstName")!;
    const lastName = searchParams.get("lastName")!;
    const email = searchParams.get("email")!;
    const _id = searchParams.get("_id")!;
    const googleId = searchParams.get("googleId")!;

    if (token) {
      Cookies.set("token", token, { expires: 1, secure: true });

      dispatch(
        setCredentials({
          token,
          firstName,
          lastName,
          email,
          _id,
          googleId,
        })
      );

      toast.success("Logged in successfully!", { id: "login-success" });

      router.replace("/");
    } else if (searchParams.get("error") === "already_signed_up") {
      toast.error("You are already signed up!", { id: "already-signed-up" });
      router.replace("/login");
    } else {
      router.replace("/login");
    }
  }, [searchParams, router, dispatch]);

  return <div>Redirecting...</div>;
};

export default GoogleAuthPage;
