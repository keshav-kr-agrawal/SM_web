// Theme toggle logic for privacy.html
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function setTheme(light, save = true) {
  if (light) {
    document.body.classList.add('light-theme');
    themeIcon.textContent = '\u2600\ufe0f';
    if (save) localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light-theme');
    themeIcon.textContent = '\ud83c\udf19';
    if (save) localStorage.setItem('theme', 'dark');
  }
}
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  setTheme(true, false);
} else if (savedTheme === 'dark') {
  setTheme(false, false);
} else {
  setTheme(!prefersDark, false);
}
themeToggle.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('light-theme'), true);
});
// Contact link redirect
const contactLink = document.getElementById('contact-link');
if (contactLink) {
  contactLink.addEventListener('click', function(e) {
    if (window.location.pathname.endsWith('privacy.html')) {
      window.location.href = 'index.html#contact';
    }
  });
}
const gotoContact = document.getElementById('goto-contact');
if (gotoContact) {
  gotoContact.addEventListener('click', function(e) {
    if (window.location.pathname.endsWith('privacy.html')) {
      window.location.href = 'index.html#contact';
    }
  });
}
// Fade-in on page load
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('preload');
  setTimeout(() => document.body.classList.add('fade-in'), 10);
});
// Fade-out on Home link click
const homeLink = document.querySelector('a[href="index.html"]');
if (homeLink) {
  homeLink.addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.remove('fade-in', 'preload');
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.scrollTo(0, 0);
      window.location.href = 'index.html';
    }, 400);
  });
} 