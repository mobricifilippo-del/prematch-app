/* app.js — test minimale senza dipendenze */

(function () {
  // Mostra errori JS direttamente in pagina (utile da mobile)
  window.onerror = function (msg, src, line, col, err) {
    const box = document.createElement("div");
    box.style.cssText = "position:fixed;left:0;right:0;bottom:0;background:#ff3b30;color:#fff;padding:12px;font-weight:700;z-index:9999";
    box.textContent = "Errore: " + msg + (line ? (" (riga " + line + ")") : "");
    document.body.appendChild(box);
  };

  // Segnale di vita: se vedi questo, app.js è stato caricato
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = `
      <div style="min-height:60vh;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;text-align:center">
        <div style="font-size:28px;font-weight:800;margin-bottom:8px;">PreMatch è attivo ✅</div>
        <div style="opacity:.8">Se vedi questo messaggio, <code>app.js</code> sta girando correttamente.</div>
      </div>
    `;
  } else {
    // Se #app non esiste, lo segnaliamo
    const warn = document.createElement("div");
    warn.style.cssText = "color:#fff;padding:20px";
    warn.textContent = "Attenzione: non trovo l'elemento #app dentro index.html";
    document.body.appendChild(warn);
  }
})();
