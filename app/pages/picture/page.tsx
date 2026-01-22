"use client";

import React from "react";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      <section className="flex flex-col items-start justify-between flex-1 px-8 py-8">
        <p className="text-sm font-semibold mb-6 pt-15">TO START ANALYSIS</p>

        <div>
          <DiamondArrowButton
            direction="left"
            label="BACK"
            onClick={() => router.back()}
          />
        </div>
      </section>
    </main>
  );
};

export default Page;
