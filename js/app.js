const nombreInput = document.getElementById("nombreInput");
const nombrePreview = document.getElementById("previewNombre");

const fotoInput = document.getElementById("fotoInput");
const fotoPreview = document.getElementById("previewFoto");

const boton = document.getElementById("btnDescargar");

const btnCopy = document.getElementById("btnCopy");
const btnLinkedin = document.getElementById("btnLinkedin");

const loader = document.getElementById("loader");

let imagenUsuario = null;

/* =========================
   ANALYTICS
========================= */

let badges = JSON.parse(
  localStorage.getItem("badges")
) || [];

/* =========================
   EVENTOS
========================= */

btnCopy.addEventListener("click", copiarTexto);

btnLinkedin.addEventListener("click", abrirLinkedin);

boton.addEventListener("click", descargar);

/* =========================
   TOAST
========================= */

function mostrarToast(mensaje, color = "#1f2937"){

  const toast = document.getElementById("toast");

  toast.textContent = mensaje;

  toast.style.background = color;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

}

/* =========================
   GOOGLE SHEETS
========================= */

function guardarEnSheets(nombre){

  fetch(
    "https://script.google.com/macros/s/AKfycbzTiWaPdrbu6gNyqPFAEVQa_VWG5H066GBtevuJYOKIPC_rNlJMvNAzjPgwlZn3Il8Z0g/exec",
    {
      method:"POST",
      mode:"no-cors",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        nombre:nombre,
        fecha:new Date().toISOString()
      })
    }
  );

}

/* =========================
   PREVIEW NOMBRE
========================= */

nombreInput.addEventListener("input", function(){

  nombrePreview.textContent =
    this.value.toUpperCase();

});

/* =========================
   FOTO
========================= */

fotoInput.addEventListener("change", function(e){

  const archivo = e.target.files[0];

  if(!archivo) return;

  /* VALIDAR TIPO */
  if(!archivo.type.startsWith("image/")){

    mostrarToast(
      "Solo puedes subir imágenes",
      "#dc2626"
    );

    return;
  }

  /* VALIDAR PESO */
  if(archivo.size > 3000000){

    mostrarToast(
      "La imagen supera los 3MB",
      "#dc2626"
    );

    return;
  }

  const reader = new FileReader();

  reader.onload = function(event){

    imagenUsuario = new Image();

    imagenUsuario.src = event.target.result;

    fotoPreview.src = event.target.result;

    fotoPreview.style.display = "block";

    mostrarToast(
      "Foto cargada correctamente ✔",
      "#16a34a"
    );

  };

  reader.readAsDataURL(archivo);

});

/* =========================
   DESCARGAR BADGE
========================= */

function descargar(){

  const nombre = nombreInput.value.trim();

  /* VALIDAR NOMBRE */
  if(nombre === ""){

    mostrarToast(
      "Ingresa tu nombre",
      "#dc2626"
    );

    return;
  }

  /* VALIDAR FOTO */
  if(!imagenUsuario){

    mostrarToast(
      "Debes subir una foto",
      "#dc2626"
    );

    return;
  }

  /* LOADER */
  loader.style.display = "block";

  guardarEnSheets(nombre);

  /* =========================
     GUARDAR ANALYTICS
  ========================= */

  badges.push({

    fecha: new Date().toLocaleDateString(),

    timestamp: Date.now()

  });

  localStorage.setItem(

    "badges",

    JSON.stringify(badges)

  );

  const baseImg = new Image();

  baseImg.src = "credencial_base.png";

  baseImg.onload = function(){

    const canvas = document.createElement("canvas");

    canvas.width = 1080;
    canvas.height = 1350;

    const ctx = canvas.getContext("2d");

    /* FONDO */
    ctx.drawImage(baseImg,0,0);

    /* FOTO COVER + BORDES REDONDEADOS */

    const destinoX = 300;
    const destinoY = 400;

    const destinoW = 420;
    const destinoH = 420;

    const radio = 60;

    const imgW = imagenUsuario.width;
    const imgH = imagenUsuario.height;

    /* ESCALA COVER */
    const escala = Math.max(
      destinoW / imgW,
      destinoH / imgH
    );

    const nuevoW = imgW * escala;
    const nuevoH = imgH * escala;

    /* CENTRAR */
    const offsetX =
      (destinoW - nuevoW) / 2;

    const offsetY =
      (destinoH - nuevoH) / 2;

    /* RECORTE REDONDEADO */
    ctx.save();

    ctx.beginPath();

    ctx.moveTo(
      destinoX + radio,
      destinoY
    );

    ctx.lineTo(
      destinoX + destinoW - radio,
      destinoY
    );

    ctx.quadraticCurveTo(
      destinoX + destinoW,
      destinoY,
      destinoX + destinoW,
      destinoY + radio
    );

    ctx.lineTo(
      destinoX + destinoW,
      destinoY + destinoH - radio
    );

    ctx.quadraticCurveTo(
      destinoX + destinoW,
      destinoY + destinoH,
      destinoX + destinoW - radio,
      destinoY + destinoH
    );

    ctx.lineTo(
      destinoX + radio,
      destinoY + destinoH
    );

    ctx.quadraticCurveTo(
      destinoX,
      destinoY + destinoH,
      destinoX,
      destinoY + destinoH - radio
    );

    ctx.lineTo(
      destinoX,
      destinoY + radio
    );

    ctx.quadraticCurveTo(
      destinoX,
      destinoY,
      destinoX + radio,
      destinoY
    );

    ctx.closePath();

    ctx.clip();

    /* DIBUJAR IMAGEN */
    ctx.drawImage(
      imagenUsuario,
      destinoX + offsetX,
      destinoY + offsetY,
      nuevoW,
      nuevoH
    );

    ctx.restore();

    /* TEXTO */
    ctx.fillStyle = "#ffffff";

    ctx.font = "60px Solano, Arial";

    ctx.textAlign = "center";

    ctx.fillText(
      nombre.toUpperCase(),
      540,
      320
    );

    /* DESCARGA */
    const enlace = document.createElement("a");

    enlace.href = canvas.toDataURL("image/png");

    enlace.download =
      `badge-${nombre
        .toLowerCase()
        .replaceAll(" ","-")}.png`;

    enlace.click();

    /* OCULTAR LOADER */
    loader.style.display = "none";

    mostrarToast(
      "Badge generado correctamente ✔",
      "#16a34a"
    );

  };

}

/* =========================
   COPIAR TEXTO
========================= */

function copiarTexto(){

  const texto =
    document.getElementById("copyText")
    .innerText;

  navigator.clipboard
    .writeText(texto)
    .then(() => {

      mostrarToast(
        "Copy copiado ✔",
        "#2563eb"
      );

    });

}

/* =========================
   LINKEDIN
========================= */

function abrirLinkedin(){

  mostrarToast(
    "Abriendo LinkedIn...",
    "#0077b5"
  );

  window.open(
    "https://www.linkedin.com/feed/",
    "_blank"
  );

}