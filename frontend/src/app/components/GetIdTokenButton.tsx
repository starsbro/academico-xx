import { getAuth } from 'firebase/auth';

export default function GetIdTokenButton() {
  return (
    <button
      style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}
      onClick={async () => {
        const user = getAuth().currentUser;
        if (user) {
          const token = await user.getIdToken(true);
          console.log('ID Token:', token);
          alert(token); // You can copy it from the alert or console
        } else {
          alert('No user logged in');
        }
      }}
    >
      Get Firebase ID Token
    </button>
  );
}
