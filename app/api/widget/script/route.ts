import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  const widgetScript = `
(function() {
  'use strict';

  class WaitlistWidget {
    constructor(containerId, waitlistSlug) {
      this.containerId = containerId;
      this.waitlistSlug = waitlistSlug;
      this.config = null;
      this.container = null;
      this.isSubmitting = false;
      this.currentState = 'form'; // 'form' or 'success'

      // Get the current script's URL to determine the API base URL
      const scriptElement = document.currentScript || document.querySelector('script[src*="widget/script"]');
      const scriptUrl = scriptElement?.src || '';
      this.baseUrl = scriptUrl.split('/api/')[0] || window.location.origin;
    }

    async init() {
      this.container = document.getElementById(this.containerId);
      if (!this.container) {
        console.error('Waitlist widget container not found:', this.containerId);
        return;
      }

      try {
        await this.loadConfig();
        this.render();
      } catch (error) {
        console.error('Failed to initialize waitlist widget:', error);
        this.renderError();
      }
    }

    async loadConfig() {
      const response = await fetch(\`\${this.baseUrl}/api/widget/\${this.waitlistSlug}/config\`);
      if (!response.ok) {
        throw new Error('Failed to load widget configuration');
      }
      this.config = await response.json();
    }

    render() {
      if (this.currentState === 'success') {
        this.renderSuccess();
      } else {
        this.renderForm();
      }
    }

    renderForm() {
      const { customization, waitlist } = this.config;

      const cardStyle = \`
        max-width: \${customization.formWidth}px;
        border-radius: \${customization.borderRadius}px;
        box-shadow: 0 \${customization.shadowIntensity * 2}px \${customization.shadowIntensity * 8}px rgba(0,0,0,\${customization.shadowIntensity * 0.1});
        font-size: \${customization.fontSize}px;
        color: \${customization.textColor};
        background-color: \${customization.backgroundColor};
        padding: \${customization.padding}px;
        border: 1px solid #e5e7eb;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0 auto;
      \`;

      this.container.innerHTML = \`
        <div style="\${cardStyle}">
          <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div style="
                width: 40px;
                height: 40px;
                border-radius: \${customization.borderRadius * 0.6}px;
                background-color: \${customization.buttonColor}20;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="20" height="20" fill="\${customization.buttonColor}" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div>
                <h3 style="
                  margin: 0;
                  font-size: 18px;
                  font-weight: 600;
                  color: \${customization.textColor};
                ">
                  \${customization.headerText || waitlist.name}
                </h3>
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  font-size: 14px;
                  color: #6b7280;
                  margin-top: 4px;
                ">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7h2l1.5-1.5L11 8.5H7V11H4c-1.1 0-2 .9-2 2v5h2zm14.5-13c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5S17 16.33 17 15.5v-9c0-.83.67-1.5 1.5-1.5zM12.5 11H15v8.5c0 .83-.67 1.5-1.5 1.5S12 20.33 12 19.5V11h.5z"/>
                  </svg>
                  <span>\${waitlist.signupCount.toLocaleString()} joined</span>
                </div>
              </div>
            </div>
            \${customization.descriptionText ? \`
              <p style="
                margin: 0;
                font-size: 14px;
                color: \${customization.textColor};
                opacity: 0.8;
              ">
                \${customization.descriptionText}
              </p>
            \` : ''}
          </div>

          <form id="waitlist-form-\${this.waitlistSlug}" style="margin-bottom: 16px;">
            <div style="margin-bottom: 16px;">
              <label style="
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: \${customization.textColor};
              ">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="\${customization.placeholderText}"
                required
                style="
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #d1d5db;
                  border-radius: \${customization.borderRadius * 0.5}px;
                  font-size: \${customization.fontSize * 0.9}px;
                  box-sizing: border-box;
                  font-family: inherit;
                "
              />
            </div>

            <div style="margin-bottom: 16px;">
              <label style="
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: \${customization.textColor};
              ">
                Name <span style="color: #6b7280; font-size: 12px;">(Optional)</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                style="
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #d1d5db;
                  border-radius: \${customization.borderRadius * 0.5}px;
                  font-size: \${customization.fontSize * 0.9}px;
                  box-sizing: border-box;
                  font-family: inherit;
                "
              />
            </div>

            <button
              type="submit"
              id="submit-btn-\${this.waitlistSlug}"
              style="
                width: 100%;
                padding: 12px 16px;
                background-color: \${customization.buttonColor};
                color: \${customization.buttonTextColor};
                border: none;
                border-radius: \${customization.borderRadius * 0.5}px;
                font-size: \${customization.fontSize * 0.9}px;
                font-weight: 500;
                cursor: pointer;
                font-family: inherit;
                transition: all 0.2s;
              "
              onmouseover="this.style.opacity='0.9'"
              onmouseout="this.style.opacity='1'"
            >
              \${customization.buttonText}
            </button>
          </form>

          \${customization.includeLeaderboard ? \`
            <div style="text-align: center; margin-bottom: 16px;">
              <span style="
                background-color: #f3f4f6;
                color: #374151;
                padding: 4px 12px;
                border-radius: \${customization.borderRadius * 0.3}px;
                font-size: 12px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
              ">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v4h8V3h-8z"/>
                </svg>
                See your position after joining
              </span>
            </div>
          \` : ''}

          <div style="text-align: center; margin-bottom: 16px;">
            <p style="
              margin: 0;
              font-size: \${customization.fontSize * 0.75}px;
              color: #6b7280;
            ">
              By joining, you agree to receive updates about the launch.
            </p>
          </div>

          \${customization.includeBrandBadge ? \`
            <div style="text-align: center;">
              <span style="
                background-color: transparent;
                color: #6b7280;
                border: 1px solid #d1d5db;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 10px;
              ">
                Powered by Waitlist
              </span>
            </div>
          \` : ''}
        </div>
      \`;

      this.attachEventListeners();
    }

    renderSuccess(result = {}) {
      const { customization } = this.config;

      const cardStyle = \`
        max-width: \${customization.formWidth}px;
        border-radius: \${customization.borderRadius}px;
        box-shadow: 0 \${customization.shadowIntensity * 2}px \${customization.shadowIntensity * 8}px rgba(0,0,0,\${customization.shadowIntensity * 0.1});
        font-size: \${customization.fontSize}px;
        color: \${customization.textColor};
        background-color: #f0fdf4;
        padding: \${customization.padding}px;
        border: 1px solid #bbf7d0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0 auto;
      \`;

      this.container.innerHTML = \`
        <div style="\${cardStyle}">
          <div style="text-align: center;">
            <div style="
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background-color: \${customization.buttonColor}20;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 16px;
            ">
              <svg width="32" height="32" fill="\${customization.buttonColor}" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 style="margin: 0 0 8px; font-size: 20px; font-weight: 600; color: #14532d;">
              Welcome aboard!
            </h3>
            <p style="margin: 0 0 16px; color: #15803d;">
              \${result.message || "You've been added to the waitlist!"}
            </p>

            \${result.position && customization.includeLeaderboard ? \`
              <div style="
                background-color: \${customization.buttonColor};
                color: \${customization.buttonTextColor};
                padding: 8px 16px;
                border-radius: \${customization.borderRadius}px;
                font-size: 14px;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                margin-bottom: 16px;
              ">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4H15V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4H20C21.1 4 22 4.9 22 6V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V6C2 4.9 2.9 4 4 4H7ZM4 8V20H20V8H4ZM12 17L8.5 13.5L10 12L12 14L16 10L17.5 11.5L12 17Z"/>
                </svg>
                #\${result.position} on the waitlist
              </div>
            \` : ''}

            \${customization.includeBrandBadge ? \`
              <div style="margin-top: 16px;">
                <span style="
                  background-color: transparent;
                  color: #6b7280;
                  border: 1px solid #d1d5db;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 10px;
                ">
                  Powered by Waitlist
                </span>
              </div>
            \` : ''}
          </div>
        </div>
      \`;

      // Reset to form after 5 seconds
      setTimeout(() => {
        this.currentState = 'form';
        this.render();
      }, 5000);
    }

    renderError() {
      this.container.innerHTML = \`
        <div style="
          padding: 20px;
          border: 1px solid #fecaca;
          background-color: #fef2f2;
          border-radius: 8px;
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <p style="margin: 0; color: #dc2626;">
            Failed to load waitlist. Please try again later.
          </p>
        </div>
      \`;
    }

    attachEventListeners() {
      const form = document.getElementById(\`waitlist-form-\${this.waitlistSlug}\`);
      const submitBtn = document.getElementById(\`submit-btn-\${this.waitlistSlug}\`);

      if (form && submitBtn) {
        form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    }

    async handleSubmit(e) {
      e.preventDefault();

      if (this.isSubmitting) return;

      const form = e.target;
      const formData = new FormData(form);
      const submitBtn = document.getElementById(\`submit-btn-\${this.waitlistSlug}\`);

      this.isSubmitting = true;

      // Update button state
      if (submitBtn) {
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.innerHTML = 'Joining...';
      }

      try {
        const response = await fetch(\`\${this.baseUrl}/api/waitlist/\${this.waitlistSlug}/signup\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.get('email'),
            name: formData.get('name') || undefined,
          }),
        });

        const result = await response.json();

        if (result.success) {
          this.currentState = 'success';
          this.render();
          this.renderSuccess(result);
        } else {
          throw new Error(result.message || 'Signup failed');
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert(error.message || 'An error occurred. Please try again.');

        // Reset button state
        if (submitBtn) {
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
          submitBtn.innerHTML = this.config.customization.buttonText;
        }
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  // Auto-initialize widgets
  document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('[data-waitlist-slug]');
    containers.forEach(container => {
      const slug = container.getAttribute('data-waitlist-slug');
      if (slug) {
        const widget = new WaitlistWidget(container.id, slug);
        widget.init();
      }
    });
  });

  // Export for manual initialization
  window.WaitlistWidget = WaitlistWidget;
})();
`;

  return new NextResponse(widgetScript, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
