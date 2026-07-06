import type { Metadata } from "next";
import Image from "next/image";
import KineticHeading from "@/components/motion/KineticHeading";
import Reveal from "@/components/motion/Reveal";
import TeamGrid from "@/components/team/TeamGrid";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the students behind WatQ — hardware engineers, algorithm developers, and quantum enthusiasts at the University of Waterloo.",
};

export default function TeamPage() {
  return (
    <div className="px-6 pt-36 pb-24">
      <section className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-ink-dim">
          THE PEOPLE
        </p>
        <KineticHeading className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-6xl">
          An entangled{" "}
          <span className="bg-gradient-to-r from-photon to-qubit bg-clip-text text-transparent">
            team
          </span>
        </KineticHeading>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-dim">
            Physicists, engineers, and computer scientists — correlated across
            two sub-teams, measured as one.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <Reveal delay={0.3}>
          <div className="glass overflow-hidden rounded-3xl">
            <Image
              src="/WatQ-group-photo.webp"
              alt="The WatQ team at the University of Waterloo"
              width={1920}
              height={1280}
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="h-auto w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <TeamGrid />
      </section>
    </div>
  );
}
