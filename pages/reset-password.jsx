import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const { access_token, error } = router.query;
    if (error === "missing_token" || !access_token) {
      setMessage("Missing or invalid password reset token.");
    }
    setTokenChecked(true);
  }, [router.isReady, router.query]);

  const handleReset = async (e) => {
    e.preventDefault();
    const { access_token } = router.query;
    if (!access_token) {
      setMessage("Missing or invalid password reset token.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser(
      { password },
      { accessToken: access_token }
    );
    setSubmitting(false);
    if (error) setMessage(error.message);
    else setMessage("Password updated! You can now log in.");
  };

  if (!tokenChecked) return null;

  return (
    <form onSubmit={handleReset}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !password}>
        {submitting ? "Updating..." : "Set new password"}
      </button>
      {message && <div style={{ color: message.includes("updated") ? "green" : "red" }}>{message}</div>}
    </form>
  );
}
