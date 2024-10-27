"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// Enum to define the different modes of the login page
enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
  // Initialize Wix client and router
  const wixClient = useWixClient();
  const router = useRouter();

  // // Check if the user is already logged in
  // const isLoggedIn = wixClient.auth.loggedIn();
  // console.log("User logged in status:", isLoggedIn);

  // // Redirect to home if logged in
  // if (isLoggedIn) {
  //   console.log("Redirecting to home page...");
  //   router.push("/");
  // }

  // Move the redirect logic into useEffect
  useEffect(() => {
    const isLoggedIn = wixClient.auth.loggedIn();
    console.log("User logged in status:", isLoggedIn);

    if (isLoggedIn) {
      console.log("Redirecting to home page...");
      router.push("/");
    }
  }, [wixClient.auth, router]); // Add dependencies

  const [mode, setMode] = useState(MODE.LOGIN);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Determine the title of the form based on the current mode
  const formTitle =
    mode === MODE.LOGIN
      ? "Log in"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Your Password"
      : "Verify Your Email";

  // Determine the button title based on the current mode
  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    console.log("Form submitted with mode:", mode);

    try {
      let response;

      switch (mode) {
        case MODE.LOGIN:
          console.log("Attempting to log in...");
          response = await wixClient.auth.login({
            email,
            password,
          });
          break;
        case MODE.REGISTER:
          console.log("Attempting to register...");
          response = await wixClient.auth.register({
            email,
            password,
            profile: { nickname: username },
          });
          break;
        case MODE.RESET_PASSWORD:
          console.log("Attempting to reset password for email:", email);
          response = await wixClient.auth.sendPasswordResetEmail(
            email,
            window.location.href
          );
          setMessage("Password reset email sent. Please check your e-mail.");
          break;
        case MODE.EMAIL_VERIFICATION:
          console.log("Attempting email verification with code:", emailCode);
          response = await wixClient.auth.processVerification({
            verificationCode: emailCode,
          });
          break;
        default:
          break;
      }

      console.log("Response received from authentication process:", response);

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          console.log(
            "Response received from authentication process:",
            response
          );
          setMessage("Successful! You are being redirected.");
          const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
            response.data.sessionToken!
          );
          console.log("Tokens received:", tokens);
          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            expires: 2,
          });
          wixClient.auth.setTokens(tokens);

          const updatedIsLoggedIn = wixClient.auth.loggedIn();
          console.log("Updated user logged in status:", updatedIsLoggedIn);

          router.push("/");
          break;
        case LoginState.FAILURE:
          console.log("Login failed with error code:", response.errorCode);
          if (
            response.errorCode === "invalidEmail" ||
            response.errorCode === "invalidPassword"
          ) {
            setError("Invalid email or password!");
          } else if (response.errorCode === "emailAlreadyExists") {
            setError("Email already exists!");
          } else if (response.errorCode === "resetPassword") {
            setError("You need to reset your password!");
          } else {
            setError("Something went wrong!");
          }
          break; // Added break here to prevent fall-through
        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          console.log("Email verification required, switching mode...");
          setMode(MODE.EMAIL_VERIFICATION); // Switch to email verification mode
          break; // Added break here to prevent fall-through
        case LoginState.OWNER_APPROVAL_REQUIRED:
          console.log("Owner approval required for the account.");
          setMessage("Your account is pending approval");
          break; // Added break here to prevent fall-through
        default:
          console.log("Unhandled login state:", response?.loginState);
          break;
      }
    } catch (err) {
      console.error("Error during form submission:", err);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
      console.log("Loading state set to false.");
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold">{formTitle}</h1>
        {mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="john"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => {
                setUsername(e.target.value);
                // console.log("Username changed to:", e.target.value);
              }}
            />
          </div>
        ) : null}
        {mode !== MODE.EMAIL_VERIFICATION ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="johndoe@gmail.com"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => {
                setEmail(e.target.value);
                // console.log("Email changed to:", e.target.value);
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Verification Code</label>
            <input
              type="text"
              name="emailCode"
              placeholder="Code"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => {
                setEmailCode(e.target.value);
                // console.log(
                //   "Email verification code changed to:",
                //   e.target.value
                // );
              }}
            />
          </div>
        )}
        {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => {
                setPassword(e.target.value);
                // console.log("Password changed.");
              }}
            />
          </div>
        ) : null}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => {
              setMode(MODE.RESET_PASSWORD);
              // console.log("Switched to Reset Password mode.");
            }}
          >
            Forgot Password?
          </div>
        )}
        <button
          className="bg-primary text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : buttonTitle}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => {
              setMode(MODE.REGISTER);
              // console.log("Switched to Register mode.");
            }}
          >
            Don't have an account?
          </div>
        )}
        {mode === MODE.REGISTER && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => {
              setMode(MODE.LOGIN);
              // console.log("Switched to Login mode.");
            }}
          >
            Have an account?
          </div>
        )}
        {mode === MODE.RESET_PASSWORD && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => {
              setMode(MODE.LOGIN);
              // console.log("Switched back to Login mode.");
            }}
          >
            Go back to Login
          </div>
        )}
        {message && <div className="text-green-600 text-sm">{message}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
