import Image from "next/image";
import WalletConnect from "./components/WalletConnect";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray">
      <WalletConnect />
    </main>
  );
}
