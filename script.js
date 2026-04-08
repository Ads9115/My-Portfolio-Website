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
            items: ["Photoshop", "Illustrator", "After Effects", "Figma"]
        }
    ],
    projects: [
        { 
            title: "Custom 3D Math Library", 
            icon: "📐",
            tech: "C++",
            desc: "Highly optimized vector and matrix operations built entirely from scratch in C++ for custom engine architecture. Avoids external dependencies.", 
            link: "https://github.com/Ads9115/Mathlib" 
        },
        { 
            title: "GL Debug Draw", 
            icon: "🐛",
            tech: "C++, OpenGL",
            desc: "An OpenGL utility library designed for easily drawing debug primitives, bounding boxes, and lines during engine development.", 
            link: "https://github.com/Ads9115/gl-debug-draw" 
        },
        { 
            title: "Grass Rendering Pipeline", 
            icon: "🌿",
            tech: "C++, OpenGL, GLSL",
            desc: "A custom shader-based rendering pipeline in OpenGL focused on efficiently rendering massive amounts of dynamic foliage/grass.", 
            link: "https://github.com/Ads9115/Grass-rendering-OpenGL" 
        },
        { 
            title: "2D Gravity Simulation", 
            icon: "🌍",
            tech: "C++",
            desc: "A physics simulation modeling gravitational interactions in a 2D space, applying fundamental math and physics logic.", 
            link: "https://github.com/Ads9115/2D-Simulation-of-Gravity" 
        },
        { 
            title: "Blinn-Phong Lighting", 
            icon: "💡",
            tech: "C++, OpenGL, GLSL",
            desc: "A low-level implementation of the classic Blinn-Phong reflection model to calculate specular highlights and diffuse lighting.", 
            link: "https://github.com/Ads9115/Blinn-Phong-Lighting-Model" 
        },
        { 
            title: "Manual Matrix Transforms", 
            icon: "🔄",
            tech: "C++, Math",
            desc: "A math-heavy demonstration calculating and applying 3D rotation and projection matrices entirely manually.", 
            link: "https://github.com/Ads9115/Manual-Rotation-Projection-Demo" 
        }
    ],
    socials: [
        { label: "📧 SEND EMAIL", link: "mailto:adarshsen9115@gmail.com" },
        { label: "🐙 GITHUB", link: "https://github.com/Ads9115" },
        { label: "💼 LINKEDIN", link: "https://www.linkedin.com/in/adarsh-sen-b5748934a/" },
        { label: "🐦 TWITTER / X", link: "https://x.com/CrumblingBrud" },
        { label: "📸 INSTAGRAM", link: "https://www.instagram.com/crumbling_bread/?hl=en" }
    ]
};


// SYSTEM LOGIC

