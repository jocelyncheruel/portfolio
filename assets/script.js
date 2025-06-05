const nav = document.querySelector("nav");
let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
let isNavVisible = true;
let hideTimeout = null;

if (localStorage.getItem("navVisible") === "false" && lastScrollTop > 0) {
  nav.classList.add("hidden");
  nav.style.display = "none";
  isNavVisible = false;
} else {
  nav.style.display = "flex";
  nav.classList.remove("hidden");
  isNavVisible = true;
  localStorage.setItem("navVisible", "true");
}

window.addEventListener("scroll", function () {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 50) {
    if (isNavVisible) {
      nav.classList.add("hidden");

      if (hideTimeout) clearTimeout(hideTimeout);

      hideTimeout = setTimeout(() => {
        if (!isNavVisible) {
          nav.style.display = "none";
        }
      }, 300);

      localStorage.setItem("navVisible", "false");
      isNavVisible = false;
    }
  } else if (scrollTop < lastScrollTop || scrollTop < 50) {
    if (!isNavVisible) {
      if (hideTimeout) clearTimeout(hideTimeout);

      nav.style.display = "flex";
      requestAnimationFrame(() => {
        nav.classList.remove("hidden");
      });

      localStorage.setItem("navVisible", "true");
      isNavVisible = true;
    }
  }

  lastScrollTop = scrollTop;
});

document.getElementById("cv-link").addEventListener("click", function(event) {
  event.preventDefault();

  const url = document.getElementById("download-cv").getAttribute("href");

  pdfjsLib.getDocument(url).promise.then(function (pdf) {
    pdf.getPage(1).then(function (page) {
      const scale = 5;
      const viewport = page.getViewport({ scale: scale });
      const canvas = document.getElementById('pdf-canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });

      page.render({
        canvasContext: context,
        viewport: viewport
      });
    });
  });

  document.getElementById("cv-modal").style.display = "flex";
  document.body.classList.add("no-scroll");
});

document.getElementById("close").addEventListener("click", function() {
  document.getElementById("cv-modal").style.display = "none";
  document.body.classList.remove("no-scroll");
});

window.addEventListener("click", function(event) {
  let modal = document.getElementById("cv-modal");
  if (event.target === modal) {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
  }
});

const preuves = document.querySelectorAll(".preuve");
const commentaires = document.querySelectorAll(".preuve-commentaire");
const zoomOverlay = document.getElementById("zoomOverlay");
const zoomedImage = document.getElementById("zoomedImage");
let currentIndex = 0;

function updatePreuve(index) {
    preuves.forEach((preuve, i) => {
        preuve.classList.toggle("active", i === index);
    });

    commentaires.forEach((commentaire, i) => {
        commentaire.classList.toggle("active", i === index);
    });

    const activeImg = preuves[index].querySelector("img");
    if (zoomedImage && activeImg) {
        zoomedImage.src = activeImg.src;
    }
}

document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % preuves.length;
    updatePreuve(currentIndex);
});

document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + preuves.length) % preuves.length;
    updatePreuve(currentIndex);
});

preuves.forEach((preuve, index) => {
    const img = preuve.querySelector("img");
    if (img) {
        img.addEventListener("click", () => {
            currentIndex = index;
            showZoom(currentIndex);
        });
    }
});

function showZoom(index) {
    const activeImg = preuves[index].querySelector("img");
    if (activeImg) {
        zoomedImage.src = activeImg.src;
        zoomOverlay.classList.add("active");
    }
}

const zoomNextBtn = document.getElementById("zoomNext");
if (zoomNextBtn) {
    zoomNextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % preuves.length;
        showZoom(currentIndex);
        updatePreuve(currentIndex);
    });
}

const zoomPrevBtn = document.getElementById("zoomPrev");
if (zoomPrevBtn) {
    zoomPrevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + preuves.length) % preuves.length;
        showZoom(currentIndex);
        updatePreuve(currentIndex);
    });
}

if (zoomOverlay) {
    zoomOverlay.addEventListener("click", (e) => {
        if (e.target === zoomOverlay || e.target === zoomedImage) {
            zoomOverlay.classList.remove("active");
        }
    });
}

updatePreuve(currentIndex);