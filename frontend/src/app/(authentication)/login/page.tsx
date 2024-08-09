"use client";
import Link from "next/link";
import React, {
  useEffect,
  useState,
  FormEvent,
  KeyboardEvent,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import {
  Status,
  EmailValid,
  userLoginData,
} from "../../typings/backendDataTypes";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { setAuthToken } from "@/app/api/cookieAPI";
import RedirectModal from "../components/redirectModal";
import { authAPI } from "@/app/api/authAPI";

function LoginPageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(Status.Pending);
  const [emailValid, setEmailValid] = useState(EmailValid.Pending);
  const [user, setUser] = useState<userLoginData>({
    email: "",
    password: "",
  });
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    validateEmail();
    setDomLoaded(true);
  }, []);

  // verify if user is trying to validate their email
  async function validateEmail() {
    const confirm_token = searchParams.get("confirm_token");
    let response;

    if (confirm_token !== null) {
      try {
        response = await authAPI.validateEmail(confirm_token);

        if (response && response.status === 200) {
          setEmailValid(EmailValid.Valid);
          return response;
        } else {
          setEmailValid(EmailValid.Invalid);
        }
      } catch (error) {
        console.error("Error, failed to validate email", error);
      }
    }
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(Status.Pending);

    let response;

    try {
      response = await authAPI.loginUser(user);

      if (response && response.status === 200) {
        const accessToken = response.data.access_token;

        await setAuthToken(accessToken);

        router.push("/");
      } else {
        setStatus(Status.Failure);
      }
    } catch (error) {
      setStatus(Status.Failure);
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      const form = event.currentTarget.closest("form");
      if (form) {
        onLogin(new Event("submit") as unknown as FormEvent<HTMLFormElement>);
      }
    }
  };

  const onGoogleSignup = async () => {
    //handle Google Signup
    router.push(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/oauth/google/`,
    );
  };

  return (
    domLoaded && (
      <>
        {emailValid === EmailValid.Valid && (
          <RedirectModal
            message={"Email successfully validated!"}
            redirectPath={"/login"}
            buttonText={"Ok!"}
          />
        )}

        {emailValid === EmailValid.Invalid && (
          <RedirectModal
            message={
              "Failed to validate email! Please request for a new confirmation link."
            }
            redirectPath={"/login"}
            buttonText={"Ok!"}
          />
        )}

        <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
          <form
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-md shadow-md "
            onSubmit={onLogin}
          >
            <h1 className="font-bold mb-3">OwlMark OMS Portal</h1>
            <Button
              onClick={onGoogleSignup}
              color="white"
              size="xs"
              className="w-full flex items-center justify-center gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-1 rounded-lg text-gray-700 font-semibold text-lg border-2 border-gray-100"
            >
              <div className="flex items-center">
                <svg
                  width="40"
                  height="24"
                  viewBox="0 0 40 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z"
                    fill="#34A853"
                  />
                  <path
                    d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z"
                    fill="#4A90E2"
                  />
                  <path
                    d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z"
                    fill="#FBBC05"
                  />
                </svg>
                <span>Sign in with Google</span>
              </div>
            </Button>

            <p className="text-md my-6 text-center text-gray-400 uppercase font-medium">
              or use your email
            </p>

            <div className="mb-4">
              <Label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Email
              </Label>
              <TextInput
                className="border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                id="email"
                type="email"
                value={user.email}
                icon={HiMail}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Enter your email address"
              />
            </div>

            <div className="mb-4">
              <Label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </Label>
              <TextInput
                className="border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Enter your password"
                onKeyDown={handleKeyDown}
                icon={HiLockClosed}
              />
            </div>

            {status === Status.Failure && (
              <div className="mb-4">
                <Alert color="failure" icon={HiInformationCircle}>
                  <span className="font-medium">Error logging in! &nbsp;</span>
                  Please check your email and password and try again. Make sure
                  that your email is verified.
                </Alert>
              </div>
            )}

            <Button
              onClick={(e: any) => onLogin(e)}
              color="purple"
              size="xs"
              className="w-full text-white text-xl font-bold py-3 rounded-md transition duration-300"
            >
              Login
            </Button>

            <div className="flex items-center justify-center space-x-10 mt-4">
              <Link
                href="/reset-password"
                className="text-purple-500 font-medium text-primary-600 hover:underline dark:text-primary-500 flex items-center justify-center mt-4 text-sm"
              >
                Forgot password
              </Link>
              <Link
                href="/signup"
                className="text-purple-500 font-medium text-primary-600 hover:underline dark:text-primary-500 flex items-center justify-center mt-4 text-sm"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </>
    )
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginPageForm />
    </Suspense>
  );
}
