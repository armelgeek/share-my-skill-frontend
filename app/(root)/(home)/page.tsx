"use client";
import { Button } from '@/shared/components/atoms/ui/button';
import { Typography } from '@/shared/components/atoms/ui/typography';
// Ajoute ici d'autres composants UI si disponibles (ex: AppLogo, LandingHero)
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
      <Typography as="h1" className="mb-4 text-4xl font-bold text-blue-700" aria-label="Titre principal">
        Bienvenue sur Share My Skill
      </Typography>
      <p className="mb-6 text-lg text-gray-700 max-w-xl text-center" aria-label="Description plateforme">
        La plateforme collaborative pour partager, apprendre et valoriser vos compétences. Rejoignez une communauté active, accédez à des ateliers, formations et ressources, et développez votre réseau professionnel.
      </p>
      <div className="flex gap-4 mb-8">
        <Link href="/register" passHref legacyBehavior>
          <Button aria-label="S’inscrire" variant="primary">S’inscrire</Button>
        </Link>
        <Link href="/login" passHref legacyBehavior>
          <Button aria-label="Se connecter" variant="secondary">Se connecter</Button>
        </Link>
      </div>
      <section className="w-full max-w-2xl mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-blue-600">Pourquoi choisir Share My Skill ?</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Accès à des ateliers et formations variés</li>
          <li>Réseau de partenaires et experts</li>
          <li>Interface moderne et intuitive</li>
          <li>Gestion avancée des compétences</li>
          <li>Communauté active et bienveillante</li>
        </ul>
      </section>
      {/* Ajoute ici logos partenaires ou témoignages si disponibles */}
    </main>
  );
}
