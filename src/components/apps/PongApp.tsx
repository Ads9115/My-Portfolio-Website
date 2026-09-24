import React, { useState, useEffect, useRef } from 'react';
import { sfx } from '../../hooks/useAudioSynth';

export const PongApp: React.FC = () => {
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const playerWidth = 92;
    const aiWidth = 92;
    const paddleHeight = 10;
    const ballSize = 8;
    const topY = 14;
    const bottomY = canvas.height - 14 - paddleHeight;

    let playerX = (canvas.width - playerWidth) / 2;
    let aiX = (canvas.width - aiWidth) / 2;
    let ballX = (canvas.width - ballSize) / 2;
    let ballY = (canvas.height - ballSize) / 2;
    let ballVX = (Math.random() * 2 - 1) * 1.6;
    let ballVY = Math.random() > 0.5 ? 2.8 : -2.8;

    let leftPressed = false;
    let rightPressed = false;
    let animId: number;

    const resetBall = (direction: number) => {
      ballX = (canvas.width - ballSize) / 2;
      ballY = (canvas.height - ballSize) / 2;
      ballVX = (Math.random() * 2 - 1) * 1.6;
      ballVY = direction * 2.8;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') leftPressed = true;
      if (e.key === 'ArrowRight') rightPressed = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') leftPressed = false;
      if (e.key === 'ArrowRight') rightPressed = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const localX = (e.clientX - rect.left) * (canvas.width / rect.width);
      playerX = Math.max(0, Math.min(canvas.width - playerWidth, localX - playerWidth / 2));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const rect = canvas.getBoundingClientRect();
      const localX = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
      playerX = Math.max(0, Math.min(canvas.width - playerWidth, localX - playerWidth / 2));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    const gameLoop = () => {
      // Player movement via keyboard
      if (leftPressed) playerX -= 4.2;
      if (rightPressed) playerX += 4.2;
      playerX = Math.max(0, Math.min(canvas.width - playerWidth, playerX));

      // AI movement
      const aiCenter = aiX + aiWidth / 2;
      const ballCenter = ballX + ballSize / 2;
      if (aiCenter < ballCenter - 8) aiX += 2.4;
      else if (aiCenter > ballCenter + 8) aiX -= 2.4;
      aiX = Math.max(0, Math.min(canvas.width - aiWidth, aiX));

      // Ball movement
      ballX += ballVX;
      ballY += ballVY;

      // Side wall bounces
      if (ballX <= 0 || ballX + ballSize >= canvas.width) {
        ballX = Math.max(0, Math.min(canvas.width - ballSize, ballX));
        ballVX *= -1;
        sfx.pongWall();
      }

      // Top AI paddle collision
      if (
        ballVY < 0 &&
        ballY <= topY + paddleHeight &&
        ballY + ballSize >= topY &&
        ballX + ballSize >= aiX &&
        ballX <= aiX + aiWidth
      ) {
        ballY = topY + paddleHeight;
        ballVY = Math.abs(ballVY);
        const offset = (ballX + ballSize / 2 - (aiX + aiWidth / 2)) / (aiWidth / 2);
        ballVX += offset * 0.55;
        sfx.pongAiPaddle();
      }

      // Bottom Player paddle collision
      if (
        ballVY > 0 &&
        ballY + ballSize >= bottomY &&
        ballY <= bottomY + paddleHeight &&
        ballX + ballSize >= playerX &&
        ballX <= playerX + playerWidth
      ) {
        ballY = bottomY - ballSize;
        ballVY = -Math.abs(ballVY);
        const offset = (ballX + ballSize / 2 - (playerX + playerWidth / 2)) / (playerWidth / 2);
        ballVX += offset * 0.65;
        sfx.pongPlayerPaddle();
      }

      // Point scoring
      if (ballY + ballSize < 0) {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        sfx.pongPlayerScore();
        resetBall(-1);
      } else if (ballY > canvas.height) {
        setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
        sfx.pongAiScore();
        resetBall(1);
      }

      // Max velocity clamp
      if (Math.abs(ballVX) > 3.8) {
        ballVX = 3.8 * Math.sign(ballVX);
      }

      // Render
      ctx.fillStyle = '#05060d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center dashed net
      ctx.fillStyle = 'rgba(0, 255, 255, 0.35)';
      for (let y = 0; y < canvas.height; y += 18) {
        ctx.fillRect(canvas.width / 2 - 1, y, 2, 10);
      }

      // AI paddle
      ctx.fillStyle = '#ff4ad8';
      ctx.fillRect(aiX, topY, aiWidth, paddleHeight);

      // Player paddle
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(playerX, bottomY, playerWidth, paddleHeight);

      // Ball
      ctx.fillStyle = '#fff880';
      ctx.fillRect(ballX, ballY, ballSize, ballSize);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="pong-body">
      <div id="pong-score" className="pong-score">
        PLAYER {score.player} : {score.ai} CPU
      </div>
      <canvas id="pong-canvas" ref={canvasRef} width={560} height={320} />
      <div className="pong-help">Move mouse in the game window or use ← / → keys</div>
    </div>
  );
};
