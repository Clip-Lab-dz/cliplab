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
    padding: "6px 10px",
    fontSize: "13px",
    borderRadius: "8px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    zIndex: 9999,
    opacity: "0",
    transition: "opacity .2s ease, transform .25s ease"
  });

  const wrapper = element.parentElement;
  wrapper.style.position = wrapper.style.position || "relative";
  wrapper.appendChild(t);

  requestAnimationFrame(() => {
    t.style.opacity = "1";
    t.style.transform = "translateX(-50%) scale(1.05)";
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
    targetX = (e.clientX / innerWidth - 0.5) * 60;
    targetY = (e.clientY / innerHeight - 0.5) * 60;
  });

  function animate() {
    x += (targetX - x) * 0.08;
    y += (targetY - y) * 0.08;
    particles.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    requestAnimationFrame(animate);
  }

  animate();
}
