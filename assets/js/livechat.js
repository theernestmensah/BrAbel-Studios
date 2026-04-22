/**
 * BrAbel — Premium Live Chat Widget
 * Opens a branded chat panel with quick-reply prompts that link to WhatsApp.
 */
(function () {
    'use strict';

    const WA_NUMBER = '233209895858';
    const AGENT_NAME = ['Ernest', 'Albert'][Math.floor(Math.random() * 2)];
    const AGENT_ROLE = 'Co Founder';
    const GREETING =
        `Hi there! 👋 I'm ${AGENT_NAME} from BrAbel. How can I help you today? Pick a topic below or type your own message.`;

    const QUICK_REPLIES = [
        { label: '🌐 I need a new website', msg: 'Hi! I need a new website for my business.' },
        { label: '🛒 E-commerce / Online store', msg: 'Hi! I\'d like to build an e-commerce store.' },
        { label: '💻 Build custom software', msg: 'Hi! I need custom software for my business.' },
        { label: '💰 Pricing & packages', msg: 'Hi! Can you share your pricing and packages?' },
        { label: '⚡ Quick support / question', msg: 'Hi! I have a quick question about your services.' },
    ];

    /* ── Styles ─────────────────────────────────────────────────────────── */
    const css = `
    /* ── FAB Button ── */
    #bra-chat-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 99999;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, hsl(20,90%,52%) 0%, hsl(32,95%,50%) 100%);
      box-shadow: 0 6px 24px hsla(20,90%,50%,0.5);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease;
      outline: none;
    }
    #bra-chat-fab:hover { transform: scale(1.12); box-shadow: 0 8px 30px hsla(20,90%,50%,0.7); }
    #bra-chat-fab:active { transform: scale(0.96); }
    #bra-chat-fab svg { display: block; }

    /* Pulse ring */
    #bra-chat-fab::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px solid hsla(20,90%,50%,0.45);
      animation: bra-ping 2s cubic-bezier(0,0,.2,1) infinite;
    }
    @keyframes bra-ping {
      0%   { transform: scale(1);   opacity: 0.7; }
      75%, 100% { transform: scale(1.5); opacity: 0; }
    }

    /* Notification badge */
    #bra-chat-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ef4444;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Inter, system-ui, sans-serif;
      border: 2px solid #fff;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    #bra-chat-badge.hidden { transform: scale(0); opacity: 0; }

    /* ── Chat Popup ── */
    #bra-chat-popup {
      position: fixed;
      bottom: 104px;
      right: 28px;
      z-index: 99998;
      width: 360px;
      max-height: 560px;
      border-radius: 20px;
      overflow: hidden;
      background: #0f0f13;
      border: 1px solid rgba(139, 92, 246, 0.25);
      box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04);
      display: flex;
      flex-direction: column;
      font-family: Inter, system-ui, sans-serif;
      transform-origin: bottom right;
      transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
    }
    #bra-chat-popup.bra-hidden {
      transform: scale(0.85) translateY(10px);
      opacity: 0;
      pointer-events: none;
    }

    /* ── Header ── */
    .bra-header {
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      padding: 18px 18px 20px;
      position: relative;
      overflow: hidden;
    }
    .bra-header::after {
      content: '';
      position: absolute;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.4;
    }
    .bra-header-row {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      z-index: 1;
    }
    .bra-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      color: #fff;
      flex-shrink: 0;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .bra-agent-info { flex: 1; }
    .bra-agent-name { font-size: 15px; font-weight: 700; color: #fff; line-height: 1.2; }
    .bra-agent-role { font-size: 12px; color: rgba(255,255,255,0.75); margin-top: 2px; }
    .bra-online-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 0 2px rgba(74,222,128,0.3);
      display: inline-block;
      margin-right: 5px;
      animation: bra-blink 2s ease-in-out infinite;
    }
    @keyframes bra-blink { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
    .bra-close-btn {
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 8px;
      color: #fff;
      width: 30px; height: 30px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 300;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .bra-close-btn:hover { background: rgba(255,255,255,0.28); }
    .bra-tagline {
      font-size: 12px;
      color: rgba(255,255,255,0.8);
      margin-top: 12px;
      position: relative;
      z-index: 1;
      line-height: 1.4;
    }

    /* ── Body ── */
    .bra-body {
      flex: 1;
      overflow-y: auto;
      padding: 18px 16px 8px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(139,92,246,0.3) transparent;
    }

    /* ── Bubble ── */
    .bra-bubble {
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
    .bra-bubble-av {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: #fff;
      flex-shrink: 0;
    }
    .bra-bubble-text {
      background: #1e1e2a;
      border: 1px solid rgba(139,92,246,0.15);
      border-radius: 18px 18px 18px 4px;
      padding: 12px 14px;
      font-size: 13.5px;
      color: #d4d4e8;
      line-height: 1.5;
      max-width: 270px;
    }
    .bra-timestamp {
      font-size: 10px;
      color: #4a4a5a;
      margin-top: 4px;
      padding-left: 42px;
    }

    /* Typing indicator */
    .bra-typing {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .bra-typing-dots {
      background: #1e1e2a;
      border: 1px solid rgba(139,92,246,0.15);
      border-radius: 18px 18px 18px 4px;
      padding: 12px 16px;
      display: flex;
      gap: 5px;
      align-items: center;
    }
    .bra-typing-dots span {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #8b5cf6;
      animation: bra-bounce 1.2s ease-in-out infinite;
      display: block;
    }
    .bra-typing-dots span:nth-child(2) { animation-delay: 0.15s; }
    .bra-typing-dots span:nth-child(3) { animation-delay: 0.30s; }
    @keyframes bra-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    /* ── Quick Replies ── */
    .bra-qr-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 16px 6px;
    }
    .bra-qr-label {
      font-size: 11px;
      color: #5a5a72;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .bra-qr-btn {
      width: 100%;
      text-align: left;
      background: rgba(139,92,246,0.08);
      border: 1px solid rgba(139,92,246,0.22);
      color: #c4b5fd;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 13px;
      font-family: Inter, system-ui, sans-serif;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.15s;
      line-height: 1.3;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .bra-qr-btn:hover {
      background: rgba(139,92,246,0.18);
      border-color: rgba(139,92,246,0.5);
      transform: translateX(2px);
    }
    .bra-qr-btn-arrow { margin-left: auto; opacity: 0.5; font-size: 14px; }

    /* ── Footer Input ── */
    .bra-footer {
      padding: 12px 16px 14px;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex;
      gap: 10px;
      align-items: center;
      background: #0f0f13;
    }
    .bra-input {
      flex: 1;
      background: #1a1a24;
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 13px;
      color: #e2e2f0;
      font-family: Inter, system-ui, sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }
    .bra-input::placeholder { color: #4a4a62; }
    .bra-input:focus { border-color: rgba(139,92,246,0.6); }
    .bra-send-btn {
      width: 42px; height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #25d366, #1aad50);
      border: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 2px 10px rgba(37,211,102,0.35);
    }
    .bra-send-btn:hover { transform: scale(1.08); box-shadow: 0 4px 14px rgba(37,211,102,0.5); }
    .bra-send-btn svg { display: block; }

    /* Mobile */
    @media (max-width: 480px) {
      #bra-chat-popup { right: 12px; left: 12px; width: auto; bottom: 90px; }
      #bra-chat-fab  { right: 16px; bottom: 20px; }
    }

    @keyframes bra-fadein {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;

    /* ── Inject CSS ────────────────────────────────────────────────────── */
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    /* ── Build HTML ────────────────────────────────────────────────────── */
    const CHAT_ICON = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="8" cy="10" r="1" fill="white"/>
    <circle cx="12" cy="10" r="1" fill="white"/>
    <circle cx="16" cy="10" r="1" fill="white"/>
  </svg>`;

    const SEND_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

    // FAB
    const fab = document.createElement('button');
    fab.id = 'bra-chat-fab';
    fab.setAttribute('aria-label', 'Chat with us');
    fab.innerHTML = `${CHAT_ICON}<span id="bra-chat-badge">1</span>`;

    // Popup
    const popup = document.createElement('div');
    popup.id = 'bra-chat-popup';
    popup.className = 'bra-hidden';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Live chat');

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const qrHTML = QUICK_REPLIES.map(qr =>
        `<button class="bra-qr-btn" data-msg="${qr.msg.replace(/"/g, '&quot;')}">${qr.label}<span class="bra-qr-btn-arrow">→</span></button>`
    ).join('');

    popup.innerHTML = `
    <div class="bra-header">
      <div class="bra-header-row">
        <div class="bra-avatar">${AGENT_NAME[0]}</div>
        <div class="bra-agent-info">
          <div class="bra-agent-name">${AGENT_NAME}</div>
          <div class="bra-agent-role"><span class="bra-online-dot"></span>${AGENT_ROLE}</div>
        </div>
        <button class="bra-close-btn" id="bra-close-btn" aria-label="Close chat">✕</button>
      </div>
      <p class="bra-tagline">We typically reply within a few minutes via WhatsApp.</p>
    </div>

    <div class="bra-body" id="bra-body">
      <!-- typing shown first, message revealed after -->
      <div class="bra-typing" id="bra-typing">
        <div class="bra-bubble-av">${AGENT_NAME[0]}</div>
        <div class="bra-typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <div class="bra-qr-wrap" id="bra-qr-wrap" style="display:none;">
      <div class="bra-qr-label">Choose a topic</div>
      ${qrHTML}
    </div>

    <div class="bra-footer">
      <input class="bra-input" id="bra-input" type="text" placeholder="Type your message…" />
      <button class="bra-send-btn" id="bra-send-btn" aria-label="Send via WhatsApp">${SEND_ICON}</button>
    </div>
  `;

    document.body.appendChild(fab);
    document.body.appendChild(popup);

    /* ── Logic ────────────────────────────────────────────────────────── */
    const badge = document.getElementById('bra-chat-badge');
    const body = document.getElementById('bra-body');
    const typing = document.getElementById('bra-typing');
    const qrWrap = document.getElementById('bra-qr-wrap');
    const input = document.getElementById('bra-input');
    const sendBtn = document.getElementById('bra-send-btn');
    const closeBtn = document.getElementById('bra-close-btn');

    let opened = false;

    function openChat() {
        popup.classList.remove('bra-hidden');
        badge.classList.add('hidden');
        fab.setAttribute('aria-expanded', 'true');

        if (!opened) {
            opened = true;
            // Simulate typing then reveal greeting
            setTimeout(() => {
                typing.remove();

                const bubble = document.createElement('div');
                bubble.className = 'bra-bubble';
                bubble.innerHTML = `
          <div class="bra-bubble-av">${AGENT_NAME[0]}</div>
          <div>
            <div class="bra-bubble-text">${GREETING}</div>
            <div class="bra-timestamp">${timeStr}</div>
          </div>`;
                body.appendChild(bubble);
                qrWrap.style.display = 'flex';
                input.focus();
            }, 1200);
        } else {
            input.focus();
        }
    }

    function closeChat() {
        popup.classList.add('bra-hidden');
        fab.setAttribute('aria-expanded', 'false');
    }

    function sendMessage(msg) {
        if (!msg.trim()) return;
        const encoded = encodeURIComponent(msg.trim());
        window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    }

    fab.addEventListener('click', () => {
        const isOpen = !popup.classList.contains('bra-hidden');
        isOpen ? closeChat() : openChat();
    });

    closeBtn.addEventListener('click', closeChat);

    // Quick reply buttons
    popup.addEventListener('click', (e) => {
        const btn = e.target.closest('.bra-qr-btn');
        if (btn) {
            const msg = btn.getAttribute('data-msg');
            sendMessage(msg);
        }
    });

    // Custom message
    sendBtn.addEventListener('click', () => {
        sendMessage(input.value);
        input.value = '';
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage(input.value);
            input.value = '';
        }
    });

    // Press Escape to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !popup.classList.contains('bra-hidden')) closeChat();
    });

    // Auto-open hint badge pulse for first-time visitors
    if (!sessionStorage.getItem('bra_chat_seen')) {
        sessionStorage.setItem('bra_chat_seen', '1');
        // Show a tooltip nudge after 5s
        setTimeout(() => {
            if (popup.classList.contains('bra-hidden')) {
                const nudge = document.createElement('div');
                nudge.style.cssText = `
          position:fixed; bottom:100px; right:28px; z-index:99997;
          background:#1e1e2a; border:1px solid rgba(139,92,246,0.35);
          color:#c4b5fd; font-size:13px; font-family:Inter,system-ui,sans-serif;
          padding:10px 14px; border-radius:12px; max-width:200px; line-height:1.4;
          box-shadow:0 8px 24px rgba(0,0,0,0.4);
          animation: bra-fadein 0.4s ease;
        `;
                nudge.textContent = '💬 Questions? Chat with us!';
                document.body.appendChild(nudge);
                setTimeout(() => nudge.remove(), 5000);
            }
        }, 5000);
    }
})();
