import { SignIn } from '@clerk/nextjs';

export async function generateStaticParams() {
  return [{ 'sign-in': [] }];
}

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}
