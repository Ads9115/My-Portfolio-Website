//PERSONAL DATA CONFIGURATION

const PORTFOLIO_DATA = {
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


// SYSTEM LOGIC

document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL VARIABLES ---
    let highestZIndex = 20;
    let audioCtx = null;
    let isRendering3D = false;
    let isPongRunning = false;
    let isWindowGravityOn = false;
    let isPhysicsRunning = false;
    let isMatrixRunning = false;
    let matrixInterval = null;
    let matrixResizeHandler = null;
    let pongLoopId = null;
    let gravityLoopId = null;
    const windowBodies = new Map();
    const iconBodies = new Map();
    const initialIconPositions = new Map();
    const iconReturnPositions = new Map();
    const WINDOW_GRAVITY = 0.55;
    const WINDOW_BOUNCE = 0.45;
    const WINDOW_SIDE_BOUNCE = 0.55;
    const WINDOW_FRICTION = 0.985;
    const ICON_GRAVITY = 0.5;
    const ICON_BOUNCE = 0.38;
    const ICON_SIDE_BOUNCE = 0.5;
    const ICON_FRICTION = 0.98;
    const TASKBAR_HEIGHT = 40;
    const ufoMinTop = 36;
    const ufoMaxTop = 220;
    let sparks = [];

    // --- SINGLE GLOBAL DRAG STATE ---
    let dragEl = null, dragStartX = 0, dragStartY = 0, dragInitX = 0, dragInitY = 0;
    let dragMoved = false;

    // --- DRAG UTILITIES ---
    function bringToFront(el) {
        if (!el) return;
        highestZIndex++;
        el.style.zIndex = highestZIndex;
    }

    function getWindowBody(win) {
        let body = windowBodies.get(win);
        if (!body) {
            body = { x: win.offsetLeft, y: win.offsetTop, vx: 0, vy: 0 };
            windowBodies.set(win, body);
        }
        return body;
    }

    function syncBodyFromElement(win) {
        const body = getWindowBody(win);
        body.x = win.offsetLeft;
        body.y = win.offsetTop;
        return body;
    }

    function getIconBody(icon) {
        let body = iconBodies.get(icon);
        if (!body) {
            body = { x: icon.offsetLeft, y: icon.offsetTop, vx: 0, vy: 0 };
            iconBodies.set(icon, body);
        }
        return body;
    }

    function syncIconBodyFromElement(icon) {
        const body = getIconBody(icon);
        body.x = icon.offsetLeft;
        body.y = icon.offsetTop;
        return body;
    }

    function captureInitialIconPositions() {
        document.querySelectorAll('.icon').forEach(icon => {
            if (initialIconPositions.has(icon)) return;
            const left = Number.isFinite(parseFloat(icon.style.left)) ? parseFloat(icon.style.left) : icon.offsetLeft;
            const top = Number.isFinite(parseFloat(icon.style.top)) ? parseFloat(icon.style.top) : icon.offsetTop;
            initialIconPositions.set(icon, { left, top });
        });
    }

    function snapshotIconReturnPositions() {
        iconReturnPositions.clear();
        document.querySelectorAll('.icon').forEach(icon => {
            const left = Number.isFinite(parseFloat(icon.style.left)) ? parseFloat(icon.style.left) : icon.offsetLeft;
            const top = Number.isFinite(parseFloat(icon.style.top)) ? parseFloat(icon.style.top) : icon.offsetTop;
            iconReturnPositions.set(icon, { left, top });
        });
    }

    function restoreIconsToSavedPositions() {
        const mapToUse = iconReturnPositions.size ? iconReturnPositions : initialIconPositions;
        document.querySelectorAll('.icon').forEach(icon => {
            const pos = mapToUse.get(icon);
            if (!pos) return;
            icon.style.left = `${pos.left}px`;
            icon.style.top = `${pos.top}px`;
            iconBodies.delete(icon);
        });
    }

    function startWindowGravity() {
        if (isWindowGravityOn) return;
        isWindowGravityOn = true;
        snapshotIconReturnPositions();
        document.querySelectorAll('.window').forEach(win => {
            if (win.style.display !== 'none' && !win.classList.contains('maximized')) {
                const body = syncBodyFromElement(win);
                body.vx = 0;
                body.vy = 0;
            }
        });
        document.querySelectorAll('.icon').forEach(icon => {
            const body = syncIconBodyFromElement(icon);
            body.vx = 0;
            body.vy = 0;
        });
        runWindowGravity();
    }

    function stopWindowGravity() {
        isWindowGravityOn = false;
        if (gravityLoopId) {
            cancelAnimationFrame(gravityLoopId);
            gravityLoopId = null;
        }
        windowBodies.clear();
        iconBodies.clear();
    }

    function runWindowGravity() {
        if (!isWindowGravityOn) return;
        const floorY = window.innerHeight - TASKBAR_HEIGHT;
        const maxX = window.innerWidth;

        document.querySelectorAll('.window').forEach(win => {
            if (win.style.display === 'none' || win.classList.contains('maximized')) {
                windowBodies.delete(win);
                return;
            }

            const body = getWindowBody(win);
            if (dragEl === win) {
                body.x = win.offsetLeft;
                body.y = win.offsetTop;
                body.vx = 0;
                body.vy = 0;
                return;
            }

            body.vy += WINDOW_GRAVITY;
            body.x += body.vx;
            body.y += body.vy;

            const w = win.offsetWidth;
            const h = win.offsetHeight;

            if (body.x < 0) {
                body.x = 0;
                body.vx = Math.abs(body.vx) * WINDOW_SIDE_BOUNCE;
            }

            if (body.x + w > maxX) {
                body.x = Math.max(0, maxX - w);
                body.vx = -Math.abs(body.vx) * WINDOW_SIDE_BOUNCE;
            }

            if (body.y < 0) {
                body.y = 0;
                body.vy = Math.abs(body.vy) * WINDOW_BOUNCE;
            }

            if (body.y + h > floorY) {
                body.y = floorY - h;
                body.vy = -Math.abs(body.vy) * WINDOW_BOUNCE;
                body.vx *= 0.9;
                if (Math.abs(body.vy) < 0.8) body.vy = 0;
            }

            body.vx *= WINDOW_FRICTION;
            if (Math.abs(body.vx) < 0.05) body.vx = 0;

            win.style.left = `${body.x}px`;
            win.style.top = `${body.y}px`;
        });

        document.querySelectorAll('.icon').forEach(icon => {
            const body = getIconBody(icon);

            if (dragEl === icon) {
                body.x = icon.offsetLeft;
                body.y = icon.offsetTop;
                body.vx = 0;
                body.vy = 0;
                return;
            }

            body.vy += ICON_GRAVITY;
            body.x += body.vx;
            body.y += body.vy;

            const w = icon.offsetWidth;
            const h = icon.offsetHeight;

            if (body.x < 0) {
                body.x = 0;
                body.vx = Math.abs(body.vx) * ICON_SIDE_BOUNCE;
            }

            if (body.x + w > maxX) {
                body.x = Math.max(0, maxX - w);
                body.vx = -Math.abs(body.vx) * ICON_SIDE_BOUNCE;
            }

            if (body.y < 0) {
                body.y = 0;
                body.vy = Math.abs(body.vy) * ICON_BOUNCE;
            }

            if (body.y + h > floorY) {
                body.y = floorY - h;
                body.vy = -Math.abs(body.vy) * ICON_BOUNCE;
                body.vx *= 0.92;
                if (Math.abs(body.vy) < 0.65) body.vy = 0;
            }

            body.vx *= ICON_FRICTION;
            if (Math.abs(body.vx) < 0.04) body.vx = 0;

            icon.style.left = `${body.x}px`;
            icon.style.top = `${body.y}px`;
        });

        gravityLoopId = requestAnimationFrame(runWindowGravity);
    }

    document.addEventListener('mousemove', (e) => {
        if (!dragEl) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if (!dragMoved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        dragMoved = true;
        dragEl.style.left = `${dragInitX + dx}px`;
        dragEl.style.top  = `${dragInitY + dy}px`;
    });

    document.addEventListener('mouseup', () => { dragEl = null; });

    // --- AUDIO SYNTHESIZER ---
    function initAudio() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        } catch(e) {}
    }

    function playTone(freq, type, duration, vol = 0.1) {
        try {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(vol, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + duration);
        } catch(e) {}
    }

    const sfx = {
        click:    () => playTone(600, 'square', 0.05, 0.05),
        open:     () => { playTone(400, 'square', 0.1, 0.05); setTimeout(() => playTone(800, 'square', 0.15, 0.05), 100); },
        minimize: () => { playTone(800, 'square', 0.1, 0.05); setTimeout(() => playTone(400, 'square', 0.15, 0.05), 100); },
    };

    // --- INJECT DYNAMIC DATA & BIND PROJECT CLICKS ---
    function injectData() {
        // Status/Bio
        const statusHtml = `
            <div class="status-layout">
                <div class="avatar-box"><img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Adarsh" alt="Avatar"></div>
                <div class="status-text">
                    <p><strong>NAME:</strong> ${PORTFOLIO_DATA.profile.name}</p>
                    <p><strong>CLASS:</strong> ${PORTFOLIO_DATA.profile.level}</p>
                    <p><strong>BASE:</strong> ${PORTFOLIO_DATA.profile.location}</p>
                </div>
            </div>
            <hr>
            <p style="font-size: 20px; line-height: 1.4;">${PORTFOLIO_DATA.profile.bio}</p>
        `;
        const injectStatus = document.getElementById('inject-status');
        if(injectStatus) injectStatus.innerHTML = statusHtml;

        // Skills
        let skillsHtml = "";
        PORTFOLIO_DATA.skills.forEach(category => {
            skillsHtml += `<div class="skill-category"><strong>${category.category}</strong><ul class="skill-list">`;
            category.items.forEach(item => { skillsHtml += `<li>${item}</li>`; });
            skillsHtml += `</ul></div>`;
        });
        const injectSkills = document.getElementById('inject-skills');
        if(injectSkills) injectSkills.innerHTML = skillsHtml;

        // Projects
        let projHtml = "";
        PORTFOLIO_DATA.projects.forEach((proj, index) => {
            projHtml += `
                <div class="project-item interactive" data-index="${index}">
                    <div class="proj-icon">${proj.icon}</div>
                    <div class="proj-details">
                        <strong>${proj.title}</strong>
                        <p>${proj.desc.substring(0, 60)}...</p>
                    </div>
                </div>
            `;
        });
        const injectProjects = document.getElementById('inject-projects');
        if(injectProjects) injectProjects.innerHTML = projHtml;

        // --- BIND CLICKS FOR DYNAMIC PROJECTS ---
        // This makes sure clicking a project opens the details window!
        document.querySelectorAll('.project-item.interactive').forEach(item => {
            item.addEventListener('click', () => {
                sfx.click(); // Play sound
                const index = item.getAttribute('data-index');
                const data = PORTFOLIO_DATA.projects[index];
                if (!data) return;
                
                // Populate the detail window
                document.getElementById('detail-title').innerText = data.title;
                document.getElementById('detail-tech').innerText  = data.tech || "Various";
                document.getElementById('detail-desc').innerHTML  = data.desc;
                const detailLink = document.getElementById('detail-link');
                detailLink.href = data.link;
                detailLink.innerText = data.linkLabel || "Open GitHub Repo";
                
                // Show the window
                const win = document.getElementById('window-project-details');
                if (win) { 
                    win.style.display = 'flex'; 
                    bringToFront(win); 
                    sfx.open();
                }
            });
        });

        // Social Links
        let contactHtml = "";
        PORTFOLIO_DATA.socials.forEach(social => {
            contactHtml += `<a href="${social.link}" target="_blank" rel="noopener noreferrer" class="win-btn">${social.label}</a>`;
        });
        const injectContact = document.getElementById('inject-contact');
        if(injectContact) injectContact.innerHTML = contactHtml;
    }
    
    injectData(); // Run injection immediately
    document.addEventListener('pointerdown', initAudio, { once: true });

    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, a, .interactive-btn, .icon, .color-swatch')) sfx.click();
    });

    // --- STARS ---
    const sky = document.getElementById('sky-container');
    if (sky) {
        for (let i = 0; i < 95; i++) {
            const star = document.createElement('div');
            const starSize = Math.random() > 0.68 ? 4 : 3;
            star.className = 'star';
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top  = Math.random() * 68 + 'vh';
            star.style.width = starSize + 'px';
            star.style.height = starSize + 'px';
            star.style.animationDuration = (Math.random() * 2 + 1) + 's';
            star.style.animationDelay    = (Math.random() * 2) + 's';
            sky.appendChild(star);
        }
    }

    // --- DESKTOP PET & UFO ---
    const pet = document.getElementById('desktop-pet');
    if (pet) {
        let petBoopTimeout = null;

        const boopPet = (e) => {
            e.stopPropagation();
            if (e.cancelable) e.preventDefault();
            initAudio();
            playTone(300, 'sine', 0.1, 0.1);
            pet.classList.remove('pet-booped');
            void pet.offsetWidth;
            pet.classList.add('pet-booped');
            if (petBoopTimeout) clearTimeout(petBoopTimeout);
            petBoopTimeout = setTimeout(() => pet.classList.remove('pet-booped'), 240);
        };

        setInterval(() => { 
            const newX = Math.random() * (window.innerWidth - 100);
            const currentX = Number.isFinite(parseFloat(pet.style.left)) ? parseFloat(pet.style.left) : pet.offsetLeft;
            pet.style.setProperty('--pet-face', newX < currentX ? '-1' : '1');
            pet.style.left = newX + 'px'; 
        }, 4000);
        pet.addEventListener('pointerdown', boopPet);
        pet.addEventListener('click', boopPet);
    }

    const ufo = document.getElementById('ufo');
    if (ufo) {
        setInterval(() => {
            if (Math.random() > 0.9) {
                ufo.style.transition = 'none';
                ufo.style.left = '-140px';
                ufo.style.top = (Math.random() * (ufoMaxTop - ufoMinTop) + ufoMinTop) + 'px';
                setTimeout(() => {
                    ufo.style.transition = 'left 8s linear, top 4s ease-in-out';
                    ufo.style.left = (window.innerWidth + 140) + 'px';
                    ufo.style.top = (Math.random() * (ufoMaxTop - ufoMinTop) + ufoMinTop) + 'px';
                }, 50);
            }
        }, 10000);
    }

    // --- MOUSE SPARKLES ---
    let lastSparkTime = 0;
    document.addEventListener('mousemove', (e) => {
        if (Date.now() - lastSparkTime > 30) {
            const sp = document.createElement('div');
            sp.className = 'mouse-sparkle';
            sp.style.left = e.clientX + 'px';
            sp.style.top  = e.clientY + 'px';
            sp.style.background = Math.random() > 0.5 ? '#ff00ff' : '#00ffff';
            document.body.appendChild(sp);
            setTimeout(() => sp.remove(), 500);
            lastSparkTime = Date.now();
        }
    });

    // --- PHYSICS SPARKS (clicking bare desktop) ---
    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.addEventListener('mousedown', (e) => {
            const id = e.target.id;
            if (id !== 'desktop' && id !== 'grid-lines' && id !== 'sky-container') return;
            playTone(700, 'triangle', 0.1, 0.05);
            for (let i = 0; i < Math.floor(Math.random() * 4) + 5; i++) {
                const sp = document.createElement('div');
                sp.className = 'physics-spark';
                sp.style.left = e.clientX + 'px';
                sp.style.top  = e.clientY + 'px';
                sp.style.backgroundColor = Math.random() > 0.5 ? '#ff00ff' : '#ffff00';
                desktop.appendChild(sp);
                sparks.push({ el: sp, x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 15, vy: (Math.random() * -10) - 5 });
            }
            if (!isPhysicsRunning) { isPhysicsRunning = true; physicsLoop(); }
        });
    }

    function physicsLoop() {
        if (sparks.length === 0) { isPhysicsRunning = false; return; }
        const floorY = window.innerHeight - 40;
        for (let i = sparks.length - 1; i >= 0; i--) {
            const p = sparks[i];
            p.vy += 0.8; p.x += p.vx; p.y += p.vy;
            if (p.y > floorY) {
                p.y = floorY; p.vy *= -0.6; p.vx *= 0.8;
                if (Math.abs(p.vy) < 1) { p.el.remove(); sparks.splice(i, 1); continue; }
            }
            p.el.style.left = p.x + 'px';
            p.el.style.top  = p.y + 'px';
        }
        requestAnimationFrame(physicsLoop);
    }

    // --- KONAMI CODE ---
    const konamiCode = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.body.classList.toggle('konami-mode');
                playTone(200, 'square', 0.5, 0.2);
                setTimeout(() => playTone(300, 'square', 0.5, 0.2), 200);
                konamiIndex = 0;
            }
        } else { konamiIndex = 0; }
    });

    // --- CLOCK ---
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        const tick = () => {
            const now = new Date();
            const h = now.getHours(), m = now.getMinutes();
            clockEl.innerText = `${h % 12 || 12}:${m < 10 ? '0' + m : m} ${h >= 12 ? 'PM' : 'AM'}`;
        };
        tick(); setInterval(tick, 1000);
    }

    // --- INITIALIZE WINDOW DRAGGING ---
    function makeDraggable(element, handle) {
        if (!element || !handle) return;
        element.addEventListener('mousedown', () => bringToFront(element));
        handle.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            if (element.classList.contains('maximized')) return;
            dragMoved  = false; dragEl = element;
            dragStartX = e.clientX; dragStartY = e.clientY;
            dragInitX  = element.offsetLeft; dragInitY  = element.offsetTop;
        });
    }

    document.querySelectorAll('.window').forEach(win => {
        makeDraggable(win, win.querySelector('.title-bar'));

        const closeBtn = win.querySelector('.close-btn');
        const minBtn   = win.querySelector('.min-btn');
        const maxBtn   = win.querySelector('.max-btn');
        let preMax = {};

        if (closeBtn) closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); win.style.display = 'none';
            if (win.id === 'window-cube')    isRendering3D = false;
            if (win.id === 'window-pong')    stopPongGame();
            windowBodies.delete(win);
        });

        if (minBtn) minBtn.addEventListener('click', (e) => {
            e.stopPropagation(); sfx.minimize(); win.style.display = 'none';
            if (win.id === 'window-pong') stopPongGame();
            windowBodies.delete(win);
        });

        if (maxBtn) maxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!win.classList.contains('maximized')) {
                preMax = { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height };
                win.style.top = '0'; win.style.left = '0';
                win.style.width = '100vw';
                win.style.height = 'calc(100vh - 40px)';
                win.style.height = 'calc(100dvh - 40px)';
                win.classList.add('maximized');
                windowBodies.delete(win);
            } else {
                win.style.top = preMax.top; win.style.left = preMax.left;
                win.style.width = preMax.width; win.style.height = preMax.height;
                win.classList.remove('maximized');
                if (isWindowGravityOn) {
                    const body = syncBodyFromElement(win);
                    body.vx = 0;
                    body.vy = 0;
                }
            }
        });
    });

    // --- ICONS & OPENING WINDOWS ---
    function openWindow(targetId) {
        const win = document.getElementById(targetId);
        if (!win) return;
        win.style.display = 'flex'; bringToFront(win); sfx.open();
        if (isWindowGravityOn && !win.classList.contains('maximized')) {
            const body = syncBodyFromElement(win);
            body.vx = 0;
            body.vy = Math.max(body.vy, 1.2);
        }
        if (win.id === 'window-cube'    && !isRendering3D) { isRendering3D = true; renderCube();  }
        if (win.id === 'window-pong'    && !isPongRunning) { startPongGame(); }
        if (win.id === 'window-cmd') { const i = document.getElementById('cmd-input'); if (i) i.focus(); }
    }

    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('mousedown', (e) => {
            dragMoved  = false; dragEl = icon;
            dragStartX = e.clientX; dragStartY = e.clientY;
            dragInitX  = icon.offsetLeft; dragInitY  = icon.offsetTop;
            bringToFront(icon);
        });

        icon.addEventListener('click', () => {
            if (dragMoved) return; // was dragged, not clicked
            openWindow(icon.getAttribute('data-target'));
        });
    });
    captureInitialIconPositions();

    // --- START MENU ---
    const startBtn  = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const visible = startMenu.style.display !== 'none';
            startMenu.style.display = visible ? 'none' : 'flex';
            startBtn.classList.toggle('active', !visible);
        });
        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                startMenu.style.display = 'none'; startBtn.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.start-item[data-target]').forEach(item => {
        item.addEventListener('click', () => {
            openWindow(item.getAttribute('data-target'));
            if (startMenu) startMenu.style.display = 'none';
            if (startBtn)  startBtn.classList.remove('active');
        });
    });

    // --- TERMINAL ---
    const cmdInput  = document.getElementById('cmd-input');
    const cmdOutput = document.getElementById('cmd-output');
    const cmdBody   = document.getElementById('cmd-body');

    if (cmdInput && cmdOutput && cmdBody) {
        function printCmd(text, color = '#33ff33') {
            const div = document.createElement('div');
            div.style.color = color;
            div.innerHTML = text;
            cmdOutput.appendChild(div);
            cmdBody.scrollTop = cmdBody.scrollHeight;
        }
        cmdBody.addEventListener('click', () => cmdInput.focus());
        cmdInput.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const val = cmdInput.value.trim().toLowerCase();
            printCmd('C:\\&gt; ' + cmdInput.value);
            cmdInput.value = '';
            if (val === 'help') {
                ['Available commands:','- help      : Shows this menu','- matrix    : Toggles matrix override',
                 '- gravity on: Enable window and icon gravity physics',
                 '- gravity off: Disable window and icon gravity physics',
                 '- shake     : Simulates hardware failure',
                 '- clear     : Clears terminal output','- blackhole : [CLASSIFIED]'].forEach(l => printCmd(l));
            } else if (val === 'clear') {
                cmdOutput.innerHTML = '';
            } else if (val === 'gravity on') {
                if (!isWindowGravityOn) {
                    startWindowGravity();
                    printCmd('Window and icon gravity enabled. Physics engine online.', '#00ffff');
                    playTone(240, 'sawtooth', 0.08, 0.05);
                } else {
                    printCmd('Window gravity is already enabled.', '#ffff00');
                }
            } else if (val === 'gravity off') {
                if (isWindowGravityOn) {
                    stopWindowGravity();
                    restoreIconsToSavedPositions();
                    printCmd('Window and icon gravity disabled. Icons restored.', '#ffff00');
                    playTone(420, 'triangle', 0.08, 0.04);
                } else {
                    printCmd('Window gravity is already disabled.', '#ffff00');
                }
            } else if (val === 'gravity') {
                printCmd('Usage: gravity on | gravity off', '#00ffff');
            } else if (val === 'shake') {
                document.body.classList.add('shake-mode');
                playTone(100, 'sawtooth', 1.0, 0.2);
                setTimeout(() => document.body.classList.remove('shake-mode'), 1000);
                printCmd('Hardware failure simulated.', '#ffff00');
            } else if (val === 'blackhole') {
                printCmd('WARNING: GRAVITY ANOMALY DETECTED.', '#ff0000');
                document.querySelectorAll('.icon, .window').forEach(el => {
                    el.style.transition = 'all 3s cubic-bezier(0.5,0,0.5,1)';
                    el.style.transform  = 'rotate(720deg) scale(0)';
                    el.style.top = '50%'; el.style.left = '50%';
                });
                setTimeout(() => location.reload(), 4000);
            } else if (val === 'matrix') {
                isMatrixRunning = !isMatrixRunning;
                const mc = document.getElementById('matrix-canvas');
                if (isMatrixRunning) { printCmd('Matrix override initiated.', '#00ffff'); mc.style.display = 'block'; startMatrix(mc); }
                else {
                    printCmd('Matrix override terminated.', '#ff0000');
                    mc.style.display = 'none';
                    clearInterval(matrixInterval);
                    if (matrixResizeHandler) {
                        window.removeEventListener('resize', matrixResizeHandler);
                        matrixResizeHandler = null;
                    }
                }
            } else if (val) {
                printCmd("'" + val + "' is not recognized as an internal or external command.", '#ff0000');
            }
        });
    }

    function startMatrix(canvas) {
        const ctx = canvas.getContext('2d');
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
        const fs = 16;
        let drops = [];

        if (matrixResizeHandler) window.removeEventListener('resize', matrixResizeHandler);
        matrixResizeHandler = () => {
            const desktopArea = document.getElementById('desktop');
            canvas.width = desktopArea ? desktopArea.clientWidth : window.innerWidth;
            canvas.height = desktopArea ? desktopArea.clientHeight : (window.innerHeight - 40);
            drops = Array.from({ length: Math.floor(canvas.width / fs) }, () => 1);
        };
        matrixResizeHandler();
        window.addEventListener('resize', matrixResizeHandler);
        matrixInterval = setInterval(() => {
            ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0'; ctx.font = fs + 'px monospace';
            drops.forEach((d, i) => {
                ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fs, d * fs);
                if (d * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        }, 33);
    }

    // --- 3D CUBE ---
    function renderCube() {
        if (!isRendering3D) return;
        const rCanvas = document.getElementById('render-canvas');
        if (!rCanvas) return;
        const rCtx = rCanvas.getContext('2d');
        const verts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
        const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        let angle = 0;
        (function frame() {
            if (!isRendering3D) return;
            rCtx.fillStyle = '#000'; rCtx.fillRect(0, 0, rCanvas.width, rCanvas.height);
            angle += 0.02;
            const s = Math.sin(angle), c = Math.cos(angle);
            const p = verts.map(v => {
                const x = v[0]*c - v[2]*s, z = v[0]*s + v[2]*c, y = v[1]*c - z*s;
                return { x: x*60 + rCanvas.width/2, y: y*60 + rCanvas.height/2 };
            });
            rCtx.strokeStyle = '#00ffff'; rCtx.lineWidth = 2; rCtx.beginPath();
            edges.forEach(e => { rCtx.moveTo(p[e[0]].x, p[e[0]].y); rCtx.lineTo(p[e[1]].x, p[e[1]].y); });
            rCtx.stroke();
            rCtx.fillStyle = '#ff00ff';
            p.forEach(pt => { rCtx.beginPath(); rCtx.arc(pt.x, pt.y, 4, 0, Math.PI*2); rCtx.fill(); });
            requestAnimationFrame(frame);
        })();
    }

    // --- PONG MINI-GAME ---
    function clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    const pong = {
        canvas: null,
        ctx: null,
        playerX: 0,
        aiX: 0,
        playerWidth: 92,
        aiWidth: 92,
        paddleHeight: 10,
        ballX: 0,
        ballY: 0,
        ballVX: 0,
        ballVY: 0,
        ballSize: 8,
        playerScore: 0,
        aiScore: 0,
        leftPressed: false,
        rightPressed: false
    };

    function updatePongScore(textOverride = null) {
        const scoreEl = document.getElementById('pong-score');
        if (!scoreEl) return;
        scoreEl.textContent = textOverride || `PLAYER ${pong.playerScore} : ${pong.aiScore} CPU`;
    }

    function resetPongBall(direction = Math.random() > 0.5 ? 1 : -1) {
        if (!pong.canvas) return;
        pong.ballX = (pong.canvas.width - pong.ballSize) / 2;
        pong.ballY = (pong.canvas.height - pong.ballSize) / 2;
        pong.ballVX = (Math.random() * 2 - 1) * 1.6;
        pong.ballVY = direction * 2.8;
    }

    function initPongGame() {
        if (pong.canvas) return;
        const canvas = document.getElementById('pong-canvas');
        if (!canvas) return;

        pong.canvas = canvas;
        pong.ctx = canvas.getContext('2d');
        pong.playerX = (canvas.width - pong.playerWidth) / 2;
        pong.aiX = (canvas.width - pong.aiWidth) / 2;
        updatePongScore();
        resetPongBall();

        const syncPlayerToCursor = (clientX) => {
            const rect = canvas.getBoundingClientRect();
            const localX = (clientX - rect.left) * (canvas.width / rect.width);
            pong.playerX = clamp(localX - pong.playerWidth / 2, 0, canvas.width - pong.playerWidth);
        };

        canvas.addEventListener('mousemove', (e) => syncPlayerToCursor(e.clientX));
        canvas.addEventListener('touchmove', (e) => {
            if (!e.touches.length) return;
            syncPlayerToCursor(e.touches[0].clientX);
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('keydown', (e) => {
            const pongVisible = document.getElementById('window-pong')?.style.display !== 'none';
            if (e.key === 'ArrowLeft') {
                pong.leftPressed = true;
                if (pongVisible) e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                pong.rightPressed = true;
                if (pongVisible) e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') pong.leftPressed = false;
            if (e.key === 'ArrowRight') pong.rightPressed = false;
        });
    }

    function stopPongGame() {
        isPongRunning = false;
        if (pongLoopId) {
            cancelAnimationFrame(pongLoopId);
            pongLoopId = null;
        }
    }

    function startPongGame() {
        initPongGame();
        if (!pong.canvas || !pong.ctx || isPongRunning) return;
        isPongRunning = true;

        const run = () => {
            if (!isPongRunning || !pong.canvas || !pong.ctx) return;

            const c = pong.canvas;
            const ctx = pong.ctx;
            const topY = 14;
            const bottomY = c.height - 14 - pong.paddleHeight;

            if (pong.leftPressed) pong.playerX -= 4.2;
            if (pong.rightPressed) pong.playerX += 4.2;
            pong.playerX = clamp(pong.playerX, 0, c.width - pong.playerWidth);

            const aiCenter = pong.aiX + pong.aiWidth / 2;
            const ballCenter = pong.ballX + pong.ballSize / 2;
            if (aiCenter < ballCenter - 8) pong.aiX += 2.4;
            else if (aiCenter > ballCenter + 8) pong.aiX -= 2.4;
            pong.aiX = clamp(pong.aiX, 0, c.width - pong.aiWidth);

            pong.ballX += pong.ballVX;
            pong.ballY += pong.ballVY;

            if (pong.ballX <= 0 || pong.ballX + pong.ballSize >= c.width) {
                pong.ballX = clamp(pong.ballX, 0, c.width - pong.ballSize);
                pong.ballVX *= -1;
                playTone(720, 'square', 0.03, 0.03);
            }

            if (
                pong.ballVY < 0 &&
                pong.ballY <= topY + pong.paddleHeight &&
                pong.ballY + pong.ballSize >= topY &&
                pong.ballX + pong.ballSize >= pong.aiX &&
                pong.ballX <= pong.aiX + pong.aiWidth
            ) {
                pong.ballY = topY + pong.paddleHeight;
                pong.ballVY = Math.abs(pong.ballVY);
                const offset = ((pong.ballX + pong.ballSize / 2) - (pong.aiX + pong.aiWidth / 2)) / (pong.aiWidth / 2);
                pong.ballVX += offset * 0.55;
                playTone(430, 'triangle', 0.04, 0.03);
            }

            if (
                pong.ballVY > 0 &&
                pong.ballY + pong.ballSize >= bottomY &&
                pong.ballY <= bottomY + pong.paddleHeight &&
                pong.ballX + pong.ballSize >= pong.playerX &&
                pong.ballX <= pong.playerX + pong.playerWidth
            ) {
                pong.ballY = bottomY - pong.ballSize;
                pong.ballVY = -Math.abs(pong.ballVY);
                const offset = ((pong.ballX + pong.ballSize / 2) - (pong.playerX + pong.playerWidth / 2)) / (pong.playerWidth / 2);
                pong.ballVX += offset * 0.65;
                playTone(560, 'square', 0.04, 0.03);
            }

            if (pong.ballY + pong.ballSize < 0) {
                pong.playerScore++;
                updatePongScore();
                playTone(920, 'sawtooth', 0.08, 0.05);
                resetPongBall(-1);
            } else if (pong.ballY > c.height) {
                pong.aiScore++;
                updatePongScore();
                playTone(180, 'sawtooth', 0.08, 0.05);
                resetPongBall(1);
            }

            if (Math.abs(pong.ballVX) > 3.8) pong.ballVX = 3.8 * Math.sign(pong.ballVX);

            ctx.fillStyle = '#05060d';
            ctx.fillRect(0, 0, c.width, c.height);

            ctx.fillStyle = 'rgba(0, 255, 255, 0.35)';
            for (let y = 0; y < c.height; y += 18) ctx.fillRect(c.width / 2 - 1, y, 2, 10);

            ctx.fillStyle = '#ff4ad8';
            ctx.fillRect(pong.aiX, topY, pong.aiWidth, pong.paddleHeight);

            ctx.fillStyle = '#00ffff';
            ctx.fillRect(pong.playerX, bottomY, pong.playerWidth, pong.paddleHeight);

            ctx.fillStyle = '#fff880';
            ctx.fillRect(pong.ballX, pong.ballY, pong.ballSize, pong.ballSize);

            pongLoopId = requestAnimationFrame(run);
        };

        run();
    }

    // --- PAINT ---
    const pCanvas = document.getElementById('paint-canvas');
    if (pCanvas) {
        const pCtx = pCanvas.getContext('2d');
        let isDrawing = false, brushColor = '#000000';
        pCtx.fillStyle = '#ffffff'; pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
        document.querySelectorAll('.color-swatch').forEach(sw => {
            sw.addEventListener('click', () => {
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                sw.classList.add('active');
                brushColor = sw.getAttribute('data-color');
            });
        });
        const clearBtn = document.getElementById('clear-canvas');
        if (clearBtn) clearBtn.addEventListener('click', () => {
            pCtx.fillStyle = '#ffffff'; pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
            playTone(200, 'sawtooth', 0.1, 0.1);
        });
        const draw = (e) => {
            if (!isDrawing) return;
            const r = pCanvas.getBoundingClientRect();
            pCtx.fillStyle = brushColor;
            pCtx.fillRect(Math.floor((e.clientX-r.left)/5)*5, Math.floor((e.clientY-r.top)/5)*5, 5, 5);
        };
        pCanvas.addEventListener('mousedown', (e) => { isDrawing = true; draw(e); });
        pCanvas.addEventListener('mousemove', draw);
        pCanvas.addEventListener('mouseup',  () => isDrawing = false);
        pCanvas.addEventListener('mouseout', () => isDrawing = false);
    }

});