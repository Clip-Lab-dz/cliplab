// --- COPIE AVEC TOAST ---
async function copyToClipboard(text) {
  if (!text) return false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard failed:", err);
    }
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
}

function showToastAt(element, message = "Lien copié !") {
  const existing = element.parentElement.querySelector(".copy-toast");
  if (existing) existing.remove();

  const t = document.createElement("div");
  t.className = "copy-toast";
  t.textContent = message;

  Object.assign(t.style, {
    position: "absolute",
    bottom: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%) scale(0.9)",
    padding: "8px 12px",
    fontSize: "13px",
    borderRadius: "8px",
    background: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    zIndex: "9999",
    opacity: "0",
    transition: "opacity .2s ease, transform .25s ease",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  });

  const wrapper = element.parentElement;
  wrapper.style.position = "relative";
  wrapper.appendChild(t);

  requestAnimationFrame(() => {
    t.style.opacity = "1";
    t.style.transform = "translateX(-50%) scale(1)";
  });

  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(-50%) scale(0.9)";
    setTimeout(() => t.remove(), 250);
  }, 1400);
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest && e.target.closest(".copy-icon");
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();

  const dataLink = btn.getAttribute("data-link");
  let link = dataLink && dataLink.trim();
  if (!link) {
    const wrapper = btn.closest(".link");
    if (wrapper) {
      const a = wrapper.querySelector("a[href]");
      if (a) link = a.href;
    }
  }

  if (!link) {
    showToastAt(btn, "Aucun lien à copier");
    return;
  }

  const ok = await copyToClipboard(link);
  if (ok) {
    showToastAt(btn, "Lien copié !");
  } else {
    showToastAt(btn, "Échec — copie manuelle");
    prompt("Copiez ce lien :", link);
  }
});

// --- GALAXIE ANIMÉE PARALLAXE ---
const particles = document.querySelector(".particles");
if (particles) {
  let x = 0, y = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener("mousemove", (e) => {
    const { innerWidth, innerHeight } = window;
    targetX = (e.clientX / innerWidth - 0.5) * 40;
    targetY = (e.clientY / innerHeight - 0.5) * 40;
  });

  function animate() {
    x += (targetX - x) * 0.05;
    y += (targetY - y) * 0.05;
    particles.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}

// --- PARTAGE ---
document.getElementById("share-btn").addEventListener("click", async () => {
  const shareData = {
    title: "Clip Lab",
    text: "Découvre Clip Lab — là où les idées prennent vie 💡",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      console.log("Page partagée avec succès !");
    } catch (err) {
      console.warn("Partage annulé ou échoué :", err);
    }
  } else {
    // Fallback : copier le lien
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToastAt(document.getElementById("share-btn"), "Lien copié !");
    } catch {
      prompt("Copie manuelle :", window.location.href);
    }
  }
});

// Support tactile pour mobile
document.addEventListener('touchstart', function() {}, { passive: true });
