import SignIn from '../../../components/Auth/SignIn';

export async function generateStaticParams() {
  return [{ 'sign-in': [] }];
}

export default function Page() {
  return <SignIn />;
}
