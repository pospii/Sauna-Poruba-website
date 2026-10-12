// Souhlas s cookies: Google Analytics a Meta Pixel se načtou až po kliknutí na "Přijmout".
(function () {
  const GA_ID = "G-FMHCM3VWJE";
  const PIXEL_ID = "1589270576235242";
  // Nový klíč: dřívější souhlas se týkal jen GA, ne Meta Pixelu.
  const STORAGE_KEY = "cookieConsent2";
  let trackingLoaded = false;

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function loadTracking() {
    if (trackingLoaded) return;
    trackingLoaded = true;

    // Google Analytics (GA4)
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);

    // Meta Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  // Při odvolání souhlasu smaže cookies GA a Meta Pixelu z naší domény.
  function clearTrackingCookies() {
    const host = location.hostname;
    const domains = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (!/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)) return;
      domains.forEach((d) => {
        document.cookie =
          name +
          "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
          (d ? "; domain=" + d : "");
      });
    });
  }

  function buildBanner() {
    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Souhlas s cookies");
    banner.setAttribute("aria-hidden", "true");
    banner.innerHTML =
      "<p>Rádi bychom používali cookies <strong>Google Analytics</strong> " +
      "(měření návštěvnosti) a <strong>Meta Pixel</strong> (měření reklam " +
      "na Facebooku a Instagramu). Spustí se jen s vaším souhlasem, který " +
      "můžete kdykoliv změnit v patičce webu. " +
      '<a href="/ochrana-osobnich-udaju.html#cookies">Více informací</a></p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-btn primary" data-consent="accepted">Přijmout</button>' +
      '<button type="button" class="cookie-btn secondary" data-consent="declined">Odmítnout</button>' +
      "</div>";
    document.body.appendChild(banner);

    banner.querySelectorAll("[data-consent]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.dataset.consent;
        const wasAccepted = getConsent() === "accepted";
        setConsent(value);
        hideBanner(banner);
        if (value === "accepted") {
          loadTracking();
        } else if (wasAccepted) {
          clearTrackingCookies();
          // Už načtené měřicí skripty zastaví až nové načtení stránky.
          location.reload();
        }
      });
    });

    return banner;
  }

  function showBanner(banner) {
    banner.classList.add("visible");
    banner.setAttribute("aria-hidden", "false");
  }

  function hideBanner(banner) {
    banner.classList.remove("visible");
    banner.setAttribute("aria-hidden", "true");
  }

  if (getConsent() === "accepted") loadTracking();

  function init() {
    const banner = buildBanner();
    if (!getConsent()) {
      setTimeout(() => showBanner(banner), 1800);
    }
    document.querySelectorAll("[data-cookie-settings]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        showBanner(banner);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
