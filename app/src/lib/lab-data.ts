/**
 * Fixed lab knowledge: the 6-stage Robotics Innovation Cycle and the 8
 * research areas. These are part of the lab's identity (site chrome), not
 * CMS content — icons live at /assets/icons/cycle-N.svg and area-N.svg.
 */

export interface CycleStage {
  index: number;
  name: string;
  icon: string;
}

export const INNOVATION_CYCLE: CycleStage[] = [
  { index: 1, name: "Modelling & Simulation", icon: "/assets/icons/cycle-1.svg" },
  { index: 2, name: "Design", icon: "/assets/icons/cycle-2.svg" },
  { index: 3, name: "Fabrication", icon: "/assets/icons/cycle-3.svg" },
  { index: 4, name: "Assembling", icon: "/assets/icons/cycle-4.svg" },
  { index: 5, name: "Software Development", icon: "/assets/icons/cycle-5.svg" },
  { index: 6, name: "Physical Testing", icon: "/assets/icons/cycle-6.svg" },
];

export interface ResearchArea {
  index: number;
  name: string;
  gloss: string;
  icon: string;
}

export const RESEARCH_AREAS: ResearchArea[] = [
  {
    index: 1,
    name: "AI-driven robotics",
    gloss: "Learning-based perception, planning, and control for physical machines.",
    icon: "/assets/icons/area-1.svg",
  },
  {
    index: 2,
    name: "Multi-Robot Systems",
    gloss: "Swarm coordination and distributed autonomy across robot teams.",
    icon: "/assets/icons/area-2.svg",
  },
  {
    index: 3,
    name: "Edge AI computing",
    gloss: "On-device inference for robots and satellites with tight power budgets.",
    icon: "/assets/icons/area-3.svg",
  },
  {
    index: 4,
    name: "Autonomous & context-aware systems",
    gloss: "Robots that sense their environment and act without supervision.",
    icon: "/assets/icons/area-4.svg",
  },
  {
    index: 5,
    name: "Aerial & underwater robotics",
    gloss: "Platforms for the air and below the surface — from drones to AUVs.",
    icon: "/assets/icons/area-5.svg",
  },
  {
    index: 6,
    name: "Adaptive decision-making",
    gloss: "Policies that adjust to changing goals, teammates, and terrain.",
    icon: "/assets/icons/area-6.svg",
  },
  {
    index: 7,
    name: "Uncertainty quantification",
    gloss: "Knowing what the robot doesn't know — principled confidence in action.",
    icon: "/assets/icons/area-7.svg",
  },
  {
    index: 8,
    name: "IoT, Edge, Cloud & Blockchain",
    gloss: "Connected infrastructure linking robots, sensors, and trusted data.",
    icon: "/assets/icons/area-8.svg",
  },
];
