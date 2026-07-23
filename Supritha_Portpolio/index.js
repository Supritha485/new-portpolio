document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- STATE & LOCAL STORAGE INITIALIZATION ---
  const DEFAULT_PROFILE = {
    name: 'Supritha K A',
    title: 'Data Analyst | Python, SQL, Excel & Data Visualization',
    email: 'suprithasupritha869@gmail.com',
    phone: '+91 8660520114',
    loc: 'Devanahalli, India'
  };

  const DEFAULT_ANALYTICS = {
    cta_clicks: 0,
    project_views: 0,
    certs_clicked: 0,
    contact_submits: 0,
    theme_toggles: 0,
    logs: [{ timestamp: new Date().toLocaleTimeString(), text: 'Analytics dashboard initialized.' }]
  };

  // Load state from local storage or set defaults
  let profileInfo = JSON.parse(localStorage.getItem('supritha_profile_info')) || DEFAULT_PROFILE;
  let analyticsData = JSON.parse(localStorage.getItem('supritha_portfolio_analytics')) || DEFAULT_ANALYTICS;
  let uploadedResume = localStorage.getItem('supritha_resume_base64') || '';
  let uploadedProfileImage = localStorage.getItem('supritha_profile_image_base64') || '';

  // Synchronize initial views with loaded state
  updateProfileDOM();
  syncResumeButton();
  syncProfileImages();
  updateAnalyticsDOM();

  // --- NAVIGATION SCROLL EFFECT ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Hamburger
  const navHamburger = document.getElementById('nav-hamburger');
  const navLinksList = document.getElementById('nav-links');
  navHamburger.addEventListener('click', () => {
    navHamburger.classList.toggle('active');
    navLinksList.classList.toggle('active');
  });

  // Close mobile nav when clicking links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navHamburger.classList.remove('active');
      navLinksList.classList.remove('active');
    });
  });

  // Active link highlighter on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- DARK/LIGHT THEME TOGGLE ---
  const themeToggle = document.getElementById('theme-toggle');
  
  // Set initial theme
  const savedTheme = localStorage.getItem('supritha_theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('supritha_theme', newTheme);
    
    // Log analytics
    trackEvent('theme_toggle', `Switched to ${newTheme} theme`);
    analyticsData.theme_toggles++;
    updateAnalyticsDOM();
  });

  // --- CUSTOM BUTTERFLY CURSOR WITH SMOOTH TRAIL ---
  const butterflyCursor = document.getElementById('butterfly-cursor');
  const butterfly = butterflyCursor.querySelector('.butterfly');
  
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let mouseMoved = false;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    
    if (!mouseMoved) {
      mouseMoved = true;
      butterflyCursor.style.display = 'block';
      currentX = targetX;
      currentY = targetY;
    }
    
    // Spawn trail sparkles
    if (Math.random() < 0.12) {
      spawnSparkle(e.clientX, e.clientY);
    }
  });

  // Physics animation loop for smooth tracking (lerp)
  function animateCursor() {
    if (mouseMoved) {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      currentX += dx * 0.16;
      currentY += dy * 0.16;
      
      // Calculate rotation based on velocity to tilt butterfly in direction of motion
      const speed = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Add 90 deg offset
      
      let tilt = 0;
      if (speed > 2) {
        tilt = Math.min(speed * 0.5, 20); // Max tilt 20 deg
      }
      
      butterflyCursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Spawns small sparkling points along trail
  function spawnSparkle(x, y) {
    const dot = document.createElement('div');
    dot.className = 'sparkle-trail';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    
    // Randomize scale
    const size = Math.random() * 5 + 3;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    
    // Randomize colors
    const colors = ['var(--accent-teal)', 'var(--accent-violet)', 'var(--accent-amber)'];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    dot.style.backgroundColor = randColor;
    dot.style.boxShadow = `0 0 8px ${randColor}`;
    
    document.body.appendChild(dot);
    
    // Move sparkles outwards slightly
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 15 + 5;
    const destX = x + Math.cos(angle) * distance;
    const destY = y + Math.sin(angle) * distance;
    
    setTimeout(() => {
      dot.style.transform = `translate3d(${destX - x}px, ${destY - y}px, 0) scale(0)`;
      dot.style.opacity = '0';
    }, 50);

    // Remove element after animation finishes
    setTimeout(() => {
      dot.remove();
    }, 650);
  }

  // Speed up butterfly flutter and scale on hover over links
  const hoverableElements = 'a, button, .project-card, .cert-card, .file-upload-label';
  document.querySelectorAll(hoverableElements).forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      butterfly.querySelectorAll('.wing').forEach(wing => {
        wing.style.animationDuration = '0.07s'; // flutter faster
      });
      butterflyCursor.style.transform += ' scale(1.2)';
    });
    
    elem.addEventListener('mouseleave', () => {
      butterfly.querySelectorAll('.wing').forEach(wing => {
        wing.style.animationDuration = '0.15s'; // restore speed
      });
    });
  });

  // --- TYPEWRITER EFFECT IN HERO ---
  const typewriterElement = document.getElementById('typewriter');
  const taglines = [
    'Data Analyst | Python, SQL, Excel & Data Visualization',
    'Information Science Engineering Student',
    'AI Enthusiast & Dashboard Engineer'
  ];
  
  let taglineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typewriterSpeed = 80;

  function type() {
    const currentTagline = taglines[taglineIndex];
    
    if (isDeleting) {
      typewriterElement.textContent = currentTagline.substring(0, charIndex - 1);
      charIndex--;
      typewriterSpeed = 30; // speed up deleting
    } else {
      typewriterElement.textContent = currentTagline.substring(0, charIndex + 1);
      charIndex++;
      typewriterSpeed = 80; // type normal
    }

    if (!isDeleting && charIndex === currentTagline.length) {
      typewriterSpeed = 2500; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglines.length;
      typewriterSpeed = 500; // pause before typing next
    }

    setTimeout(type, typewriterSpeed);
  }
  
  // Start typewriter
  setTimeout(type, 1000);

  // --- HERO DYNAMIC CANVAS DATA PARTICLES ---
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  let w, h;
  
  function resizeCanvas() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2.5 + 1.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Screen edge boundary bounces
      if (this.x < 0 || this.x > w) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > h) this.speedY = -this.speedY;
    }
    
    draw() {
      // Color matches teal or violet accent based on parity
      ctx.fillStyle = this.x % 2 === 0 ? 'rgba(20, 184, 166, 0.4)' : 'rgba(139, 92, 246, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.min(80, Math.floor((w * h) / 15000));
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();
  window.addEventListener('resize', initParticles);
  
  function connectParticles() {
    const maxDistance = 110;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDistance) {
          const alpha = (1 - (dist / maxDistance)) * 0.15;
          ctx.strokeStyle = `rgba(20, 184, 166, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- SCROLL TRIGGERED ANIMATIONS & PROGRESS BARS ---
  const scrollElements = document.querySelectorAll('.reveal-fade-up');
  
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // If this is the skills container, animate the progress bars
        if (entry.target.classList.contains('skills-container') || entry.target.querySelector('.skill-progress')) {
          animateProgressBars();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  scrollElements.forEach(el => {
    scrollObserver.observe(el);
  });

  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = targetWidth;
    });
  }

  // --- SKILLS SECTION TABS CONTROL ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.skills-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('id') === `tab-${category}`) {
          content.classList.add('active');
          // Trigger progress bar widths
          content.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
          });
        }
      });
      
      // Log event
      trackEvent('skills_tab_switch', `Switched skills tab to: ${category}`);
    });
  });

  // --- MODALS (CASE STUDIES & ADMIN) ---
  const modals = document.querySelectorAll('.modal');
  const openModalButtons = document.querySelectorAll('.open-modal');
  const closeModalButtons = document.querySelectorAll('.modal-close');

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Analytics track
        const project = btn.closest('.project-card')?.getAttribute('data-project') || modalId;
        trackEvent('project_view', `Opened project details: ${project}`);
        analyticsData.project_views++;
        updateAnalyticsDOM();
      }
    });
  });

  closeModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Close modals on clicking outer backdrop
  modals.forEach(modal => {
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
      closeAllModals();
    });
  });

  function closeAllModals() {
    modals.forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  // --- ADMIN PORTAL ACTIONS & AUTHENTICATION ---
  const adminToggleBtn = document.getElementById('admin-toggle');
  const projectsAdminBtn = document.getElementById('projects-admin-btn');
  const adminModal = document.getElementById('modal-admin');
  const adminAuthScreen = document.getElementById('admin-auth-screen');
  const adminUploadScreen = document.getElementById('admin-upload-screen');
  const passcodeField = document.getElementById('admin-passcode');
  const authError = document.getElementById('admin-auth-error');
  const authSubmit = document.getElementById('btn-admin-auth');
  
  // Open Admin Console
  const openAdminModal = () => {
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Check if already authenticated session-wise
    if (sessionStorage.getItem('supritha_auth') === 'true') {
      showAdminUploadScreen();
    } else {
      showAdminAuthScreen();
    }
  };

  adminToggleBtn.addEventListener('click', openAdminModal);
  if (projectsAdminBtn) {
    projectsAdminBtn.addEventListener('click', openAdminModal);
  }

  // Handle Passcode Auth
  authSubmit.addEventListener('click', handleAuth);
  passcodeField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAuth();
  });

  function handleAuth() {
    const code = passcodeField.value.trim();
    if (code === 'supritha485') {
      sessionStorage.setItem('supritha_auth', 'true');
      authError.classList.add('hidden');
      passcodeField.value = '';
      showAdminUploadScreen();
      trackEvent('admin_login_success', 'Successfully logged in to Admin Console.');
    } else {
      authError.classList.remove('hidden');
      trackEvent('admin_login_failed', 'Failed login attempt.');
    }
  }

  function showAdminAuthScreen() {
    adminAuthScreen.classList.remove('hidden');
    adminUploadScreen.classList.add('hidden');
  }

  function showAdminUploadScreen() {
    adminAuthScreen.classList.add('hidden');
    adminUploadScreen.classList.remove('hidden');
    
    // Populate form with current local values
    document.getElementById('admin-profile-name').value = profileInfo.name;
    document.getElementById('admin-profile-title').value = profileInfo.title;
    document.getElementById('admin-profile-email').value = profileInfo.email;
    document.getElementById('admin-profile-phone').value = profileInfo.phone;
    document.getElementById('admin-profile-loc').value = profileInfo.loc;
    
    // Reset file upload tag
    const fileName = localStorage.getItem('supritha_resume_filename') || '';
    if (fileName) {
      document.getElementById('file-upload-name').textContent = `Uploaded: ${fileName}`;
    } else {
      document.getElementById('file-upload-name').textContent = 'Choose PDF Resume';
    }

    const imageName = localStorage.getItem('supritha_profile_image_filename') || '';
    if (imageName) {
      document.getElementById('image-upload-name').textContent = `Uploaded: ${imageName}`;
    } else {
      document.getElementById('image-upload-name').textContent = 'Choose Profile Image';
    }
  }

  // File Upload Processing (Base64)
  const resumeFileInput = document.getElementById('admin-resume-file');
  resumeFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
      const base64Data = evt.target.result;
      
      // Store in LocalStorage
      localStorage.setItem('supritha_resume_base64', base64Data);
      localStorage.setItem('supritha_resume_filename', file.name);
      uploadedResume = base64Data;
      
      document.getElementById('file-upload-name').textContent = `Uploaded: ${file.name}`;
      syncResumeButton();
      
      trackEvent('admin_resume_uploaded', `Uploaded resume: ${file.name}`);
      alert('Resume uploaded successfully! The "Download Resume" CTA link has been updated.');
    };
    reader.readAsDataURL(file);
  });

  // Profile Image Upload Processing (Base64)
  const imageFileInput = document.getElementById('admin-profile-image-file');
  if (imageFileInput) {
    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        alert('Only image files are supported.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64Data = evt.target.result;
        
        // Store in LocalStorage
        localStorage.setItem('supritha_profile_image_base64', base64Data);
        localStorage.setItem('supritha_profile_image_filename', file.name);
        uploadedProfileImage = base64Data;
        
        document.getElementById('image-upload-name').textContent = `Uploaded: ${file.name}`;
        syncProfileImages();
        
        trackEvent('admin_image_uploaded', `Uploaded profile photo: ${file.name}`);
        alert('Profile photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    });
  }

  // Save profile info edits
  const saveProfileBtn = document.getElementById('btn-admin-save');
  const saveSuccessMsg = document.getElementById('admin-save-success');
  saveProfileBtn.addEventListener('click', () => {
    profileInfo.name = document.getElementById('admin-profile-name').value.trim();
    profileInfo.title = document.getElementById('admin-profile-title').value.trim();
    profileInfo.email = document.getElementById('admin-profile-email').value.trim();
    profileInfo.phone = document.getElementById('admin-profile-phone').value.trim();
    profileInfo.loc = document.getElementById('admin-profile-loc').value.trim();
    
    localStorage.setItem('supritha_profile_info', JSON.stringify(profileInfo));
    updateProfileDOM();
    
    saveSuccessMsg.classList.remove('hidden');
    setTimeout(() => saveSuccessMsg.classList.add('hidden'), 3000);
    
    trackEvent('admin_profile_saved', 'Saved updated profile settings.');
  });

  // Update profile details dynamically in UI
  function updateProfileDOM() {
    // Hero updates
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.innerHTML = `Hi, I'm <span class="gradient-text">${profileInfo.name}</span>`;
    }
    
    // About details
    const aboutHeaderRole = document.getElementById('about-heading-role');
    if (aboutHeaderRole) aboutHeaderRole.textContent = profileInfo.title;
    
    const aboutEmail = document.getElementById('about-info-email');
    if (aboutEmail) {
      aboutEmail.textContent = profileInfo.email;
      aboutEmail.href = `mailto:${profileInfo.email}`;
    }
    
    const aboutPhone = document.getElementById('about-info-phone');
    if (aboutPhone) aboutPhone.textContent = profileInfo.phone;
    
    const aboutLoc = document.getElementById('about-info-loc');
    if (aboutLoc) aboutLoc.textContent = profileInfo.loc;

    // Contact details
    const contactEmail = document.getElementById('contact-info-email-a');
    if (contactEmail) {
      contactEmail.textContent = profileInfo.email;
      contactEmail.href = `mailto:${profileInfo.email}`;
    }
    
    const contactPhone = document.getElementById('contact-info-phone-a');
    if (contactPhone) {
      contactPhone.textContent = profileInfo.phone;
      contactPhone.href = `tel:${profileInfo.phone.replace(/\s+/g, '')}`;
    }
    
    const contactLoc = document.getElementById('contact-info-loc-span');
    if (contactLoc) contactLoc.textContent = profileInfo.loc;
  }

  // Update Resume button action based on upload status
  function syncResumeButton() {
    const resumeBtn = document.getElementById('hero-download-resume');
    if (!resumeBtn) return;
    
    if (uploadedResume) {
      // Direct Download base64 data
      resumeBtn.href = uploadedResume;
      resumeBtn.download = localStorage.getItem('supritha_resume_filename') || 'Supritha_Resume.pdf';
      const btnSpan = resumeBtn.querySelector('span');
      if (btnSpan) btnSpan.textContent = 'Download Resume';
    } else {
      // Default to copied workspace file
      resumeBtn.href = './resume.pdf';
      resumeBtn.download = 'Supritha_KA_Resume.pdf';
      const btnSpan = resumeBtn.querySelector('span');
      if (btnSpan) btnSpan.textContent = 'Download Resume';
    }
  }

  // Synchronize Profile Images in UI
  function syncProfileImages() {
    if (uploadedProfileImage) {
      document.querySelectorAll('.hero-profile-image, .about-portrait').forEach(img => {
        img.src = uploadedProfileImage;
      });
    } else {
      document.querySelectorAll('.hero-profile-image, .about-portrait').forEach(img => {
        img.src = 'profile.png';
      });
    }
  }

  // --- RECRUITER METRICS PANEL LOGIC ---
  const metricsPanel = document.getElementById('metrics-panel');
  const metricsToggleBtn = document.getElementById('metrics-panel-toggle');
  const metricsCloseBtn = document.getElementById('metrics-close');

  metricsToggleBtn.addEventListener('click', () => {
    metricsPanel.classList.toggle('active');
    if (metricsPanel.classList.contains('active')) {
      // Draw graph when panel becomes active
      drawMetricsChart();
    }
    trackEvent('metrics_panel_toggle', 'Toggled Recruiter Insights Dashboard');
  });

  metricsCloseBtn.addEventListener('click', () => {
    metricsPanel.classList.remove('active');
  });

  // Track CTA Click Events
  document.querySelectorAll('.track-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const ctaType = btn.getAttribute('data-cta') || btn.textContent.trim();
      analyticsData.cta_clicks++;
      trackEvent('cta_click', `Clicked CTA button: ${ctaType}`);
      updateAnalyticsDOM();
    });
  });

  // Track Certification Clicks
  document.querySelectorAll('.track-cert').forEach(card => {
    card.addEventListener('click', () => {
      const certName = card.querySelector('.cert-title').textContent;
      analyticsData.certs_clicked++;
      trackEvent('cert_view', `Viewed certification: ${certName}`);
      updateAnalyticsDOM();
    });
  });

  // Contact Form Submission Handler
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    
    analyticsData.contact_submits++;
    trackEvent('contact_submit', `Message sent by ${name} (${email}) - Subj: ${subject}`);
    updateAnalyticsDOM();
    
    formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully. (Events tracked in dashboard)`;
    formFeedback.className = 'form-feedback success';
    formFeedback.classList.remove('hidden');
    
    contactForm.reset();
    
    setTimeout(() => {
      formFeedback.classList.add('hidden');
    }, 5000);
  });

  // Master function to record an event log
  function trackEvent(eventType, description) {
    const timestamp = new Date().toLocaleTimeString();
    const logItem = { timestamp, text: description };
    
    analyticsData.logs.unshift(logItem); // Add to beginning of array
    // Cap log history size at 25 items
    if (analyticsData.logs.length > 25) {
      analyticsData.logs.pop();
    }
    
    // Save to localStorage
    localStorage.setItem('supritha_portfolio_analytics', JSON.stringify(analyticsData));
    
    // Redraw SVG if active
    if (metricsPanel.classList.contains('active')) {
      drawMetricsChart();
    }
  }

  // Update counters in panel DOM
  function updateAnalyticsDOM() {
    document.getElementById('stat-cta-clicks').textContent = analyticsData.cta_clicks;
    document.getElementById('stat-project-views').textContent = analyticsData.project_views;
    document.getElementById('stat-certs-clicked').textContent = analyticsData.certs_clicked;
    
    // Update logs list
    const logList = document.getElementById('metrics-log-list');
    if (logList) {
      logList.innerHTML = '';
      analyticsData.logs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'log-entry event-log';
        item.innerHTML = `<span class="teal">[${log.timestamp}]</span> ${escapeHTML(log.text)}`;
        logList.appendChild(item);
      });
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Dynamically draw SVG Bar Chart inside panel
  function drawMetricsChart() {
    const svg = document.getElementById('metrics-svg-chart');
    if (!svg) return;
    
    // Clear previous drawing
    svg.innerHTML = '';
    
    // Data setup
    const data = [
      { label: 'CTAs', value: analyticsData.cta_clicks, fill: 'var(--accent-teal)' },
      { label: 'Projects', value: analyticsData.project_views, fill: 'var(--accent-violet)' },
      { label: 'Certs', value: analyticsData.certs_clicked, fill: 'var(--accent-amber)' },
      { label: 'Form', value: analyticsData.contact_submits, fill: '#ef4444' },
      { label: 'Theme', value: analyticsData.theme_toggles, fill: '#10b981' }
    ];
    
    // Max value constraint to scale height
    const maxVal = Math.max(5, ...data.map(d => d.value));
    
    const chartHeight = 85;
    const paddingLeft = 35;
    const spacing = 50;
    const barWidth = 24;
    
    // Draw Axis lines
    const gridColor = 'rgba(255,255,255,0.08)';
    
    // Grid horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = 10 + (chartHeight / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      
      // Grid line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', paddingLeft);
      line.setAttribute('y1', y);
      line.setAttribute('x2', 290);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', gridColor);
      line.setAttribute('stroke-dasharray', '3,3');
      svg.appendChild(line);
      
      // Axis tick label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', paddingLeft - 8);
      text.setAttribute('y', y + 3);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('font-size', '8px');
      text.setAttribute('fill', 'var(--text-muted)');
      text.textContent = val;
      svg.appendChild(text);
    }
    
    // Draw Columns (Bars)
    data.forEach((d, idx) => {
      const x = paddingLeft + 15 + idx * spacing;
      const height = (d.value / maxVal) * chartHeight;
      const y = 10 + chartHeight - height;
      
      // Column Bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', barWidth);
      rect.setAttribute('height', Math.max(2, height)); // Min height 2px to show zero states slightly
      rect.setAttribute('rx', '3');
      rect.setAttribute('fill', d.fill);
      rect.style.transition = 'y 0.5s ease-out, height 0.5s ease-out';
      svg.appendChild(rect);
      
      // X-Axis Labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x + barWidth / 2);
      text.setAttribute('y', 10 + chartHeight + 14);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '8px');
      text.setAttribute('fill', 'var(--text-secondary)');
      text.textContent = d.label;
      svg.appendChild(text);
    });
  }
});
