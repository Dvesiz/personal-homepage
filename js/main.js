(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var topbar = document.querySelector('.topbar');
  var syncTopbar = function () {
    if (topbar) topbar.classList.toggle('is-scrolled', window.scrollY > 28);
  };
  syncTopbar();
  window.addEventListener('scroll', syncTopbar, { passive: true });

  var reveals = document.querySelectorAll('.manifesto, .work-item, .capability-map article, .signal-section, .contact-section');
  reveals.forEach(function (element) { element.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px' });
    reveals.forEach(function (element) { observer.observe(element); });
  } else { reveals.forEach(function (element) { element.classList.add('in'); }); }

  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  function closeLightbox() { lightbox.hidden = true; document.body.style.overflow = ''; }
  document.querySelectorAll('.cert-thumb').forEach(function (button) {
    button.addEventListener('click', function () {
      lightboxImage.src = button.getAttribute('data-image');
      lightboxImage.alt = button.querySelector('img').alt;
      lightboxCaption.textContent = button.getAttribute('data-caption');
      lightbox.hidden = false; document.body.style.overflow = 'hidden';
    });
  });
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  // 主题切换
  var applySignalTheme = function () {};
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    var root = document.documentElement;
    if (localStorage.getItem('theme') === 'light') root.setAttribute('data-theme', 'light');
    themeToggle.addEventListener('click', function () {
      var isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) { root.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); }
      else { root.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', isLight ? '#070908' : '#f5f4ee');
      applySignalTheme(!isLight);
    });
  }

  var canvas = document.getElementById('signal-canvas');
  if (!canvas || !window.THREE || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 0, 8);
  var group = new THREE.Group(); scene.add(group);
  var grid = new THREE.GridHelper(19, 26, 0x45614d, 0x243429);
  grid.rotation.x = Math.PI / 2.55; grid.position.set(1.5, -1.6, -2); group.add(grid);
  var count = 420, positions = new Float32Array(count * 3), glowFlags = new Uint8Array(count);
  var colorAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  for (var i = 0; i < count; i++) {
    var theta = Math.random() * Math.PI * 2, radius = 1.1 + Math.random() * 4.1;
    positions[i * 3] = Math.cos(theta) * radius + 1.8;
    positions[i * 3 + 1] = Math.sin(theta) * radius * .65;
    positions[i * 3 + 2] = (Math.random() - .5) * 2.5;
    glowFlags[i] = Math.random() > .85 ? 1 : 0;
  }
  var geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('color', colorAttr);
  var points = new THREE.Points(geometry, new THREE.PointsMaterial({ size: .045, vertexColors: true, transparent: true, opacity: .9 })); group.add(points);
  var ringMat = new THREE.MeshBasicMaterial({ color: 0xb6ff43, transparent: true, opacity: .48 });
  var ring = new THREE.Mesh(new THREE.TorusGeometry(1.65, .012, 8, 80), ringMat); ring.position.set(1.8, .05, -1.2); group.add(ring);
  applySignalTheme = function (light) {
    var arr = colorAttr.array;
    for (var j = 0; j < count; j++) {
      if (glowFlags[j]) { arr[j * 3] = light ? .25 : .72; arr[j * 3 + 1] = light ? .49 : 1; arr[j * 3 + 2] = light ? .12 : .26; }
      else { arr[j * 3] = light ? .12 : .2; arr[j * 3 + 1] = light ? .40 : .7; arr[j * 3 + 2] = light ? .32 : .35; }
    }
    colorAttr.needsUpdate = true;
    ringMat.color.setHex(light ? 0x3f7d1f : 0xb6ff43);
    ringMat.opacity = light ? .6 : .48;
  };
  applySignalTheme(document.documentElement.getAttribute('data-theme') === 'light');
  var pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (event) { pointer.x = event.clientX / window.innerWidth - .5; pointer.y = event.clientY / window.innerHeight - .5; }, { passive: true });
  function resize() { var rect = canvas.getBoundingClientRect(); renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', resize); resize();
  function frame(time) { group.rotation.y += .0015; group.rotation.x += (pointer.y * .18 - group.rotation.x) * .025; group.rotation.z += (pointer.x * .1 - group.rotation.z) * .02; ring.rotation.z = time * .00035; points.rotation.z = -time * .00006; renderer.render(scene, camera); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
})();
