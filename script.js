/* ========================================
   PREMIER LEAGUE TEAM SELECTOR 2026/2027
   JavaScript Application
   ======================================== */

(function () {
  'use strict';

  // ========================================
  // TEAM DATA
  // ========================================
  const TEAMS = [
    { id: 1, name: 'Arsenal', short: 'ARS', color: '#EF0107', alt: '#9C824A', logo: 'assets/logos/arsenal.svg' },
    { id: 2, name: 'Aston Villa', short: 'AVL', color: '#670E36', alt: '#95BFE5', logo: 'assets/logos/aston-villa.svg' },
    { id: 3, name: 'Bournemouth', short: 'BOU', color: '#DA291C', alt: '#000000', logo: 'assets/logos/bournemouth.svg' },
    { id: 4, name: 'Brentford', short: 'BRE', color: '#E30613', alt: '#FFFFFF', logo: 'assets/logos/brentford.svg' },
    { id: 5, name: 'Brighton & Hove Albion', short: 'BHA', color: '#0057B8', alt: '#FFFFFF', logo: 'assets/logos/brighton.svg' },
    { id: 6, name: 'Chelsea', short: 'CHE', color: '#034694', alt: '#FFFFFF', logo: 'assets/logos/chelsea.svg' },
    { id: 7, name: 'Crystal Palace', short: 'CRY', color: '#1B458F', alt: '#C4122E', logo: 'assets/logos/crystal-palace.svg' },
    { id: 8, name: 'Everton', short: 'EVE', color: '#003399', alt: '#FFFFFF', logo: 'assets/logos/everton.svg' },
    { id: 9, name: 'Fulham', short: 'FUL', color: '#FFFFFF', alt: '#000000', logo: 'assets/logos/fulham.svg' },
    { id: 10, name: 'Ipswich Town', short: 'IPS', color: '#003399', alt: '#FFFFFF', logo: 'assets/logos/ipswich.svg' },
    { id: 11, name: 'Leicester City', short: 'LEI', color: '#003090', alt: '#FFFFFF', logo: 'assets/logos/leicester.svg' },
    { id: 12, name: 'Liverpool', short: 'LIV', color: '#C8102E', alt: '#FFFFFF', logo: 'assets/logos/liverpool.svg' },
    { id: 13, name: 'Manchester City', short: 'MCI', color: '#6CABDD', alt: '#FFFFFF', logo: 'assets/logos/man-city.svg' },
    { id: 14, name: 'Manchester United', short: 'MUN', color: '#DA291C', alt: '#FFFFFF', logo: 'assets/logos/man-united.svg' },
    { id: 15, name: 'Newcastle United', short: 'NEW', color: '#241F20', alt: '#FFFFFF', logo: 'assets/logos/newcastle.svg' },
    { id: 16, name: 'Nottingham Forest', short: 'NFO', color: '#E53233', alt: '#FFFFFF', logo: 'assets/logos/nottingham-forest.svg' },
    { id: 17, name: 'Southampton', short: 'SOU', color: '#D71920', alt: '#FFFFFF', logo: 'assets/logos/southampton.svg' },
    { id: 18, name: 'Tottenham Hotspur', short: 'TOT', color: '#132257', alt: '#FFFFFF', logo: 'assets/logos/spurs.svg' },
    { id: 19, name: 'West Ham United', short: 'WHU', color: '#7C2C3B', alt: '#1BB1E7', logo: 'assets/logos/west-ham.svg' },
    { id: 20, name: 'Wolverhampton Wanderers', short: 'WOL', color: '#FDB913', alt: '#231F20', logo: 'assets/logos/wolves.svg' }
  ];

  // ========================================
  // TEAM LOGO RENDERER
  // ========================================
  var badgeCounter = 0;
  function createBadgeSVG(team) {
    const gid = 'bg-' + team.id + '-' + (++badgeCounter);
    return `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <defs>
        <linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${team.color}"/>
          <stop offset="100%" stop-color="${team.alt}"/>
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="18.5" fill="url(#${gid})" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="22" y="22" font-family="Arial,sans-serif" font-size="9" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${team.short}</text>
    </svg>`;
  }

  function createTeamLogo(team) {
    var fallback = createBadgeSVG(team);
    var logoId = 'team-logo-' + team.id + '-' + (++badgeCounter);
    return '<span class="team-logo-wrap" style="display:inline-block;position:relative;width:100%;height:100%;">' +
      '<img id="' + logoId + '" src="' + team.logo + '" alt="' + team.name + '" loading="lazy" ' +
        'style="width:100%;height:100%;object-fit:contain;" ' +
        'onerror="var i=document.getElementById(\'' + logoId + '\');if(i)i.style.display=\'none\';' +
        'var f=document.getElementById(\'' + logoId + '-fallback\');if(f)f.style.display=\'block\';" />' +
      '<span id="' + logoId + '-fallback" style="display:none;position:absolute;top:0;left:0;width:100%;height:100%;">' + fallback + '</span>' +
      '<noscript>' + fallback + '</noscript></span>';
  }

  // ========================================
  // STORAGE MODULE
  // ========================================
  const Storage = {
    STORAGE_KEY: 'pl-team-selector-users',

    getUsers() {
      try {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    },

    saveUsers(users) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      } catch (e) {
        console.warn('Storage save failed:', e);
      }
    },

    addUser(user) {
      const users = this.getUsers();
      users.unshift(user);
      this.saveUsers(users);
      return users;
    },

    userExists(name) {
      return this.getUsers().some(function (u) {
        return u.name.toLowerCase() === name.trim().toLowerCase();
      });
    },

    getStats() {
      const users = this.getUsers();
      if (!users.length) {
        return { total: 0, mostSelected: '-', newest: '-' };
      }

      const teamCounts = {};
      users.forEach(function (u) {
        teamCounts[u.team] = (teamCounts[u.team] || 0) + 1;
      });

      let mostSelected = '-';
      let maxCount = 0;
      for (var t in teamCounts) {
        if (teamCounts[t] > maxCount) {
          maxCount = teamCounts[t];
          mostSelected = t;
        }
      }

      const newest = users[0] ? users[0].name : '-';

      return {
        total: users.length,
        mostSelected: mostSelected,
        newest: newest
      };
    },

    exportJSON() {
      const data = JSON.stringify(this.getUsers(), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pl-team-selector-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // ========================================
  // CONFETTI ENGINE
  // ========================================
  const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    animId: null,
    running: false,

    init() {
      this.canvas = document.getElementById('confetti-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      var self = this;
      window.addEventListener('resize', function () { self.resize(); });
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    start() {
      if (!this.canvas || !this.ctx) this.init();
      if (!this.canvas) return;
      this.particles = [];
      this.running = true;
      var colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#FFFFFF', '#A78BFA'];

      for (var i = 0; i < 150; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height - this.canvas.height,
          w: Math.random() * 10 + 5,
          h: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 4 + 2,
          rot: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 8,
          opacity: 1,
          gravity: 0.05 + Math.random() * 0.05
        });
      }

      var self = this;
      function loop() {
        if (!self.running) return;
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.particles.forEach(function (p) {
          p.x += p.vx;
          p.vy += p.gravity;
          p.y += p.vy;
          p.rot += p.rotSpeed;
          if (p.y > self.canvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * self.canvas.width;
            p.vy = Math.random() * 4 + 2;
          }
          self.ctx.save();
          self.ctx.translate(p.x, p.y);
          self.ctx.rotate(p.rot * Math.PI / 180);
          self.ctx.globalAlpha = p.opacity;
          self.ctx.fillStyle = p.color;
          self.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          self.ctx.restore();
        });
        self.animId = requestAnimationFrame(loop);
      }

      loop();
    },

    stop() {
      this.running = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  };

  // ========================================
  // PARTICLES BACKGROUND
  // ========================================
  const Particles = {
    canvas: null,
    ctx: null,
    particles: [],
    animId: null,
    running: false,

    init() {
      this.canvas = document.getElementById('particles-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      var self = this;
      window.addEventListener('resize', function () { self.resize(); });
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    start(count) {
      count = count || 50;
      if (!this.canvas || !this.ctx) this.init();
      if (!this.canvas) return;

      this.particles = [];
      this.running = true;

      for (var i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          r: Math.random() * 2.5 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.3 + 0.1
        });
      }

      var self = this;
      function loop() {
        if (!self.running) return;
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        self.particles.forEach(function (p) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = self.canvas.width;
          if (p.x > self.canvas.width) p.x = 0;
          if (p.y < 0) p.y = self.canvas.height;
          if (p.y > self.canvas.height) p.y = 0;

          self.ctx.beginPath();
          self.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          self.ctx.fillStyle = 'rgba(139, 92, 246, ' + p.opacity + ')';
          self.ctx.fill();
        });

        // Draw connections
        for (var i = 0; i < self.particles.length; i++) {
          for (var j = i + 1; j < self.particles.length; j++) {
            var a = self.particles[i];
            var b = self.particles[j];
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              self.ctx.beginPath();
              self.ctx.moveTo(a.x, a.y);
              self.ctx.lineTo(b.x, b.y);
              self.ctx.strokeStyle = 'rgba(139, 92, 246, ' + (0.05 * (1 - dist / 120)) + ')';
              self.ctx.lineWidth = 0.5;
              self.ctx.stroke();
            }
          }
        }

        self.animId = requestAnimationFrame(loop);
      }

      loop();
    },

    stop() {
      this.running = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  };

  // ========================================
  // SOUND ENGINE (Web Audio)
  // ========================================
  const Sounds = {
    ctx: null,
    enabled: true,

    init() {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      } catch {
        this.enabled = false;
      }
    },

    ensureInit() {
      if (this.ctx) return;
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      } catch {
        this.enabled = false;
      }
    },

    play(type) {
      this.ensureInit();
      if (!this.enabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      var ctx = this.ctx;
      var now = ctx.currentTime;

      function tone(freq, dur, startTime, waveType, vol) {
        waveType = waveType || 'sine';
        vol = vol || 0.08;
        startTime = startTime || now;
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq;
        o.type = waveType;
        g.gain.setValueAtTime(vol, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
        o.start(startTime);
        o.stop(startTime + dur);
      }

      switch (type) {
        case 'select':
          tone(520, 0.15);
          break;
        case 'eliminate':
          tone(260, 0.25, now, 'sawtooth');
          break;
        case 'winner':
          tone(523, 0.3, now);
          tone(659, 0.3, now + 0.15);
          tone(784, 0.3, now + 0.3);
          tone(1047, 0.4, now + 0.45);
          break;
        case 'click':
          tone(800, 0.08);
          break;
      }
    }
  };

  // ========================================
  // TOAST NOTIFICATION
  // ========================================
  function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('toast-out');
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 2500);
  }

  // ========================================
  // RIPPLE EFFECT
  // ========================================
  function createRipple(e) {
    var el = e.currentTarget;
    var rect = el.getBoundingClientRect();
    var x = (e.clientX || e.touches[0].clientX) - rect.left;
    var y = (e.clientY || e.touches[0].clientY) - rect.top;
    var size = Math.max(rect.width, rect.height);

    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';
    el.appendChild(ripple);

    setTimeout(function () { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 600);
  }

  // ========================================
  // DATE HELPERS
  // ========================================
  function formatDate(dateStr) {
    var d = new Date(dateStr);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function todayStr() {
    var d = new Date();
    return d.toISOString().split('T')[0];
  }

  // ========================================
  // PAGE NAVIGATION
  // ========================================
  let currentScreen = 'splash';

  function showScreen(screenId) {
    var screens = document.querySelectorAll('.screen');
    screens.forEach(function (s) { s.classList.remove('active'); });

    var target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      currentScreen = screenId;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ========================================
  // APP CONTROLLER
  // ========================================
  const App = {
    user: null,
    remainingTeams: [],
    currentTeamEliminated: null,
    isEliminating: false,

    // ---- Init ----
    init() {
      // Load splash
      setTimeout(function () {
        Particles.init();
        Particles.start(40);
        Sounds.init();
        Confetti.init();
      }, 100);

      // Splash -> Home
      setTimeout(function () {
        showScreen('home-screen');
        App.renderUsers();
        App.renderStats();
      }, 2000);

      // Bind events
      this.bindEvents();
    },

    // ---- Event Binding ----
    bindEvents() {
      var self = this;

      // Start button
      var btnStart = document.getElementById('btn-start');
      if (btnStart) {
        btnStart.addEventListener('click', function () {
          Sounds.play('click');
          showScreen('name-screen');
          document.getElementById('user-name-input').value = '';
          document.getElementById('name-error').textContent = '';
          document.getElementById('user-name-input').classList.remove('error');
          setTimeout(function () { document.getElementById('user-name-input').focus(); }, 350);
        });
      }

      // Back to home from name screen
      document.getElementById('btn-back-name').addEventListener('click', function () {
        Sounds.play('click');
        showScreen('home-screen');
      });

      // Back to home from selection
      document.getElementById('btn-back-selection').addEventListener('click', function () {
        Sounds.play('click');
        showScreen('home-screen');
      });

      // Continue button
      document.getElementById('btn-continue').addEventListener('click', function () {
        self.handleContinue();
      });

      // Enter key on name input
      document.getElementById('user-name-input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          self.handleContinue();
        }
      });

      // Real-time validation
      document.getElementById('user-name-input').addEventListener('input', function () {
        var el = document.getElementById('name-error');
        var input = document.getElementById('user-name-input');
        el.textContent = '';
        input.classList.remove('error');
      });

      // Select team button
      document.getElementById('btn-select').addEventListener('click', function () {
        self.selectTeam();
      });

      // Save result
      document.getElementById('btn-save').addEventListener('click', function () {
        self.saveResult();
      });

      // Return home from winner
      document.getElementById('btn-home').addEventListener('click', function () {
        Sounds.play('click');
        Confetti.stop();
        showScreen('home-screen');
        self.renderUsers();
        self.renderStats();
      });

      // Search
      document.getElementById('search-users').addEventListener('input', function () {
        self.renderUsers();
      });

      // Sort
      document.getElementById('sort-users').addEventListener('change', function () {
        self.renderUsers();
      });

      // Export
      document.getElementById('btn-export').addEventListener('click', function () {
        var users = Storage.getUsers();
        if (!users.length) {
          showToast('No data to export', 'error');
          return;
        }
        Storage.exportJSON();
        showToast('Data exported successfully', 'success');
      });
    },

    // ---- Continue Handler ----
    handleContinue() {
      var input = document.getElementById('user-name-input');
      var errorEl = document.getElementById('name-error');
      var name = input.value.trim();

      if (!name) {
        errorEl.textContent = 'Please enter your name';
        input.classList.add('error');
        input.focus();
        return;
      }

      if (Storage.userExists(name)) {
        errorEl.textContent = 'This name already exists. Please use another.';
        input.classList.add('error');
        input.focus();
        return;
      }

      this.user = name;
      Sounds.play('click');
      this.startSelection();
    },

    // ---- Start Selection ----
    startSelection() {
      this.remainingTeams = TEAMS.map(function (t) { return Object.assign({}, t); });
      this.currentTeamEliminated = null;
      this.isEliminating = false;

      var el = document.getElementById('eliminated-display');
      if (el) { el.className = 'eliminated-display'; el.innerHTML = ''; }

      showScreen('selection-screen');
      this.renderTeams();
      this.updateCounter();
    },

    // ---- Render Teams ----
    renderTeams() {
      var grid = document.getElementById('teams-grid');
      if (!grid) return;
      grid.innerHTML = '';

      var self = this;
      this.remainingTeams.forEach(function (team) {
        var card = document.createElement('div');
        card.className = 'team-card scale-in';
        card.dataset.id = team.id;

        var logoDiv = document.createElement('div');
        logoDiv.className = 'team-card-logo';
        logoDiv.innerHTML = createTeamLogo(team);

        var nameEl = document.createElement('div');
        nameEl.className = 'team-card-name';
        nameEl.textContent = team.name;

        card.appendChild(logoDiv);
        card.appendChild(nameEl);
        grid.appendChild(card);
      });
    },

    // ---- Update Counter ----
    updateCounter() {
      var remaining = document.getElementById('teams-remaining');
      var total = document.getElementById('teams-total');
      var progress = document.getElementById('progress-bar');

      if (remaining) remaining.textContent = this.remainingTeams.length;
      if (total) total.textContent = TEAMS.length;

      if (progress) {
        var pct = ((TEAMS.length - this.remainingTeams.length) / TEAMS.length) * 100;
        progress.style.width = pct + '%';
      }
    },

    // ---- Show Eliminated Team ----
    showEliminated(team) {
      var el = document.getElementById('eliminated-display');
      if (!el) return;
      el.innerHTML = '<svg class="eliminated-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ' + team.name + ' eliminated';
      el.className = 'eliminated-display has-team';
    },

    // ---- Select Team ----
    selectTeam() {
      if (this.isEliminating) return;
      if (this.remainingTeams.length <= 1) return;

      this.isEliminating = true;

      var btn = document.getElementById('btn-select');
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
      }

      var randomIndex = Math.floor(Math.random() * this.remainingTeams.length);
      var eliminated = this.remainingTeams[randomIndex];

      this.currentTeamEliminated = eliminated;

      this.showEliminated(eliminated);

      Sounds.play('select');

      // Animate elimination
      var self = this;
      var cards = document.querySelectorAll('.team-card');
      var targetCard = null;
      cards.forEach(function (c) {
        if (parseInt(c.dataset.id) === eliminated.id) {
          targetCard = c;
        }
      });

      if (targetCard) {
        targetCard.classList.add('eliminating');

        setTimeout(function () {
          Sounds.play('eliminate');

          self.remainingTeams.splice(randomIndex, 1);

          self.isEliminating = false;

          if (btn) {
            btn.disabled = false;
            btn.style.opacity = '1';
          }

          if (self.remainingTeams.length === 1) {
            self.showWinner(self.remainingTeams[0]);
          } else {
            self.renderTeams();
            self.updateCounter();
          }
        }, 600);
      } else {
        self.remainingTeams.splice(randomIndex, 1);
        self.isEliminating = false;
        if (btn) {
          btn.disabled = false;
          btn.style.opacity = '1';
        }
        if (self.remainingTeams.length === 1) {
          self.showWinner(self.remainingTeams[0]);
        } else {
          self.renderTeams();
          self.updateCounter();
        }
      }
    },

    // ---- Show Winner ----
    showWinner(team) {
      var logoEl = document.getElementById('winner-logo');
      var nameEl = document.getElementById('winner-name');

      if (logoEl) {
        logoEl.innerHTML = createTeamLogo(team);
      }

      if (nameEl) {
        nameEl.textContent = team.name;
      }

      showScreen('winner-screen');

      Sounds.play('winner');

      setTimeout(function () {
        Confetti.start();
      }, 300);

      // Store winner data
      this.winnerTeam = team;
    },

    // ---- Save Result ----
    saveResult() {
      if (!this.user || !this.winnerTeam) return;

      var userData = {
        name: this.user,
        team: this.winnerTeam.name,
        teamId: this.winnerTeam.id,
        date: todayStr()
      };

      Storage.addUser(userData);
      showToast('Result saved! Welcome ' + this.user + '!', 'success');

      Confetti.stop();

      // Go home after short delay
      var self = this;
      setTimeout(function () {
        showScreen('home-screen');
        self.renderUsers();
        self.renderStats();
      }, 800);
    },

    // ---- Render Users ----
    renderUsers() {
      var container = document.getElementById('users-container');
      var empty = document.getElementById('users-empty');
      if (!container) return;

      var users = Storage.getUsers();
      var searchTerm = document.getElementById('search-users').value.toLowerCase().trim();
      var sortBy = document.getElementById('sort-users').value;

      // Filter
      if (searchTerm) {
        users = users.filter(function (u) {
          return u.name.toLowerCase().includes(searchTerm) ||
                 u.team.toLowerCase().includes(searchTerm);
        });
      }

      // Sort
      switch (sortBy) {
        case 'newest':
          users.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
          break;
        case 'oldest':
          users.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
          break;
        case 'name':
          users.sort(function (a, b) { return a.name.localeCompare(b.name); });
          break;
        case 'team':
          users.sort(function (a, b) { return a.team.localeCompare(b.team); });
          break;
      }

      // Show/hide empty state
      if (empty) {
        if (users.length === 0) {
          empty.style.display = 'block';
        } else {
          empty.style.display = 'none';
        }
      }

      // Clear previous cards (but keep empty)
      var cards = container.querySelectorAll('.user-card');
      cards.forEach(function (c) { c.remove(); });

      // Render each user
      users.forEach(function (user) {
        var team = TEAMS.find(function (t) { return t.id === user.teamId || t.name === user.team; });
        if (!team) team = TEAMS[0];

        var card = document.createElement('div');
        card.className = 'user-card';
        card.setAttribute('role', 'listitem');

        // Avatar
        var avatar = document.createElement('div');
        avatar.className = 'user-avatar';
        avatar.textContent = user.name.charAt(0).toUpperCase();

        // Info
        var info = document.createElement('div');
        info.className = 'user-info';
        info.innerHTML =
          '<div class="user-name">' + escapeHtml(user.name) + '</div>' +
          '<div class="user-team">' +
            '<span class="user-team-logo">' + createTeamLogo(team) + '</span>' +
            '<span>' + escapeHtml(user.team) + '</span>' +
          '</div>' +
          '<div class="user-date">' + formatDate(user.date) + '</div>';

        card.appendChild(avatar);
        card.appendChild(info);
        container.appendChild(card);
      });
    },

    // ---- Render Stats ----
    renderStats() {
      var stats = Storage.getStats();
      var totalEl = document.getElementById('stat-total');
      var popularEl = document.getElementById('stat-popular');
      var newestEl = document.getElementById('stat-newest');

      if (totalEl) totalEl.textContent = stats.total;
      if (popularEl) popularEl.textContent = stats.mostSelected;
      if (newestEl) newestEl.textContent = stats.newest;
    }
  };

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ========================================
  // RIPPLE DELEGATION (attach to all buttons)
  // ========================================
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn, .btn-back').forEach(function (btn) {
      if (!btn.classList.contains('no-ripple')) {
        btn.addEventListener('mousedown', function (e) {
          if (e.button === 0) createRipple(e);
        });
        btn.addEventListener('touchstart', function (e) {
          createRipple(e);
        }, { passive: true });
      }
    });
  });

  // ========================================
  // SERVICE WORKER REGISTRATION
  // ========================================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {
        // SW registration failed - still works as normal site
      });
    });
  }

  // ========================================
  // LAUNCH THE APP
  // ========================================
  document.addEventListener('DOMContentLoaded', function () {
    App.init();
  });

})();
