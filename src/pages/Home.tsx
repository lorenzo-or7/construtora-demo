import { useEffect } from 'react';
import { Contact } from '../components/Contact';
import { Developments } from '../components/Developments';
import { Hero } from '../components/Hero';
import { LivingGallery } from '../components/LivingGallery';
import { Manifesto } from '../components/Manifesto';
import { Materials } from '../components/Materials';
import { Philosophy } from '../components/Philosophy';
import { Process } from '../components/Process';

export default function Home({ onReady, skipIntro }: { onReady: () => void; skipIntro: boolean }) {
  useEffect(() => {
    document.title = 'ATRIUM, Engenharia & Incorporação | Protótipo conceitual';
  }, []);
  return (
    <>
      <Hero onReady={onReady} skip={skipIntro} />
      <Manifesto />
      <Developments />
      <Process />
      <Materials />
      <LivingGallery />
      <Philosophy />
      <Contact />
    </>
  );
}