document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL VARIABLES ---
    let highestZIndex = 20;
    let audioCtx = null;
    let isBouncing = false;
    let isRendering3D = false;
    let isPhysicsRunning = false;
    let isMatrixRunning = false;
    let matrixInterval = null;
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
                document.getElementById('detail-link').href       = data.link;
                
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
            contactHtml += `<a href="${social.link}" target="_blank" class="win-btn">${social.label}</a>`;
        });
        const injectContact = document.getElementById('inject-contact');
        if(injectContact) injectContact.innerHTML = contactHtml;
    }
    
    injectData(); // Run injection immediately

    // --- BOOT SCREEN ---
    const bootScreen = document.getElementById('boot-screen');
    if (bootScreen) {
        bootScreen.addEventListener('click', (e) => {
            initAudio(); sfx.open();
            e.currentTarget.style.pointerEvents = 'none'; 
            e.currentTarget.style.opacity = '0';
            setTimeout(() => { e.currentTarget.style.display = 'none'; }, 500);
        });
    }

    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, a, .interactive-btn, .icon, .color-swatch')) sfx.click();
    });

    // --- STARS ---
    const sky = document.getElementById('sky-container');
    if (sky) {
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top  = Math.random() * 60 + 'vh';
            star.style.animationDuration = (Math.random() * 2 + 1) + 's';
            star.style.animationDelay    = (Math.random() * 2) + 's';
            sky.appendChild(star);
        }
    }

    // --- DESKTOP PET & UFO ---
    const pet = document.getElementById('desktop-pet');
    if (pet) {
        setInterval(() => { 
            const newX = Math.random() * (window.innerWidth - 100);
            pet.style.transform = (newX < parseInt(pet.style.left || 0)) ? "scaleX(-1)" : "scaleX(1)";
            pet.style.left = newX + 'px'; 
        }, 4000);
        pet.addEventListener('mousedown', (e) => {
            e.stopPropagation(); playTone(300, 'sine', 0.1, 0.1);
            pet.style.height = '8px'; setTimeout(() => { pet.style.height = '16px'; }, 150);
        });
    }

    const ufo = document.getElementById('ufo');
    if (ufo) {
        setInterval(() => {
            if (Math.random() > 0.9) {
                ufo.style.transition = 'none'; ufo.style.left = '-100px'; ufo.style.top  = (Math.random() * 200) + 'px';
                setTimeout(() => {
                    ufo.style.transition = 'left 8s linear, top 4s ease-in-out';
                    ufo.style.left = (window.innerWidth + 100) + 'px'; ufo.style.top  = (Math.random() * 200) + 'px';
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
            if (win.id === 'window-bouncer') isBouncing = false;
            if (win.id === 'window-cube')    isRendering3D = false;
        });

        if (minBtn) minBtn.addEventListener('click', (e) => {
            e.stopPropagation(); sfx.minimize(); win.style.display = 'none';
        });

        if (maxBtn) maxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!win.classList.contains('maximized')) {
                preMax = { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height };
                win.style.top = '0'; win.style.left = '0';
                win.style.width = '100vw'; win.style.height = 'calc(100vh - 40px)';
                win.classList.add('maximized');
            } else {
                win.style.top = preMax.top; win.style.left = preMax.left;
                win.style.width = preMax.width; win.style.height = preMax.height;
                win.classList.remove('maximized');
            }
        });
    });

    // --- ICONS & OPENING WINDOWS ---
    function openWindow(targetId) {
        const win = document.getElementById(targetId);
        if (!win) return;
        win.style.display = 'flex'; bringToFront(win); sfx.open();
        if (win.id === 'window-bouncer' && !isBouncing)    { isBouncing    = true; animateLogo(); }
        if (win.id === 'window-cube'    && !isRendering3D) { isRendering3D = true; renderCube();  }
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
                 '- hack      : Bypasses mainframe security','- shake     : Simulates hardware failure',
                 '- clear     : Clears terminal output','- blackhole : [CLASSIFIED]'].forEach(l => printCmd(l));
            } else if (val === 'clear') {
                cmdOutput.innerHTML = '';
            } else if (val === 'shake') {
                document.body.classList.add('shake-mode');
                playTone(100, 'sawtooth', 1.0, 0.2);
                setTimeout(() => document.body.classList.remove('shake-mode'), 1000);
                printCmd('Hardware failure simulated.', '#ffff00');
            } else if (val === 'hack') {
                printCmd('Initializing bypass...', '#ffff00');
                let count = 0;
                const hi = setInterval(() => {
                    printCmd('[' + Math.random().toString(36).substring(2,10) + '] Unpacking payload...');
                    if (++count > 5) { clearInterval(hi); printCmd('ACCESS GRANTED.', '#00ffff'); }
                }, 300);
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
                else { printCmd('Matrix override terminated.', '#ff0000'); mc.style.display = 'none'; clearInterval(matrixInterval); }
            } else if (val) {
                printCmd("'" + val + "' is not recognized as an internal or external command.", '#ff0000');
            }
        });
    }

    function startMatrix(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
        const fs = 16;
        const drops = Array.from({ length: Math.floor(canvas.width / fs) }, () => 1);
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

    // --- BOUNCING LOGO ---
    function animateLogo() {
        const logo = document.getElementById('bouncing-logo');
        const bwin = document.getElementById('window-bouncer');
        if (!logo || !bwin) return;
        const body = bwin.querySelector('.window-body');
        const colors = ['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff'];
        let lx = 10, ly = 10, ldx = 2, ldy = 2, ci = 0;
        (function bounce() {
            if (!isBouncing) return;
            const r1 = body.getBoundingClientRect(), r2 = logo.getBoundingClientRect();
            if (lx + r2.width >= r1.width  || lx <= 0) { ldx = -ldx; logo.style.color = colors[ci = (ci+1)%colors.length]; playTone(400,'triangle',0.05,0.02); }
            if (ly + r2.height >= r1.height || ly <= 0) { ldy = -ldy; logo.style.color = colors[ci = (ci+1)%colors.length]; playTone(400,'triangle',0.05,0.02); }
            lx += ldx; ly += ldy;
            logo.style.left = lx + 'px'; logo.style.top = ly + 'px';
            requestAnimationFrame(bounce);
        })();
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