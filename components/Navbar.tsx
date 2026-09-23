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
            <Link href="/create-event">Create Event</Link>
         </ul>
      </nav>
    </header>
  );
};

export default Navbar;