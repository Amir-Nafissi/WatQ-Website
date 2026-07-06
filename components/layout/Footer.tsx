import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const external = [
  { href: "https://uwaterloo.ca", label: "UWaterloo" },
  { href: "https://github.com", label: "GitHub" },
  { href: "https://www.ibm.com/quantum/qiskit", label: "Qiskit" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center">
          <span className="font-bold text-ink">WATQ</span>
        </div>

        <ul className="flex items-center gap-6">
          {external.map(({ href, label }) => (
            <li key={label}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-0.5 text-sm text-ink-dim transition-colors hover:text-ink"
              >
                {label}
                <ArrowUpRight
                  size={13}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>

        <p className="font-mono text-xs text-ink-dim">
          © {new Date().getFullYear()} WatQ — University of Waterloo
        </p>
      </div>
    </footer>
  );
}
