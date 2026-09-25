import { PortfolioData, DesktopIconConfig } from '../types/os';

export const PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: "ADARSH SEN",
    title: "Graphics Programmer",
    level: "LVL 99 GP-MAGE",
    location: "GREATER NOIDA, UP",
    bio: "I am a GPU Programmer proficient in C, C++, and Python. Experienced with OpenGL and actively learning Vulkan. I build 3D rendering pipelines and engine architectures from scratch. Also rocking 5 years of freelance graphic design as a creative hobby!"
  },
  skills: [
    {
      category: "Languages",
      items: ["C++ (Mastered)", "C", "Python", "Shading Languages (GLSL, HLSL)"]
    },
    {
      category: "Graphics & Engines",
      items: ["OpenGL", "Vulkan (Learning)", "Unreal Engine", "Unity", "Blender"]
    },
    {
      category: "Creative Tools",
      items: ["Photoshop", "Illustrator (Beginner to Intermediate)", "After Effects (Beginner to Intermediate)", "Adobe Premiere Pro", "Figma"]
    }
  ],
  projects: [
    { 
      title: "Creative Project Gallery", 
      icon: "ART",
      tech: "After Effects, Illustrator, Adobe Premiere Pro",
      desc: "A curated Instagram feed of motion graphics, posters, and edits from my creative work.", 
      link: "https://www.instagram.com/crumbling_bread/?hl=en",
      linkLabel: "View Instagram"
    },
    { 
      title: "Custom 3D Math Library", 
      icon: "MTH",
      tech: "C++",
      desc: "Highly optimized vector and matrix operations built entirely from scratch in C++ for custom engine architecture. Avoids external dependencies.", 
      link: "https://github.com/Ads9115/Mathlib" 
    },
    { 
      title: "GL Debug Draw", 
      icon: "DBG",
      tech: "C++, OpenGL",
      desc: "An OpenGL utility library designed for easily drawing debug primitives, bounding boxes, and lines during engine development.", 
      link: "https://github.com/Ads9115/gl-debug-draw" 
    },
    { 
      title: "Grass Rendering Pipeline", 
      icon: "GRS",
      tech: "C++, OpenGL, GLSL",
      desc: "A custom shader-based rendering pipeline in OpenGL focused on efficiently rendering massive amounts of dynamic foliage/grass.", 
      link: "https://github.com/Ads9115/Grass-rendering-OpenGL" 
    },
    { 
      title: "2D Gravity Simulation", 
      icon: "PHY",
      tech: "C++",
      desc: "A physics simulation modeling gravitational interactions in a 2D space, applying fundamental math and physics logic.", 
      link: "https://github.com/Ads9115/2D-Simulation-of-Gravity" 
    },
    { 
      title: "Blinn-Phong Lighting", 
      icon: "LIT",
      tech: "C++, OpenGL, GLSL",
      desc: "A low-level implementation of the classic Blinn-Phong reflection model to calculate specular highlights and diffuse lighting.", 
      link: "https://github.com/Ads9115/Blinn-Phong-Lighting-Model" 
    }
  ],
  socials: [
    { label: "MAIL - adarshsen9115@gmail.com", link: "https://mail.google.com/mail/?view=cm&fs=1&to=adarshsen9115@gmail.com" },
    { label: "GITHUB", link: "https://github.com/Ads9115" },
    { label: "LINKEDIN", link: "https://www.linkedin.com/in/adarsh-sen-b5748934a/" },
    { label: "TWITTER / X", link: "https://x.com/CrumblingBrud" },
    { label: "INSTAGRAM", link: "https://www.instagram.com/crumbling_bread/?hl=en" }
  ]
};

export const DESKTOP_ICONS: DesktopIconConfig[] = [
  { id: 'icon-status', label: 'Status', iconEmoji: '👨‍💻', targetWindowId: 'window-status', defaultPos: { top: 20, left: 20 } },
  { id: 'icon-skills', label: 'Skills', iconEmoji: '⚙️', targetWindowId: 'window-skills', defaultPos: { top: 120, left: 20 } },
  { id: 'icon-projects', label: 'Projects', iconEmoji: '📁', targetWindowId: 'window-projects', defaultPos: { top: 220, left: 20 } },
  { id: 'icon-contact', label: 'Contact', iconEmoji: '✉️', targetWindowId: 'window-contact', defaultPos: { top: 320, left: 20 } },

  { id: 'icon-cmd', label: 'CMD.exe', iconEmoji: '⌨️', targetWindowId: 'window-cmd', defaultPos: { top: 20, left: 120 } },
  { id: 'icon-cube', label: '3D.exe', iconEmoji: '🧊', targetWindowId: 'window-cube', defaultPos: { top: 120, left: 120 } },
  { id: 'icon-paint', label: 'Paint.exe', iconEmoji: '🎨', targetWindowId: 'window-paint', defaultPos: { top: 220, left: 120 } },
  { id: 'icon-pong', label: 'Pong.exe', iconEmoji: '🕹️', targetWindowId: 'window-pong', defaultPos: { top: 320, left: 120 } },

  { id: 'icon-about', label: 'README', iconEmoji: '📝', targetWindowId: 'window-about', defaultPos: { top: 20, left: 220 } },
  { id: 'icon-resume', label: 'Resume', iconEmoji: '📄', targetWindowId: '', defaultPos: { top: 120, left: 220 } },
];
