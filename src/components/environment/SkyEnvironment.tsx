import React, { useMemo } from 'react';

interface StarProps {
  left: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
}

export const SkyEnvironment: React.FC = () => {
  const stars = useMemo(() => {
    const starCount = 55;
    const generated: StarProps[] = [];
    for (let i = 0; i < starCount; i++) {
      const size = Math.random() > 0.68 ? 4 : 3;
      generated.push({
        left: `${(Math.random() * 100).toFixed(2)}vw`,
        top: `${(Math.random() * 68).toFixed(2)}vh`,
        size,
        duration: `${(Math.random() * 2 + 1).toFixed(2)}s`,
        delay: `${(Math.random() * 2).toFixed(2)}s`
      });
    }
    return generated;
  }, []);

  return (
    <>
      <div id="wallpaper-vignette" aria-hidden="true" />
      <div id="sky-container" aria-hidden="true">
        {stars.map((star, idx) => (
          <div
            key={idx}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: star.duration,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>
      <div id="aurora-band" aria-hidden="true" />
      <div className="shooting-star" aria-hidden="true" />
      <div id="synth-sun" aria-hidden="true" />
      <div id="arcade-city" aria-hidden="true" />
      <div id="pixel-mountains" aria-hidden="true">
        <div className="mountain mountain-1" />
        <div className="mountain mountain-2" />
        <div className="mountain mountain-3" />
      </div>
      <div className="cloud cloud-1" aria-hidden="true" />
      <div className="cloud cloud-2" aria-hidden="true" />
      <div className="cloud cloud-3" aria-hidden="true" />
      <div className="pixel-object pixel-invader" aria-hidden="true" />
      <div className="pixel-object pixel-coin" aria-hidden="true" />
      <div className="pixel-object pixel-racer" aria-hidden="true" />
      <div className="pixel-object pixel-orb" aria-hidden="true" />
      <div id="ground" aria-hidden="true">
        <div id="grid-lines" />
      </div>
    </>
  );
};
