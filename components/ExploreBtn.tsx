'use client'

import Image from 'next/image'

const ExploreBtn = () => {
  return (
    <section>
    <a
      href="#events"
      id="explore-btn"
      className="mt-7 mx-auto flex items-center justify-center gap-2"
      onClick={() => {
        console.log('click')
      }}
    >
      <span>Explore events</span>

      <Image
        src="/icons/arrow-down.svg"
        alt="arrow down"
        width={20}
        height={20}
        className="w-5 h-5 object-contain"
      />
    </a>
    </section>
  )
}

export default ExploreBtn