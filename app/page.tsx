"use client";

import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import DiagonalLines from "@/app/components/DiagonalLines";
import DiamondFrame from "@/app/components/DiamondFrame";
import DiamondButton from "@/app/components/DiamondButton";
import SideNav from "@/app/components/SideNav";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-white overflow-hidden font-roobert">
      <Header />

      {/* Geometry */}
      <DiagonalLines />
      <DiamondFrame />

      {/* Content */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-xl flex flex-col items-center">
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-light leading-tight">
            Sophisticated
            <br />
            skincare
          </h1>

          <p className="mt-6 text-gray-500 text-sm font-bold md:text-base max-w-md">
            Skinstric developed an A.I. that creates a highly-personalized
            routine tailored to what your skin needs.
          </p>

          {/* MOBILE / TABLET CTA */}
          <div className="mt-8 xl:hidden">
            <DiamondButton
              label="ENTER EXPERIENCE"
              onClick={() => router.push("/pages/start")}
            />
          </div>
        </div>
      </section>

      {/* DESKTOP SIDE NAV */}
      <div className="hidden xl:block">
        <SideNav direction="left" label="DISCOVER A.I." />
        <SideNav
          direction="right"
          label="TAKE TEST"
          onClick={() => router.push("/pages/start")}
        />
      </div>
    </main>
  );
}