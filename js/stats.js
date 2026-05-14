const statsContainer =
  document.getElementById("statsContainer");

/* =========================
   OBTENER BADGES
========================= */

const badges =
  JSON.parse(
    localStorage.getItem("badges")
  ) || [];

/* =========================
   TOTAL
========================= */

const totalBadges = badges.length;

/* =========================
   HOY
========================= */

const hoy =
  new Date().toLocaleDateString();

let badgesHoy = 0;

badges.forEach(function(badge){

  if(badge.fecha == hoy){

    badgesHoy++;

  }

});

/* =========================
   ÚLTIMO REGISTRO
========================= */

let ultimoRegistro =
  "Sin registros";

if(totalBadges > 0){

  ultimoRegistro =
    badges[badges.length - 1].fecha;

}

/* =========================
   PROMEDIO
========================= */

const promedioDiario =
  totalBadges > 0
  ? (totalBadges / 7).toFixed(1)
  : 0;

/* =========================
   RENDER DASHBOARD
========================= */

statsContainer.innerHTML = `

<div class="dashboard-grid">

  <div class="stat-card">

    <div class="stat-icon">🎖️</div>

    <div class="stat-number">
      ${totalBadges}
    </div>

    <div class="stat-label">
      Total badges
    </div>

  </div>

  <div class="stat-card">

    <div class="stat-icon">📅</div>

    <div class="stat-number">
      ${badgesHoy}
    </div>

    <div class="stat-label">
      Generados hoy
    </div>

  </div>

  <div class="stat-card">

    <div class="stat-icon">🕒</div>

    <div class="stat-number small">
      ${ultimoRegistro}
    </div>

    <div class="stat-label">
      Último registro
    </div>

  </div>

  <div class="stat-card">

    <div class="stat-icon">📈</div>

    <div class="stat-number">
      ${promedioDiario}
    </div>

    <div class="stat-label">
      Promedio semanal
    </div>

  </div>

</div>

`;

/* =========================
   AGRUPAR DATOS
========================= */

const badgesPorDia = {};

badges.forEach(function(badge){

  if(badgesPorDia[badge.fecha]){

    badgesPorDia[badge.fecha]++;

  }else{

    badgesPorDia[badge.fecha] = 1;

  }

});

/* =========================
   CHART
========================= */

const labels =
  Object.keys(badgesPorDia);

const data =
  Object.values(badgesPorDia);

const ctx =
  document
    .getElementById("badgesChart");

new Chart(ctx, {

  type: "bar",

  data: {

    labels: labels,

    datasets: [{

      label: "Badges generados",

      data: data,

      backgroundColor: [
        "#4B2E83",
        "#6B46C1",
        "#7C3AED",
        "#8B5CF6",
        "#A78BFA"
      ],

      borderRadius: 14

    }]

  },

  options: {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        display: false

      },

      title: {

        display: true,

        text:
          "Badges generados por día",

        color:"#4B2E83",

        font:{

          size:20,

          weight:"bold"

        }

      }

    },

    scales: {

      y: {

        beginAtZero: true,

        ticks:{

          stepSize:1

        }

      }

    }

  }

});