// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCanvasParticles();
    initAgentSimulator();
    initSpotlightCards();
    initScrollReveal();
});

/* Navigation Logic */
function initNavigation() {
    const header = document.querySelector('header.site-header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/* Canvas Particle Network Background */
function initCanvasParticles() {
    const canvas = document.getElementById('canvas-network');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Resize canvas
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            // Movement speed
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
        }

        update() {
            // Idle bounce
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse interaction (pull particles slightly towards mouse)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * 0.8;
                    this.y += (dy / distance) * force * 0.8;
                }
            }
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Populate particles
    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    // Draw lines between nearby particles
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.15;
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawLines();
        requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse
    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Initialize
    resizeCanvas();
    animate();
}

/* Spotlight Hover Cards Effect */
function initSpotlightCards() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
}

/* Scroll Reveal Animations */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', checkReveal);
    // Trigger once on load
    checkReveal();
}

/* Agent Sandbox Console Simulator */
const simulationPresets = {
    leadgen: [
        { type: 'system', text: 'Initializing Agent Loop: LeadScraper-v1.4' },
        { type: 'info', text: 'Querying target data sources for term: "SaaS founders in Texas"' },
        { type: 'info', text: 'Calling SERP API & scraping LinkedIn index endpoints...' },
        { type: 'info', text: 'Identified 14 potential leads. Fetching company domains...' },
        { type: 'success', text: 'Found profile: Marcus Vance (CEO, TechScale) -> m.vance@techscale.io' },
        { type: 'info', text: 'Analyzing target landing page for workflow optimizations...' },
        { type: 'warning', text: 'Detected missing leads collection widget on techscale.io/chat' },
        { type: 'info', text: 'Calling Gemini API to compose contextual sales pitch...' },
        { type: 'info', text: 'Pitch generated: "Hi Marcus, I built an automated agent prototype that solves..." ' },
        { type: 'info', text: 'Pushing contact profile & draft pitch payload to HubSpot CRM...' },
        { type: 'success', text: 'Sync success. Agent loop finished in 4.2s. 1 new lead staged.' }
    ],
    rag: [
        { type: 'system', text: 'Initializing workflow: DocuParse-Pipeline-v3' },
        { type: 'info', text: 'Listening for PDF uploads on FastAPI route: /v1/documents/upload' },
        { type: 'info', text: 'Detected incoming upload: financial_report_Q2_2026.pdf (3.2MB)' },
        { type: 'info', text: 'Parsing layout-aware segments & running OCR on embedded graphs...' },
        { type: 'info', text: 'Generated 14 chunks. Chunk-size: 512 tokens. Overlap: 64 tokens.' },
        { type: 'info', text: 'Computing vector representations via text-embedding-004...' },
        { type: 'info', text: 'Upserting vectors into Pinecone Database. Index: "finance-index"' },
        { type: 'success', text: 'Vector index updated. Syncing database shards...' },
        { type: 'info', text: 'Executing sanity RAG query: "What is the net revenue increase in Q2?"' },
        { type: 'info', text: 'Cosine similarity results: Chunk #3 (0.91), Chunk #7 (0.84)' },
        { type: 'success', text: 'LLM answer matched source document: "Net revenue grew by 14.2% QoQ."' },
        { type: 'success', text: 'Pipeline complete. Financial dashboard auto-refreshed.' }
    ],
    coding: [
        { type: 'system', text: 'Initializing runtime: Autodev-Subagent-CLI' },
        { type: 'info', text: 'Goal: "Create a Fastify server with basic rate limiting & healthcheck"' },
        { type: 'info', text: 'Scaffolding project structure & writing config files...' },
        { type: 'info', text: 'Writing server.js and test/server.test.js spec files...' },
        { type: 'info', text: 'Installing dependencies: npm install fastify fastify-rate-limit...' },
        { type: 'info', text: 'Running test suite: npm run test' },
        { type: 'warning', text: 'Test failed: "ReferenceError: fastify is not defined" (server.js:L12)' },
        { type: 'info', text: 'Analyzing stacktrace. Diagnosing syntax errors...' },
        { type: 'info', text: 'Fix proposed: Import the fastify package in server.js' },
        { type: 'info', text: 'Writing patch to server.js...' },
        { type: 'info', text: 'Re-running test suite...' },
        { type: 'success', text: 'Test suite passed: 4/4 assertions succeeded.' },
        { type: 'success', text: 'Build verified. Subagent self-corrected and finished runtime.' }
    ]
};

function initAgentSimulator() {
    const buttons = document.querySelectorAll('.agent-preset-btn');
    const executeBtn = document.querySelector('.execute-btn');
    const terminalBody = document.querySelector('.terminal-body');
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    const consoleBadge = document.querySelector('.terminal-badge');

    let currentPreset = 'leadgen';
    let isRunning = false;
    let timer = null;

    // Switch presets
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isRunning) return; // Disable switching while simulation runs
            
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentPreset = btn.dataset.preset;
            updateTerminalPreview(currentPreset);
        });
    });

    // Run simulator
    executeBtn.addEventListener('click', () => {
        if (isRunning) return;
        runSimulation(currentPreset);
    });

    function updateTerminalPreview(presetName) {
        terminalBody.innerHTML = '';
        consoleBadge.textContent = presetName === 'leadgen' ? 'agent_lead_gen.py' : 
                                   presetName === 'rag' ? 'rag_pipeline.js' : 'autodev_agent.sh';
                                   
        const previewLine = document.createElement('div');
        previewLine.className = 'terminal-line';
        previewLine.innerHTML = `
            <span class="line-timestamp">[${getTimestamp()}]</span>
            <span class="line-prompt">$</span>
            <span class="line-content system">Select a workflow and click "Execute Agent" to run...</span>
        `;
        terminalBody.appendChild(previewLine);
    }

    function getTimestamp() {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
    }

    function runSimulation(presetName) {
        isRunning = true;
        executeBtn.disabled = true;
        terminalBody.innerHTML = '';
        
        statusDot.className = 'status-dot busy';
        statusText.textContent = 'RUNNING AGENT...';
        
        const logs = simulationPresets[presetName];
        let index = 0;

        function printNextLine() {
            if (index >= logs.length) {
                // Done
                isRunning = false;
                executeBtn.disabled = false;
                statusDot.className = 'status-dot active';
                statusText.textContent = 'ACTIVE / IDLE';
                return;
            }

            const log = logs[index];
            const line = document.createElement('div');
            line.className = 'terminal-line';
            
            let contentClass = 'system';
            if (log.type === 'info') contentClass = 'info';
            if (log.type === 'success') contentClass = 'success';
            if (log.type === 'warning') contentClass = 'warning';

            line.innerHTML = `
                <span class="line-timestamp">[${getTimestamp()}]</span>
                <span class="line-prompt">🤖</span>
                <span class="line-content ${contentClass}">${log.text}</span>
            `;
            
            terminalBody.appendChild(line);
            // Auto-scroll terminal to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
            
            index++;
            // Dynamic delay between logs to feel more realistic
            const delay = 600 + Math.random() * 800;
            timer = setTimeout(printNextLine, delay);
        }

        printNextLine();
    }

    // Initialize first preview
    updateTerminalPreview('leadgen');
}
