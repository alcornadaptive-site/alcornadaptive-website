/**
 * Remote BB Claim Banner
 * Self-contained overlay banner for generated demo sites
 * Appears after 2 seconds, stays visible for 10 seconds, can be closed early
 */
(function() {
  'use strict';

  // Configuration
  var SHOW_DELAY_MS = 2000;
  var VISIBLE_DURATION_MS = 10000;
  var FADE_DURATION_MS = 300;
  var GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSey5nE3srAtm6FwXTk7NFndtbvxoAaLaiP6ZF6XHfwSJgXBcQ/formResponse';

  // Inject styles
  var styles = `
    .rbb-banner {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      font-size: 13px;
      line-height: 1.4;
      animation: rbb-fade-in 0.3s ease-out forwards;
    }

    .rbb-banner-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      background: rgba(24, 24, 27, 0.95);
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
      color: #fff;
      max-width: 240px;
    }

    .rbb-banner-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .rbb-banner-brand {
      font-weight: 600;
      color: #a1a1aa;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .rbb-banner-cta {
      color: #e4e4e7;
      font-size: 13px;
    }

    .rbb-banner-link {
      display: inline-block;
      margin-top: 6px;
      padding: 6px 12px;
      background: #3b82f6;
      color: #fff;
      text-decoration: none;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .rbb-banner-link:hover {
      background: #2563eb;
    }

    /* Modal styles */
    .rbb-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      animation: rbb-modal-fade-in 0.3s ease-out forwards;
    }

    .rbb-modal-overlay.rbb-modal-closing {
      animation: rbb-modal-fade-out 0.3s ease-in forwards;
    }

    .rbb-modal {
      position: relative;
      background: rgba(24, 24, 27, 0.95);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
      max-width: 400px;
      width: 100%;
      padding: 32px;
      color: #fff;
    }

    .rbb-modal-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: #71717a;
      cursor: pointer;
      padding: 0;
      font-size: 24px;
      line-height: 1;
      transition: color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rbb-modal-close:hover {
      color: #fff;
    }

    .rbb-modal h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
    }

    .rbb-modal p {
      margin: 0 0 24px 0;
      color: #a1a1aa;
      font-size: 14px;
    }

    .rbb-claim-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .rbb-claim-form input[type="text"],
    .rbb-claim-form input[type="email"] {
      width: 100%;
      padding: 12px 16px;
      background: rgba(39, 39, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s ease, background 0.2s ease;
      box-sizing: border-box;
    }

    .rbb-claim-form input:focus {
      outline: none;
      border-color: #3b82f6;
      background: rgba(39, 39, 42, 0.8);
    }

    .rbb-claim-form input::placeholder {
      color: #71717a;
    }

    .rbb-claim-form button[type="submit"] {
      padding: 12px 24px;
      background: #3b82f6;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .rbb-claim-form button[type="submit"]:hover {
      background: #2563eb;
    }

    .rbb-claim-form button[type="submit"]:disabled {
      background: #52525b;
      cursor: not-allowed;
    }

    .rbb-modal-success-view {
      text-align: center;
    }

    .rbb-success-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      background: #22c55e;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      color: #fff;
      animation: rbb-success-scale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .rbb-modal-success-view h2 {
      margin-bottom: 12px;
    }

    .rbb-modal-success-view p {
      margin-bottom: 0;
    }

    @keyframes rbb-modal-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes rbb-modal-fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    @keyframes rbb-success-scale {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @media (max-width: 480px) {
      .rbb-modal {
        padding: 24px;
      }

      .rbb-modal h2 {
        font-size: 20px;
      }
    }

    .rbb-banner-close {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      border: none;
      background: transparent;
      color: #71717a;
      cursor: pointer;
      padding: 0;
      font-size: 14px;
      line-height: 1;
      transition: color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rbb-banner-close:hover {
      color: #fff;
    }

    .rbb-banner.rbb-fade-out {
      animation: rbb-fade-out 0.3s ease-in forwards;
    }

    @keyframes rbb-fade-in {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes rbb-fade-out {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }

    @media (max-width: 480px) {
      .rbb-banner {
        top: 10px;
        right: 10px;
        left: 10px;
      }

      .rbb-banner-card {
        max-width: none;
      }
    }
  `;

  // Create and inject stylesheet
  var styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Create banner HTML
  var banner = document.createElement('div');
  banner.className = 'rbb-banner';
  banner.innerHTML = `
    <div class="rbb-banner-card">
      <div class="rbb-banner-content">
        <span class="rbb-banner-brand">Demo by Remote BB</span>
        <span class="rbb-banner-cta">Own this business?</span>
        <button class="rbb-banner-link rbb-claim-btn">Claim Page &rarr;</button>
      </div>
      <button class="rbb-banner-close" aria-label="Dismiss">&times;</button>
    </div>
  `;

  // Create modal HTML
  var modalOverlay = document.createElement('div');
  modalOverlay.className = 'rbb-modal-overlay';
  modalOverlay.style.display = 'none';
  modalOverlay.innerHTML = `
    <div class="rbb-modal">
      <button class="rbb-modal-close" aria-label="Close">&times;</button>
      <div class="rbb-modal-form-view">
        <h2>Claim Your Website</h2>
        <p>Enter your details to claim this demo page</p>
        <form class="rbb-claim-form">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <input type="hidden" name="subdomain" />
          <button type="submit">Submit Claim</button>
        </form>
      </div>
      <div class="rbb-modal-success-view" style="display: none;">
        <div class="rbb-success-icon">✓</div>
        <h2>Success!</h2>
        <p>We'll be in touch soon.</p>
      </div>
    </div>
  `;

  // Hidden iframe for form submission
  var iframe = document.createElement('iframe');
  iframe.name = 'rbb-form-target';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // Dismiss function
  var dismissTimer = null;

  function dismissBanner() {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    banner.classList.add('rbb-fade-out');
    setTimeout(function() {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, FADE_DURATION_MS);
  }

  // Modal functions
  function openModal() {
    // Auto-detect subdomain
    var subdomain = window.location.hostname.split('.')[0];
    var subdomainInput = modalOverlay.querySelector('input[name="subdomain"]');
    subdomainInput.value = subdomain;

    // Show modal
    modalOverlay.style.display = 'flex';
    document.body.appendChild(modalOverlay);

    // Focus on name input
    setTimeout(function() {
      var nameInput = modalOverlay.querySelector('input[name="name"]');
      if (nameInput) nameInput.focus();
    }, 100);
  }

  function closeModal() {
    modalOverlay.classList.add('rbb-modal-closing');
    setTimeout(function() {
      modalOverlay.style.display = 'none';
      modalOverlay.classList.remove('rbb-modal-closing');
      if (modalOverlay.parentNode) {
        modalOverlay.parentNode.removeChild(modalOverlay);
      }
      // Reset form for next use
      resetModalForm();
    }, 300);
  }

  function resetModalForm() {
    var formView = modalOverlay.querySelector('.rbb-modal-form-view');
    var successView = modalOverlay.querySelector('.rbb-modal-success-view');
    var form = modalOverlay.querySelector('.rbb-claim-form');

    formView.style.display = 'block';
    successView.style.display = 'none';
    form.reset();

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
  }

  function showSuccessView() {
    var formView = modalOverlay.querySelector('.rbb-modal-form-view');
    var successView = modalOverlay.querySelector('.rbb-modal-success-view');

    formView.style.display = 'none';
    successView.style.display = 'block';

    // Auto-close modal after 1 second
    setTimeout(closeModal, 1000);
  }

  // Banner close button handler
  var closeBtn = banner.querySelector('.rbb-banner-close');
  closeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    dismissBanner();
  });

  // Claim button handler
  var claimBtn = banner.querySelector('.rbb-claim-btn');
  claimBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openModal();
  });

  // Modal close button handler
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  var modalCloseBtn = modalOverlay.querySelector('.rbb-modal-close');
  modalCloseBtn.addEventListener('click', function(e) {
    e.preventDefault();
    closeModal();
  });

  // Escape key handler
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.style.display !== 'none') {
      closeModal();
    }
  });

  // Form submission handler
  var form = modalOverlay.querySelector('.rbb-claim-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    // Get form values
    var name = form.querySelector('input[name="name"]').value;
    var email = form.querySelector('input[name="email"]').value;
    var subdomain = form.querySelector('input[name="subdomain"]').value;

    // Create form data for Google Form
    var formData = new FormData();
    formData.append('entry.427014023', subdomain);
    formData.append('entry.652671038', name);
    formData.append('entry.1736364320', email);

    // Submit to Google Form via hidden iframe
    var tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = GOOGLE_FORM_URL;
    tempForm.target = 'rbb-form-target';
    tempForm.style.display = 'none';

    formData.forEach(function(value, key) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      tempForm.appendChild(input);
    });

    document.body.appendChild(tempForm);
    tempForm.submit();
    document.body.removeChild(tempForm);

    // Show success view
    showSuccessView();
  });

  // Insert banner into page
  function showBanner() {
    document.body.appendChild(banner);

    // Start auto-dismiss timer (banner stays visible for VISIBLE_DURATION_MS)
    dismissTimer = setTimeout(dismissBanner, VISIBLE_DURATION_MS);
  }

  // Initialize when DOM is ready, then delay before showing
  function init() {
    setTimeout(showBanner, SHOW_DELAY_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
