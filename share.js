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
      alert("Lien copié ! Vous pouvez le partager où vous voulez.");
    } catch {
      prompt("Copie manuelle :", window.location.href);
    }
  }
});
