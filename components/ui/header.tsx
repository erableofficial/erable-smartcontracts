import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Header() {
  return (
    <header className="container mx-auto py-5">
      <div className="flex justify-between items-center text-black border-2 rounded-2xl border-black border-solid bg-zinc-50 px-2 py-4">
        <div className="flex items-center justify-around min-w-[30%] max-w-[40%]">
          <Image
            className="rounded-full object-contain w-[35%] h-auto "
            src="/images/logo.svg"
            alt="logo"
            width={100}
            height={100}
          />

          <div className="bg-surface-500  text-black font-bold py-1 px-4 rounded-full border-2 border-black border-solid flex justify-center items-center gap-0.5">
            <div className="text-left">Bridge $CLAP</div>
            <ArrowUpRight />
          </div>
          <button className="bg-surface-500  text-black font-bold py-1 px-4 rounded">
            Disconnect
          </button>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
