import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border-dark bg-[#121212]/50 backdrop-blur-xl relative z-10">
      <div className="mx-auto container max-w-7xl px-6 sm:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image
                src="/icons/logo.svg"
                alt="Dev Event Logo"
                width={36}
                height={36}
              />
              <span className="text-xl font-bold italic text-white tracking-wide">dev event</span>
            </Link>

            <p className="text-light-200 text-sm max-w-md leading-relaxed">
              The premier platform for developer conferences, hackathons, and tech meetups worldwide. Discover, organize, and attend developer events in one place.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-light-200 bg-dark-100 border border-border-dark px-3 py-1.5 rounded-full">
                🚀 Next.js 16
              </span>
              <span className="text-xs text-light-200 bg-dark-100 border border-border-dark px-3 py-1.5 rounded-full">
                🍃 MongoDB Atlas
              </span>
              <span className="text-xs text-primary bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-full font-medium">
                ⚡ TypeScript
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-base">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-light-200 list-none p-0">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#events" className="hover:text-primary transition-colors">
                  Featured Events
                </Link>
              </li>
              <li>
                <Link href="/create-event" className="hover:text-primary transition-colors">
                  Create Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-base">Categories</h4>
            <ul className="flex flex-col gap-2 text-sm text-light-200 list-none p-0">
              <li className="hover:text-primary transition-colors cursor-pointer">
                🏆 Hackathons
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                🎙️ Conferences &amp; Summits
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                🌐 Web3 &amp; AI Workshops
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                👥 Local Meetups
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-light-200">
          <p>© {new Date().getFullYear()} DEV EVENT. All rights reserved.</p>
          <p className="text-light-200">
            Crafted for <span className="text-primary font-semibold">Developers Worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
