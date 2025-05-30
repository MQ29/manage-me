import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export function GoogleLoginButton({ onSuccess }: { onSuccess?: () => void }) {
   return (
    <GoogleLogin
      onSuccess={async credentialResponse => {
        const id_token = credentialResponse.credential;
        if (!id_token) return;
        try {
          const res = await axios.post("http://localhost:8000/api/google-login/", {
            token: id_token,
          });
          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);
          onSuccess?.();
        } catch {
          alert("Błąd logowania przez Google");
        }
      }}
      onError={() => alert("Google Login error")}
    />
  );
}
