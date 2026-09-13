(function(){
  "use strict";
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ns = 'http://www.w3.org/2000/svg';

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', function(){
    var open = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mainNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ mainNav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false'); });
  });

  /* ---------------- Scroll progress ---------------- */
  var progressBar = document.getElementById('scrollProgress');
  function updateProgress(){
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docHeight > 0 ? (scrollTop/docHeight)*100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  /* ---------------- Cursor glow ---------------- */
  var cursorGlow = document.getElementById('cursorGlow');
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', function(e){
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
    window.addEventListener('mouseleave', function(){ cursorGlow.style.opacity = '0'; });
  }

  /* ---------------- Particle network canvas ---------------- */
  (function particles(){
    var canvas = document.getElementById('particleCanvas');
    var ctx = canvas.getContext('2d');
    var w, h, dpr;
    var points = [];
    var mouse = { x: null, y: null };
    var COUNT = prefersReduced ? 0 : Math.min(70, Math.floor(window.innerWidth / 22));

    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = document.documentElement.scrollHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = document.documentElement.scrollHeight + 'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function init(){
      points = [];
      for (var i=0;i<COUNT;i++){
        points.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * document.documentElement.scrollHeight,
          vx: (Math.random()-0.5)*0.25,
          vy: (Math.random()-0.5)*0.25
        });
      }
    }
    function step(){
      ctx.clearRect(0,0,window.innerWidth, document.documentElement.scrollHeight);
      var viewTop = window.scrollY - 200, viewBottom = window.scrollY + window.innerHeight + 200;
      for (var i=0;i<points.length;i++){
        var p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > document.documentElement.scrollHeight) p.vy *= -1;
        if (p.y < viewTop || p.y > viewBottom) continue;
        for (var j=i+1;j<points.length;j++){
          var q = points[j];
          if (q.y < viewTop || q.y > viewBottom) continue;
          var dx = p.x-q.x, dy = p.y-q.y;
          var dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < 130){
            ctx.strokeStyle = 'rgba(108,140,255,' + (0.12 * (1 - dist/130)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(154,163,189,0.5)';
        ctx.beginPath(); ctx.arc(p.x,p.y,1.4,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(step);
    }
    resize(); init();
    window.addEventListener('resize', function(){ resize(); init(); });
    if (!prefersReduced) requestAnimationFrame(step);
  })();

  /* ---------------- Hero visual tilt ---------------- */
  var heroVisual = document.getElementById('heroVisual');
  var heroVisualInner = document.getElementById('heroVisualInner');
  if (heroVisual && !prefersReduced) {
    heroVisual.addEventListener('mousemove', function(e){
      var rect = heroVisual.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisualInner.style.transform = 'rotateY(' + (relX*14) + 'deg) rotateX(' + (relY*-14) + 'deg)';
    });
    heroVisual.addEventListener('mouseleave', function(){ heroVisualInner.style.transform = ''; });
  }

  /* ---------------- Brand colors for skill hover ---------------- */
  var BRAND = {
    'devicon-nodejs-plain':        '#3C873A',
    'devicon-express-original':    '#E8E8E8',
    'devicon-javascript-plain':    '#F0DB4F',
    'devicon-typescript-plain':    '#3178C6',
    'devicon-rabbitmq-original':   '#FF6600',
    'devicon-apachekafka-original':'#D7D7D7',
    'devicon-angularjs-plain':     '#DD0031',
    'devicon-html5-plain':         '#E34F26',
    'devicon-css3-plain':          '#1572B6',
    'devicon-bootstrap-plain':     '#7952B3',
    'devicon-mongodb-plain':       '#47A248',
    'devicon-mysql-plain':         '#4479A1',
    'devicon-sequelize-plain':     '#52B0E7',
    'devicon-redis-plain':         '#DC382D',
    'devicon-docker-plain':        '#2496ED',
    'devicon-nginx-original':      '#009639',
    'devicon-amazonwebservices-original': '#FF9900',
    'devicon-git-plain':           '#F05032',
    'devicon-gitlab-plain':        '#FC6D26',
    'devicon-postman-plain':       '#FF6C37',
    'devicon-jira-plain':          '#0052CC',
    'observability':               '#FF9F1C'
  };
  function hexToRgba(hex, a){
    var h = hex.replace('#','');
    if (h.length === 3) h = h.split('').map(function(c){ return c+c; }).join('');
    var r = parseInt(h.substring(0,2),16), g = parseInt(h.substring(2,4),16), b = parseInt(h.substring(4,6),16);
    return 'rgba('+r+','+g+','+b+','+a+')';
  }

  /* ---------------- Hero visual: orbiting technology assembly ---------------- */
  function buildOrbit(){
    var svg = document.getElementById('orbitLines');
    var ring = document.getElementById('orbitRing');
    var cx = 220, cy = 220, r = 172;
    var techs = [
      { icon:'devicon-nodejs-plain', label:'Node.js' },
      { icon:'devicon-angularjs-plain', label:'Angular' },
      { icon:'devicon-mongodb-plain', label:'MongoDB' },
      { icon:'devicon-redis-plain', label:'Redis' },
      { icon:'devicon-docker-plain', label:'Docker' },
      { icon:'devicon-amazonwebservices-original', label:'AWS' },
      { icon:'devicon-apachekafka-original', label:'Kafka' },
      { icon:'devicon-typescript-plain', label:'TypeScript' },
      { icon:'observability', label:'Observability',
        customSvg:'<svg viewBox="0 0 24 24" width="20" height="20"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>' }
    ];
    var frag = document.createDocumentFragment();
    techs.forEach(function(t, i){
      var angle = (i / techs.length) * Math.PI * 2 - Math.PI/2;
      var x = cx + r * Math.cos(angle);
      var y = cy + r * Math.sin(angle);

      var path = document.createElementNS(ns,'path');
      var midX = cx + (r*0.55) * Math.cos(angle), midY = cy + (r*0.55) * Math.sin(angle);
      path.setAttribute('d', 'M '+x+' '+y+' Q '+midX+' '+midY+' '+cx+' '+cy);
      path.setAttribute('class','orbit-path');
      path.style.animationDelay = (i*0.15)+'s';
      frag.appendChild(path);

      var chip = document.createElement('div');
      chip.className = 'orbit-chip';
      chip.style.left = ((x/440)*100) + '%';
      chip.style.top = ((y/440)*100) + '%';
      chip.style.setProperty('--delay', (i*0.3) + 's');
      var brand = BRAND[t.icon] || '#6C8CFF';
      chip.style.setProperty('--brand', brand);
      chip.style.setProperty('--brand-glow', hexToRgba(brand, 0.55));
      var iconMarkup = t.customSvg ? t.customSvg : '<i class="'+t.icon+'"></i>';
      chip.innerHTML = '<span class="orbit-chip__icon">'+iconMarkup+'</span><span class="orbit-chip__label">'+t.label+'</span>';
      ring.appendChild(chip);
    });
    svg.appendChild(frag);
  }
  buildOrbit();

  /* ---------------- Illustrative dashboard chart ---------------- */
  function buildMockupChart(){
    var svg = document.getElementById('mockupChart');
    var values = [40, 65, 50, 80, 60, 92, 70, 55, 85, 66];
    var barW = 40, gap = 18, baseY = 190;
    var frag = document.createDocumentFragment();
    var line = document.createElementNS(ns,'polyline');
    var linePts = [];
    values.forEach(function(v, i){
      var x = 20 + i*(barW+gap);
      var h = v*1.5;
      var rect = document.createElementNS(ns,'rect');
      rect.setAttribute('x', x); rect.setAttribute('y', baseY);
      rect.setAttribute('width', barW); rect.setAttribute('height', 0);
      rect.setAttribute('rx', 4);
      rect.setAttribute('fill', i % 3 === 0 ? 'url(#barGrad)' : 'rgba(255,255,255,0.08)');
      rect.style.transition = 'height 0.8s cubic-bezier(.16,1,.3,1), y 0.8s cubic-bezier(.16,1,.3,1)';
      rect.setAttribute('data-h', h);
      rect.setAttribute('data-y', baseY - h);
      frag.appendChild(rect);
      linePts.push((x+barW/2) + ',' + (baseY - h*0.7));
    });
    var defs = document.createElementNS(ns,'defs');
    defs.innerHTML = '<linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#6C8CFF"/><stop offset="100%" stop-color="#7C6FFF"/></linearGradient>';
    svg.appendChild(defs);
    svg.appendChild(frag);
    line.setAttribute('points', linePts.join(' '));
    line.setAttribute('fill','none'); line.setAttribute('stroke','#35D0C0'); line.setAttribute('stroke-width','2');
    line.setAttribute('opacity','0.8');
    svg.appendChild(line);

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          svg.querySelectorAll('rect').forEach(function(r){
            r.setAttribute('height', r.getAttribute('data-h'));
            r.setAttribute('y', r.getAttribute('data-y'));
          });
          io.unobserve(svg);
        }
      });
    }, { threshold: 0.4 });
    io.observe(svg);
  }
  buildMockupChart();

  /* ---------------- Outcome grid (qualitative, no metrics) ---------------- */
  var outcomes = [
    { key:'consistency', title:'High system consistency', body:'Saga-pattern transactions keep shipment, financial and accounting records in sync across services — no partial updates left behind.' },
    { key:'speed', title:'Fast response times', body:'Redis caching and platform-wide performance tuning keep the product responsive as transaction volume grows.' },
    { key:'cost', title:'Lower processing cost', body:'A dedicated financial microservice replaced a heavier, error-prone workflow with a leaner, cheaper one to run.' },
    { key:'optimize', title:'Optimized operations', body:'Kong API Gateway centralizes routing, rate limiting and auth — one well-tuned layer instead of repeated logic per service.' },
    { key:'database', title:'Well-structured, optimized database', body:'The Atlas migration paired schema and index work with better infrastructure — built to serve shipment, financial and reporting data efficiently.' },
    { key:'observability', title:'Full observability', body:'Centralized logging with Graylog gives visibility into how every service is actually behaving in production — not just whether it\u2019s up.' }
  ];
  function outcomeIcon(key){
    switch(key){
      case 'consistency':
        return '<svg viewBox="0 0 64 64" class="outcome-icon outcome-icon--consistency"><circle cx="32" cy="32" r="20" class="o-ring o-ring--1"/><circle cx="32" cy="32" r="20" class="o-ring o-ring--2"/><path d="M23 33l6 6 12-14" class="o-check"/></svg>';
      case 'speed':
        return '<svg viewBox="0 0 64 64" class="outcome-icon outcome-icon--speed"><path d="M34 8 16 36h12l-4 20 20-28H32z" class="o-bolt"/><line x1="6" y1="24" x2="16" y2="24" class="o-speedline o-speedline--1"/><line x1="4" y1="34" x2="14" y2="34" class="o-speedline o-speedline--2"/><line x1="8" y1="44" x2="16" y2="44" class="o-speedline o-speedline--3"/></svg>';
      case 'cost':
        return '<svg viewBox="0 0 64 64" class="outcome-icon outcome-icon--cost"><rect x="14" y="24" width="36" height="26" rx="4" class="o-wallet"/><circle cx="40" cy="37" r="5" class="o-coin"/><path d="M32 12v14M26 20l6 6 6-6" class="o-arrow-down"/></svg>';
      case 'optimize':
        return '<svg viewBox="0 0 64 64" class="outcome-icon outcome-icon--optimize"><g class="o-gear"><circle cx="32" cy="32" r="9" class="o-gear-hub"/><g class="o-gear-teeth"><rect x="29" y="4" width="6" height="10" rx="2"/><rect x="29" y="50" width="6" height="10" rx="2"/><rect x="4" y="29" width="10" height="6" rx="2"/><rect x="50" y="29" width="10" height="6" rx="2"/><rect x="12" y="12" width="6" height="10" rx="2" transform="rotate(45 15 17)"/><rect x="46" y="42" width="6" height="10" rx="2" transform="rotate(45 49 47)"/><rect x="12" y="42" width="6" height="10" rx="2" transform="rotate(-45 15 47)"/><rect x="46" y="12" width="6" height="10" rx="2" transform="rotate(-45 49 17)"/></g></g></svg>';
      case 'database':
        return '<svg viewBox="0 0 64 64" class="outcome-icon outcome-icon--database"><ellipse cx="32" cy="14" rx="20" ry="7" class="o-db"/><path d="M12 14v18c0 3.9 9 7 20 7s20-3.1 20-7V14" class="o-db"/><path d="M12 32v18c0 3.9 9 7 20 7s20-3.1 20-7V32" class="o-db"/><path d="M14 23c0 0 4 15 18 15" class="o-db-pulse"/></svg>';
      case 'observability':
        return '<svg viewBox="0 0 64 64" class="outcome-icon outcome-icon--observability"><path d="M4 32s10-16 28-16 28 16 28 16-10 16-28 16S4 32 4 32Z" class="o-eye"/><circle cx="32" cy="32" r="8" class="o-pupil"/><circle cx="32" cy="32" r="15" class="o-scan"/></svg>';
      default: return '';
    }
  }
  var outcomeGrid = document.getElementById('outcomeGrid');
  outcomes.forEach(function(o){
    var card = document.createElement('div');
    card.className = 'outcome-card glass';
    card.innerHTML = '<div class="outcome-card__icon">'+outcomeIcon(o.key)+'</div><h4>'+o.title+'</h4><p>'+o.body+'</p>';
    outcomeGrid.appendChild(card);
  });

  /* ---------------- Yatra interactive architecture diagram ---------------- */
  function buildYatraDiagram(){
    var svg = document.getElementById('yatraDiagram');
    var detail = document.getElementById('yatraDetail');
    var nodes = [
      { id:'client',    x:20,  y:180, w:130, h:44, label:'Client & internal apps',
        desc:'Customer-facing and internal tools used for FCL, LCL and air freight — cargo tracking, carrier coordination, and freight documentation.' },
      { id:'gateway',   x:210, y:180, w:130, h:44, label:'Kong API gateway',
        desc:'Centralized layer for routing, rate limiting, and authentication — introduced to strengthen security and cut auth-related overhead across services.' },
      { id:'shipment',  x:410, y:40,  w:150, h:44, label:'Shipment services',
        desc:'Core services covering FCL, LCL and air freight shipment tracking and documentation.' },
      { id:'financial', x:410, y:180, w:150, h:44, label:'Financial microservice',
        desc:'A dedicated service for invoicing and transaction management, built with a saga-pattern approach for consistency, accuracy and low-cost processing across every transaction.' },
      { id:'reporting', x:410, y:320, w:150, h:44, label:'Reporting service',
        desc:'Angular-based visualization service that aggregates data from multiple databases into a centralized warehouse, with output to email and Google Sheets.' },
      { id:'invoicing', x:630, y:180, w:150, h:44, label:'E-invoicing & accounting',
        desc:'Integration with a government e-invoicing system and internal accounting tools — keeping financial records compliant and transparent.' },
      { id:'warehouse', x:630, y:320, w:150, h:44, label:'Data warehouse',
        desc:'Centralized store pulling data from diverse databases so reporting doesn\u2019t depend on querying each service directly.' },
      { id:'cache',     x:630, y:40,  w:150, h:44, label:'Redis cache',
        desc:'Caching layer added to keep response times fast and consistent across the platform, even as transaction volume grows.' },
      { id:'atlas',     x:210, y:320, w:150, h:44, label:'MongoDB Atlas',
        desc:'The database layer behind shipment tracking, the financial microservice, and reporting — migrated from self-hosted MongoDB to Atlas for a well-structured, performance-optimized data layer.' }
    ];
    var links = [
      ['client','gateway'], ['gateway','shipment'], ['gateway','financial'],
      ['gateway','reporting'], ['atlas','shipment'], ['atlas','financial'], ['atlas','reporting'],
      ['shipment','cache'], ['financial','invoicing'], ['reporting','warehouse']
    ];
    var byId = {}; nodes.forEach(function(n){ byId[n.id]=n; });
    var frag = document.createDocumentFragment();
    links.forEach(function(pair, i){
      var a = byId[pair[0]], b = byId[pair[1]];
      var ax=a.x+a.w, ay=a.y+a.h/2, bx=b.x, by=b.y+b.h/2, midX=(ax+bx)/2;
      var path = document.createElementNS(ns,'path');
      path.setAttribute('d','M '+ax+' '+ay+' C '+midX+' '+ay+', '+midX+' '+by+', '+bx+' '+by);
      path.setAttribute('class','diagram-flow'+(i%3===0?' is-live':''));
      frag.appendChild(path);
    });
    nodes.forEach(function(n){
      var g = document.createElementNS(ns,'g');
      g.setAttribute('class','diagram-node'); g.setAttribute('tabindex','0'); g.setAttribute('role','button');
      g.setAttribute('aria-label', n.label + ' \u2014 show details');
      var rect = document.createElementNS(ns,'rect');
      rect.setAttribute('x',n.x); rect.setAttribute('y',n.y); rect.setAttribute('width',n.w); rect.setAttribute('height',n.h);
      rect.setAttribute('rx',8); rect.setAttribute('fill','rgba(255,255,255,0.05)'); rect.setAttribute('stroke','rgba(255,255,255,0.14)'); rect.setAttribute('stroke-width','1.2');
      var text = document.createElementNS(ns,'text');
      text.setAttribute('x', n.x+n.w/2); text.setAttribute('text-anchor','middle'); text.setAttribute('fill','#F1F3F9');
      text.setAttribute('font-family','Inter, sans-serif'); text.setAttribute('font-size','11.5');
      var words = n.label.split(' ');
      if (n.label.length > 16 && words.length > 1) {
        var mid = Math.ceil(words.length/2);
        text.setAttribute('y', n.y+n.h/2-2);
        var t1 = document.createElementNS(ns,'tspan'); t1.setAttribute('x', n.x+n.w/2); t1.textContent = words.slice(0,mid).join(' ');
        var t2 = document.createElementNS(ns,'tspan'); t2.setAttribute('x', n.x+n.w/2); t2.setAttribute('dy','13'); t2.textContent = words.slice(mid).join(' ');
        text.appendChild(t1); text.appendChild(t2);
      } else {
        text.setAttribute('y', n.y+n.h/2+4); text.textContent = n.label;
      }
      g.appendChild(rect); g.appendChild(text);
      function activate(){
        svg.querySelectorAll('.diagram-node').forEach(function(el){ el.classList.remove('is-active'); });
        g.classList.add('is-active');
        detail.innerHTML = '<h5>'+n.label+'</h5><p>'+n.desc+'</p>';
      }
      g.addEventListener('click', activate);
      g.addEventListener('keydown', function(e){ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); activate(); } });
      frag.appendChild(g);
    });
    svg.appendChild(frag);
  }
  buildYatraDiagram();

  /* ---------------- Accordions ---------------- */
  function wireAccordion(toggleId, panelId){
    var toggle = document.getElementById(toggleId);
    var panel = document.getElementById(panelId);
    toggle.addEventListener('click', function(){
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      panel.hidden = expanded;
      toggle.querySelector('span').textContent = expanded ? 'Read the full case study' : 'Hide the full case study';
    });
  }
  wireAccordion('yatraToggle','yatraAccordion');
  wireAccordion('royoToggle','royoAccordion');

  /* ---------------- Bento grid: expertise ---------------- */
  var expertise = [
    { title:'Backend engineering', tag:'services & APIs',
      body:'Node.js and Express.js services, REST API design, and microservice boundaries — plus RabbitMQ, RSMQ and Kafka for the messaging between them.',
      skills:[{name:'Node.js',icon:'devicon-nodejs-plain'},{name:'Express.js',icon:'devicon-express-original'},{name:'JavaScript',icon:'devicon-javascript-plain'},{name:'TypeScript',icon:'devicon-typescript-plain'},{name:'RabbitMQ',icon:'devicon-rabbitmq-original'},{name:'Kafka',icon:'devicon-apachekafka-original'}] },
    { title:'Frontend engineering', tag:'angular',
      body:'Angular (2+), Angular Material and PrimeNG — building the interfaces on top of the services I design, including the reporting dashboard for Yatra Freight.',
      skills:[{name:'Angular',icon:'devicon-angularjs-plain'},{name:'TypeScript',icon:'devicon-typescript-plain'},{name:'HTML5',icon:'devicon-html5-plain'},{name:'CSS3',icon:'devicon-css3-plain'},{name:'Bootstrap',icon:'devicon-bootstrap-plain'}] },
    { title:'Databases', tag:'data & modeling',
      body:'MongoDB and MongoDB Atlas, SQL, Mongoose and Sequelize — schema design, NoSQL data modeling, and migrations that don\u2019t disrupt what\u2019s running on them.',
      skills:[{name:'MongoDB',icon:'devicon-mongodb-plain'},{name:'MongoDB Atlas',icon:'devicon-mongodb-plain'},{name:'MySQL',icon:'devicon-mysql-plain'},{name:'Sequelize',icon:'devicon-sequelize-plain'}] },
    { title:'Architecture & engineering', tag:'system design',
      body:'Distributed workflows, the saga pattern for multi-step consistency, API design, third-party integrations, and performance optimization.', skills:[] },
    { title:'Infrastructure & tools', tag:'platform',
      body:'Redis, Kong API Gateway, Nginx, PM2, Docker and AWS (EC2, S3) \u2014 plus CI/CD through GitLab.',
      skills:[{name:'Redis',icon:'devicon-redis-plain'},{name:'Docker',icon:'devicon-docker-plain'},{name:'Nginx',icon:'devicon-nginx-original'},{name:'AWS',icon:'devicon-amazonwebservices-original'},{name:'Kong Gateway',icon:''},{name:'PM2',icon:''},{name:'Git',icon:'devicon-git-plain'},{name:'GitLab CI/CD',icon:'devicon-gitlab-plain'}] },
    { title:'Tools & monitoring', tag:'day to day',
      body:'Postman for API work, Jira for planning and tracking, JMeter for load testing, and Graylog for log monitoring.',
      skills:[{name:'Postman',icon:'devicon-postman-plain'},{name:'Jira',icon:'devicon-jira-plain'},{name:'JMeter',icon:''},{name:'Graylog',icon:''},{name:'Bugzilla',icon:''}] }
  ];
  var bentoGrid = document.getElementById('bentoGrid');
  expertise.forEach(function(item){
    var card = document.createElement('div');
    card.className = 'bento-card glass';
    var chips = item.skills.map(function(s){
      var iconHtml = s.icon ? '<i class="'+s.icon+' icon"></i>' : '';
      var brand = s.icon ? (BRAND[s.icon] || '#6C8CFF') : '#8A93B3';
      return '<span class="skill-chip" style="--brand:'+brand+'; --brand-glow:'+hexToRgba(brand,0.4)+';">'+iconHtml+s.name+'</span>';
    }).join('');
    card.innerHTML = '<span class="bento-card__tag">'+item.tag+'</span><h4>'+item.title+'</h4><p>'+item.body+'</p>' + (chips ? '<div class="skill-chips">'+chips+'</div>' : '');
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      card.style.setProperty('--px', (e.clientX - r.left) + 'px');
      card.style.setProperty('--py', (e.clientY - r.top) + 'px');
    });
    bentoGrid.appendChild(card);
  });

  /* ---------------- Leadership ---------------- */
  var leadership = [
    { title:'Technical ownership', body:'Owns systems end to end at Yatra Freight \u2014 from the financial microservice to the reporting pipeline \u2014 including the operational and compliance requirements around them.' },
    { title:'Architecture & design input', body:'Takes part in architecture, design and product sessions rather than working from a handed-down spec.' },
    { title:'Code review', body:'Leads code review for a team of five, and pushed the shared adoption of Kong API Gateway rather than each service handling auth and routing on its own.' },
    { title:'Mentoring', body:'Trains and mentors junior developers and engineers as part of day-to-day team leadership.' },
    { title:'Task estimation & delivery', body:'Owns estimation across features and delivers against it \u2014 from the Yatra Freight financial microservice to the Royo Apps configuration layer.' },
    { title:'Stakeholder collaboration', body:'Works directly with project managers to refine features and usability, and translates requirements like GST e-invoicing rules into system behavior.' }
  ];
  var leadershipGrid = document.getElementById('leadershipGrid');
  leadership.forEach(function(item){
    var el = document.createElement('div');
    el.className = 'leadership-item';
    el.innerHTML = '<h4>'+item.title+'</h4><p>'+item.body+'</p>';
    leadershipGrid.appendChild(el);
  });

  /* ---------------- Career journey (tabbed, click-to-explore) ---------------- */
  var journey = [
    { short:'Yatra Freight', company:'Yatra Online Limited \u2014 Yatra Freight, Gurugram', role:'Senior Software Engineer', date:'Jul 2021 \u2014 Present', span:62, current:true,
      bullets:['Led and mentored a team of 5 engineers across sprint planning, code review and delivery.','Architected the financial microservice for invoicing and transactions \u2014 fewer errors, lower cost, higher efficiency.','Migrated self-hosted MongoDB to Atlas, improving performance and lowering operational cost.','Introduced Kong API Gateway for centralized routing, rate limiting and authentication.','Built a reporting microservice with Angular visualization, aggregating data into a centralized warehouse.','Led integration with a government e-invoicing system and internal accounting tools.','Added Redis caching and other performance work to keep response times fast.'],
      skills:[{name:'Node.js',icon:'devicon-nodejs-plain'},{name:'Angular',icon:'devicon-angularjs-plain'},{name:'MongoDB Atlas',icon:'devicon-mongodb-plain'},{name:'Redis',icon:'devicon-redis-plain'},{name:'Kafka',icon:'devicon-apachekafka-original'},{name:'AWS',icon:'devicon-amazonwebservices-original'},{name:'Docker',icon:'devicon-docker-plain'},{name:'Graylog',icon:''}] },
    { short:'MethodHub', company:'MethodHub Software, Mohali', role:'Senior Software Engineer', date:'Oct 2020 \u2014 Jul 2021', span:9,
      bullets:['Architected an onboarding portal for agents, vendors and customers, cutting onboarding time by 35%.','Built REST API services to manage credit policies and wallets for customers and vendors.','Migrated a legacy medical-domain appointment booking system to Node.js.'],
      skills:[{name:'Node.js',icon:'devicon-nodejs-plain'},{name:'REST APIs',icon:''},{name:'SQL',icon:'devicon-mysql-plain'}] },
    { short:'Code Brew Labs', company:'Code Brew Labs, Chandigarh', role:'Mean Stack Developer', date:'Sept 2019 \u2014 Sept 2020', span:12,
      bullets:['Led frontend development for the Royo SaaS platform across food delivery, e-commerce and rentals.','Built configuration-based strategies so one codebase adapted to different business models.','Integrated more than 20 payment gateways.'],
      skills:[{name:'Angular',icon:'devicon-angularjs-plain'},{name:'JavaScript',icon:'devicon-javascript-plain'},{name:'Node.js',icon:'devicon-nodejs-plain'}] },
    { short:'Appligos', company:'Appligos, Mohali', role:'Software Developer', date:'Aug 2017 \u2014 Sept 2019', span:25,
      bullets:['Built a hospital job marketplace platform for vendor bids and service contract tracking.','Built a multi-provider notification service across Mailgun, Plivo, Firebase and OneSignal.','Maintained the Archaeological Survey of India government portal.','Contributed to Aqua Teams, a workforce management system with real-time location tracking.'],
      skills:[{name:'Node.js',icon:'devicon-nodejs-plain'},{name:'Firebase',icon:''},{name:'Google Analytics',icon:''}] }
  ];
  var journeyRail = document.getElementById('journeyRail');
  var journeyPanel = document.getElementById('journeyPanel');
  var maxSpan = Math.max.apply(null, journey.map(function(j){ return j.span; }));

  function renderJourneyPanel(item){
    var bullets = item.bullets.map(function(b){ return '<li>'+b+'</li>'; }).join('');
    var chips = item.skills.map(function(s){
      var iconHtml = s.icon ? '<i class="'+s.icon+' icon"></i>' : '';
      var brand = s.icon ? (BRAND[s.icon] || '#6C8CFF') : '#8A93B3';
      return '<span class="skill-chip" style="--brand:'+brand+'; --brand-glow:'+hexToRgba(brand,0.4)+';">'+iconHtml+s.name+'</span>';
    }).join('');
    journeyPanel.innerHTML =
      '<span class="journey-panel__date">'+item.date+'</span>' +
      '<h3>'+item.company+'</h3>' +
      '<span class="journey-panel__role">'+item.role+'</span>' +
      '<ul class="journey-panel__bullets">'+bullets+'</ul>' +
      '<div class="skill-chips">'+chips+'</div>';
    journeyPanel.classList.remove('journey-fade');
    void journeyPanel.offsetWidth;
    journeyPanel.classList.add('journey-fade');
  }

  function setActiveJourney(idx){
    journeyRail.querySelectorAll('.journey-node').forEach(function(n,i){
      n.classList.toggle('is-active', i === idx);
      n.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    renderJourneyPanel(journey[idx]);
  }

  journey.forEach(function(item, idx){
    var node = document.createElement('button');
    node.type = 'button';
    node.className = 'journey-node' + (idx === 0 ? ' is-active' : '');
    node.setAttribute('role','tab');
    node.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    node.innerHTML =
      '<span class="journey-node__top">' +
        '<span class="journey-node__dot"></span>' +
        (item.current ? '<span class="journey-node__current">Current</span>' : '') +
      '</span>' +
      '<span class="journey-node__company">'+item.short+'</span>' +
      '<span class="journey-node__date">'+item.date+'</span>' +
      '<span class="journey-node__bar"><span class="journey-node__bar-fill" style="width:'+((item.span/maxSpan)*100)+'%"></span></span>';
    node.addEventListener('click', function(){ setActiveJourney(idx); });
    journeyRail.appendChild(node);
  });
  setActiveJourney(0);

  /* ---------------- Reveal on scroll ---------------- */
  var revealTargets = document.querySelectorAll('.section, .case-study, .bento-card, .about__profile, .leadership-item, .outcome-card, .journey');
  revealTargets.forEach(function(el){ el.classList.add('reveal'); });
  if ('IntersectionObserver' in window && !prefersReduced) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    revealTargets.forEach(function(el){ io.observe(el); });
  } else {
    revealTargets.forEach(function(el){ el.classList.add('is-visible'); });
  }

})();
