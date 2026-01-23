import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { SignInRedirectHandler } from "../../components/auth/SignInRedirectHandler";

export default function SignIn() {
  return (
    <>
      <SignInRedirectHandler />
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
