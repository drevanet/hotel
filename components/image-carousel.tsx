'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';

type Props = { images: string[]; alt: string; className?: string; sizes?: string };
export default function ImageCarousel({ images, alt, className = '', sizes = '100vw' }: Props) {
  const [index, setIndex] = useState(0);
  const move = (direction: number) => setIndex((current) => (current + direction + images.length) % images.length);
  return <div className={`group relative overflow-hidden bg-[#e9e5dd] ${className}`}>
    {images.map((src, i) => <Image key={src} src={src} alt={`${alt} — view ${i + 1}`} fill sizes={sizes} priority={i === 0} className={`object-cover transition duration-700 ${i === index ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'}`} />)}
    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs text-white backdrop-blur"><Images size={14}/><span>{index + 1} / {images.length}</span></div>
    {images.length > 1 && <><button type="button" aria-label="Previous room image" onClick={() => move(-1)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 text-[#202923] opacity-100 transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"><ChevronLeft size={19}/></button><button type="button" aria-label="Next room image" onClick={() => move(1)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 text-[#202923] opacity-100 transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"><ChevronRight size={19}/></button><div className="absolute bottom-5 right-4 flex gap-1.5">{images.map((_, i) => <button key={i} aria-label={`Show image ${i + 1}`} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/65'}`} />)}</div></>}
  </div>;
}
