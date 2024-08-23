"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import WalletButton from "../WalletButton";

export default function Header1() {
  return (
    <>
      <header
        className="fixed w-full bg-white z-10"
      >
        <nav className="px-20 w-full flex items-center justify-between">
          <div className="logos flex">
            <Link className="header-logo logo" href="/">
              <Image
                width={180}
                height={90}
                src="/images/header-logo-white.svg"
                alt="Header Logo"
              />
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/">Home</Link>
            <Link href="/">Explore Project</Link>
            <Link className="ud-btn btn-thm add-joining" href="/register">
              Join
            </Link>
            <WalletButton />
          </div>
        </nav>
      </header>
    </>
  );
}
