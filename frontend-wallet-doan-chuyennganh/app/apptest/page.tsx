"use client";
import {
  Heading,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { Suspense, useEffect, useState } from "react";
import Error from './error';
import { ErrorBoundary } from "react-error-boundary";

export default async function Apptest() {

  const userData = await fetchUserData();

  return (
    <>
      <Heading mb={4}>Test Page</Heading>
      <ErrorBoundary fallback={ <Error /> }>
        <Suspense fallback={<p>Loading feed...</p>}>
          <UserProfileContent userData={userData} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function UserProfileContent(userData: any) {
  return <div onClick={() => {}}>{userData}</div>
}

async function fetchUserData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("ok");
    }, 2000);
  });
}