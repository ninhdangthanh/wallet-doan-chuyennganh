"use client";

import { Heading, Button, Input, useToast } from "@chakra-ui/react";
import styles from "../../styles/signin.module.scss";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { authApi } from "../api-client/auth-api";
import { ISignInPayload } from "../common";
import { useRouter } from "next/navigation";
import "./signin.css"

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignIn(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: ISignInPayload = {
        email: email,
      };
      const response = await authApi.signIn(payload);
      console.log(response.data.access_token);

      // Set to session storage
      sessionStorage.setItem("access_token", response.data.access_token);

      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-in failed, error", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <main className={styles.pageContainer}>
        <Heading as={"h1"}>Sign in to your account</Heading>
        <form className={styles.form} onSubmit={handleSignIn}>
          <label>
            <p>Email address</p>
            <Input
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button className="buttonlogin">Okkk</button>
          <Button
            isLoading={loading}
            bgColor="blue.500"
            color="white"
            _hover={{ backgroundColor: "blue.600" }}
            type="submit"
            as="button"
          >
            Sign in
          </Button>
        </form>
      </main>
    </>
  );
}
