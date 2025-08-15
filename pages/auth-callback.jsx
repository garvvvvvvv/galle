import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Parse error from URL hash or query
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const errorCode = params.get("error_code");
    const errorDesc = params.get("error_description");

    if (errorCode === "otp_expired") {
      setError("Your login link has expired. Please request a new one.");
    } else if (errorDesc) {
      setError(decodeURIComponent(errorDesc));
    }
  }, []);

  return (
    <div>
      {error ? (
        <div style={{ color: "red" }}>
          {error}
          <br />
          <a href="/login">Request a new login link</a>
        </div>
      ) : (
        <div>Signing you in...</div>
      )}
    </div>
  );
}
