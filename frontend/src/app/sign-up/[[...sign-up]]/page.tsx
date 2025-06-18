import { SignUp } from '@clerk/nextjs';

export async function generateStaticParams() {
  return [{ 'sign-up': [] }];
}

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp />
    </div>
  );
}
