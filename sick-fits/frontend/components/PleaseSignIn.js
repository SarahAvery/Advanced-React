/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { useUser } from './User';
import SignIn from './SignIn';

export default function ({ children }) {
  const me = useUser();
  if (!me) return <SignIn />;
  return { children };
}
