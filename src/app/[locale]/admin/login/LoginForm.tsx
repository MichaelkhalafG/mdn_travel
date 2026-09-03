"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Button, Input } from "@/components/ui";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const t = useTranslations("admin.login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.code === "rate_limited" ? t("rateLimited") : t("invalidCredentials"));
        return;
      }
      // full navigation so the fresh session cookie applies everywhere
      window.location.assign(callbackUrl);
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Input
        label={t("email")}
        name="email"
        type="email"
        mono
        dir="ltr"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label={t("password")}
        name="password"
        type="password"
        mono
        dir="ltr"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error ? (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : null}
      <Button type="submit" variant="navy" size="md" surface="light" disabled={pending} className="w-full">
        {pending ? t("signingIn") : t("submit")}
      </Button>
    </form>
  );
}
