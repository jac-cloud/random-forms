import { account } from '@/utils';
import { useNavigate } from '@tanstack/react-router';

export function Logout() {
  async function logout() {
    const result = await account.deleteSession(
      'current', // sessionId
    );

    return result;
  }

  const navigate = useNavigate();

  logout().then(result => {
    console.log(result);

    navigate({
      to: '/auth',
    });
  });

  return <div>Logging out...</div>;
}
