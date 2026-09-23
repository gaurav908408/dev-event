'use client'

import Image from 'next/image'

const ExploreBtn = () => {
  return (
    <section>
    <a
      href="#events"
      id="explore-btn"
      className="group mt-7 mx-auto flex items-center justify-center gap-2"
    >
      <span>Explore events</span>

      <Image
        src="/icons/arrow-down.svg"
        alt="arrow down"
        width={20}
        height={20}
        className="w-5 h-5 object-contain group-hover:translate-y-1 transition-transform duration-300"
      />
    </a>
    </section>
  )
}

export default ExploreBtn