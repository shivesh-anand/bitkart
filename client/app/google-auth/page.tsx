"use client";

import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

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
    console.log("token", token);
    if (token) {
      //Cookies.set("token", token, { expires: 1, secure: true });

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
      localStorage.setItem("loggedIn", "true");
      router.push("/");
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
