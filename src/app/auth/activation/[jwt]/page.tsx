import Link from "next/link";
import { activateUserAction } from "@/lib/actions/authAction";

interface Props {
  params: {
    jwt: string;
  };
}

const ActivationPage = async ({ params }: Props) => {
  const data = await activateUserAction(params.jwt);
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {data === "userNotExist" ? (
        <>
          <p className="text-red-500 text-2xl">The user does not exist</p>
          <Link className="mt-4 text-blue-500 underline" href="/register">
            Go to Registration
          </Link>
        </>
      ) : data === "alreadyActivated" ? (
        <>
          <p className="text-red-500 text-2xl">The user is already activated</p>
          <Link className="mt-4 text-blue-500 underline" href="/auth/login">
            Go to Login
          </Link>
        </>
      ) : data === "success" ? (
        <>
          <p className="text-green-500 text-2xl">
            Success! The user is now activated
          </p>
          <Link className="mt-4 text-blue-500 underline" href="/auth/login">
            Go to Login
          </Link>
        </>
      ) : (
        <>
          <p className="text-yellow-500 text-2xl">
            Oops! Something went wrong!
          </p>
          <Link href="/register">
            <a className="mt-4 text-blue-500 underline">Go to Registration</a>
          </Link>
        </>
      )}
    </div>
  );
};

export default ActivationPage;
