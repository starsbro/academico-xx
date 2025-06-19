import SignUp from '../../../components/Auth/SignUp';

export async function generateStaticParams() {
  return [{ 'sign-up': [] }];
}

export default function Page() {
  return <SignUp />;
}
