export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number | string;
  height: number | string;
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number | string;
  height: number | string;
}

export interface WindowState {
  id: string;
  title: string;
  icon?: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  prevBounds?: WindowBounds;
}

export interface DesktopIconConfig {
  id: string;
  label: string;
  iconEmoji: string;
  targetWindowId: string;
  defaultPos: { top: number; left: number };
}

export interface ProjectData {
  title: string;
  icon: string;
  tech: string;
  desc: string;
  link: string;
  linkLabel?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  level: string;
  location: string;
  bio: string;
}

export interface SocialLink {
  label: string;
  link: string;
}

export interface PortfolioData {
  profile: ProfileData;
  skills: SkillCategory[];
  projects: ProjectData[];
  socials: SocialLink[];
}
