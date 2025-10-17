// Sticky Navbar (already handled by CSS 'sticky')
// Smooth scroll for nav links

document.querySelectorAll('.nav-links a, .cta-btn[href^="#"], .footer-col a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Testimonials slider
const testimonials = document.querySelectorAll('.testimonial');
let currentTestimonial = 0;
function showTestimonial(idx) {
  testimonials.forEach((t, i) => t.classList.toggle('active', i === idx));
}
function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}
setInterval(nextTestimonial, 5000);

// Placeholder: Download analytics counter
// (You can implement with backend or localStorage)

// Theme toggle
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

// System theme detection
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

// Gemini API integration for chatbot
const GEMINI_API_KEY = "AIzaSyBjkIGL5hLVdl1pu4vfpIraoKAmHshGxUU";
let chatbotHistory = [
  { role: 'model', parts: [{ text: 'Hi! How can I help you today?' }] }
];
async function fetchGeminiResponse(userMessage) {
  if (!GEMINI_API_KEY) return "Sorry, chatbot is not configured.";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;
  // Add user message to history
  chatbotHistory.push({ role: 'user', parts: [{ text: userMessage }] });
  const body = {
    contents: chatbotHistory.map(m => ({ role: m.role, parts: m.parts }))
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
    // Add model reply to history
    chatbotHistory.push({ role: 'model', parts: [{ text }] });
    return text;
  } catch (e) {
    return "Sorry, there was a problem connecting to the chatbot.";
  }
}

// Chatbot modal logic

document.addEventListener('DOMContentLoaded', function() {
  const openChatbotBtn = document.getElementById('open-chatbot');
  const closeChatbotBtn = document.getElementById('close-chatbot');
  const chatbotModal = document.getElementById('chatbot-modal');
  const chatbotInput = document.getElementById('chatbot-input');

  if (openChatbotBtn && chatbotModal) {
    openChatbotBtn.addEventListener('click', function() {
      chatbotModal.style.display = 'flex';
      setTimeout(() => chatbotInput && chatbotInput.focus(), 100);
      console.log('Chatbot modal opened');
    });
  } else {
    console.error('Chatbot button or modal not found');
  }

  if (closeChatbotBtn && chatbotModal) {
    closeChatbotBtn.addEventListener('click', function() {
      chatbotModal.style.display = 'none';
      console.log('Chatbot modal closed');
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') chatbotModal.style.display = 'none';
  });
  chatbotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = chatbotInput.value.trim();
    if (!msg) return;
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chatbot-message user';
    userMsg.textContent = msg;
    chatbotMessages.appendChild(userMsg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    chatbotInput.value = '';
    // Show loading spinner
    const botMsg = document.createElement('div');
    botMsg.className = 'chatbot-message bot';
    botMsg.innerHTML = '<span class="chatbot-spinner"></span>';
    chatbotMessages.appendChild(botMsg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    // Fetch Gemini response
    const reply = await fetchGeminiResponse(msg);
    botMsg.textContent = reply;
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  });

  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = btn.closest('.faq-card');
      const answer = card.querySelector('.faq-answer');
      const icon = btn.querySelector('.faq-icon');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-toggle').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.closest('.faq-card').classList.remove('open');
        b.querySelector('.faq-icon').textContent = '+';
      });
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
      // Open this one if not already open
      if (!isOpen) {
        answer.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        icon.textContent = '–';
        card.classList.add('open');
      }
    });
  });
});

// Fade-in on page load
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('preload');
  setTimeout(() => document.body.classList.add('fade-in'), 10);
});
// Fade-out on privacy policy link click
const privacyLink = document.querySelector('a[href="privacy.html"]');
if (privacyLink) {
  privacyLink.addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.remove('fade-in', 'preload');
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.scrollTo(0, 0);
      window.location.href = 'privacy.html';
    }, 400);
  });
}
