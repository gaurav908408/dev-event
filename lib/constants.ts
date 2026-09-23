export interface Event {
  id?: string;
  title: string;
  image: string;
  date?: string;
  location?: string;
  description?: string;
  category?: string;
}

export const events: Event[] = [
  {
    id: "nextjs-conf-2026",
    title: "Next.js Conf 2026",
    image: "/images/nextjs-conf.svg",
    date: "October 24, 2026",
    location: "San Francisco, CA & Online",
    description: "The global developer event for React & Next.js innovation.",
    category: "Conference"
  },
  {
    id: "react-summit-2026",
    title: "React Summit Amsterdam",
    image: "/images/react-summit.svg",
    date: "June 14-18, 2026",
    location: "Amsterdam, Netherlands",
    description: "The biggest React conference worldwide bringing full-stack web devs together.",
    category: "Summit"
  },
  {
    id: "aws-reinvent-2026",
    title: "AWS re:Invent 2026",
    image: "/images/aws-reinvent.svg",
    date: "December 2-6, 2026",
    location: "Las Vegas, NV",
    description: "Premier global cloud computing, serverless, and AI architecture conference.",
    category: "Cloud & AI"
  },
  {
    id: "google-io-2026",
    title: "Google I/O Extended 2026",
    image: "/images/google-io.svg",
    date: "May 20-22, 2026",
    location: "Mountain View, CA & Global",
    description: "Explore the latest in Web, Android, Cloud, and Gemini AI developments.",
    category: "Keynote"
  },
  {
    id: "eth-global-2026",
    title: "ETHGlobal Hackathon 2026",
    image: "/images/event1.svg",
    date: "October 15-17, 2026",
    location: "Online / Global",
    description: "Build cutting-edge Web3 & AI decentralized applications.",
    category: "Hackathon"
  },
  {
    id: "web3-dev-summit-2026",
    title: "Global Dev Summit 2026",
    image: "/images/event2.svg",
    date: "November 10-12, 2026",
    location: "Bengaluru, India",
    description: "Gathering thousands of developers, architects, and tech leaders.",
    category: "Conference"
  }
];
