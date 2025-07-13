"use client";

export function Footer() {
  return (
    <footer className="w-full px-6 py-4 bg-background border-t flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
      <div>
        &copy; {new Date().getFullYear()} Share My Skill. Tous droits réservés.
      </div>
      <div className="flex gap-4">
        <a href="/mentions" aria-label="Mentions légales" className="hover:underline">Mentions légales</a>
        <a href="/contact" aria-label="Contact" className="hover:underline">Contact</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:underline">Twitter</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:underline">LinkedIn</a>
      </div>
    </footer>
  );
}
