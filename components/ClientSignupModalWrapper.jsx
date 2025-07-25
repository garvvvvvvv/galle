"use client";
import dynamic from "next/dynamic";
const SignupModal = dynamic(() => import('@/components/SignupModal'), { ssr: false });

export default function ClientSignupModalWrapper(props) {
  return <SignupModal {...props} />;
}
