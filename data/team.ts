export type SubTeam = "Hardware" | "Software" | "Lead";

export interface TeamMember {
  name: string;
  role: string;
  subteam: SubTeam;
  major: string;
  github?: string;
  linkedin?: string;
}

export const team: TeamMember[] = [
  {
    name: "Maya Lindqvist",
    role: "Team Captain",
    subteam: "Lead",
    major: "Engineering Physics",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Daniel Cho",
    role: "Hardware Lead",
    subteam: "Hardware",
    major: "Nanotechnology Engineering",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Priya Nair",
    role: "Software Lead",
    subteam: "Software",
    major: "Computer Science",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Marcus Webb",
    role: "Photonics Designer",
    subteam: "Hardware",
    major: "Electrical Engineering",
    github: "https://github.com",
  },
  {
    name: "Sofia Almeida",
    role: "Algorithms Researcher",
    subteam: "Software",
    major: "Combinatorics & Optimization",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Ethan Zhou",
    role: "Chip Layout Engineer",
    subteam: "Hardware",
    major: "Nanotechnology Engineering",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Leila Hosseini",
    role: "Simulation Developer",
    subteam: "Software",
    major: "Applied Mathematics",
    github: "https://github.com",
  },
  {
    name: "Noah Bergstrom",
    role: "Optics Test Engineer",
    subteam: "Hardware",
    major: "Physics & Astronomy",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Grace Okafor",
    role: "Visualization Engineer",
    subteam: "Software",
    major: "Software Engineering",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Tomás Rivera",
    role: "Cryogenics & Packaging",
    subteam: "Hardware",
    major: "Mechatronics Engineering",
    github: "https://github.com",
  },
];
