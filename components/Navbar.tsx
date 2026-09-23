import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image
            src="/icons/logo.svg"
            alt="Dev Event Logo"
            width={36}
            height={36}
            priority
          />
          <p>dev event</p>
        </Link>
        <ul>
          <Link href="/">Home</Link>
          <Link href="/#events">Events</Link>
          <Link
            href="/create-event"
            className="!px-4 !py-2 !rounded-lg !bg-gradient-to-r !from-[#59deca] !to-[#38bdf8] !text-slate-950 !font-bold hover:!shadow-[0_0_20px_rgba(89,222,202,0.5)] hover:!scale-105 active:!scale-95 transition-all !duration-300 border-none !no-underline"
          >
            + Create Event
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;