// Fonction de partage améliorée
function initShare() {
  const shareBtn = document.getElementById('share-btn');
  
  if (shareBtn) {
    shareBtn.addEventListener('click', async function() {
      const shareData = {
        title: 'Clip Lab - Création de contenu',
        text: 'Découvrez Clip Lab, là où vos idées prennent vie et vos rêves deviennent réalité ✨',
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Fallback pour les navigateurs sans support de share
          await navigator.clipboard.writeText(window.location.href);
          showShareToast('Lien copié dans le presse-papier !');
        }
      } catch (err) {
        console.log('Partage annulé ou erreur:', err);
        // Fallback manuel
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showShareToast('Lien copié !');
      }
    });
  }
}

function showShareToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 14px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: toastSlide 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

// Ajouter les animations CSS pour le toast
const style = document.createElement('style');
style.textContent = `
  @keyframes toastSlide {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes toastSlideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', initShare);
