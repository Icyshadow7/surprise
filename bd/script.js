const $ = (selector, scope = document) =>
  scope.querySelector(selector);

const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];

/* =========================================
   START PAGE AT THE TOP
========================================= */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

/* =========================================
   STAR BACKGROUND
========================================= */

const starCanvas = $("#starCanvas");
const starContext = starCanvas
  ? starCanvas.getContext("2d")
  : null;

let stars = [];

function resizeStarCanvas() {
  if (!starCanvas || !starContext) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  starCanvas.width = window.innerWidth * dpr;
  starCanvas.height = window.innerHeight * dpr;

  starCanvas.style.width = `${window.innerWidth}px`;
  starCanvas.style.height = `${window.innerHeight}px`;

  starContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  stars = Array.from(
    {
      length: Math.min(
        150,
        Math.floor(window.innerWidth / 7)
      ),
    },
    () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.7 + 0.15,
      speed: Math.random() * 0.007 + 0.002,
    })
  );
}

function animateStars(time = 0) {
  if (!starCanvas || !starContext) return;

  starContext.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  stars.forEach((star, index) => {
    const alpha =
      star.opacity *
      (
        0.65 +
        Math.sin(
          time * star.speed + index
        ) *
          0.35
      );

    starContext.beginPath();

    starContext.fillStyle =
      `rgba(255, 230, 238, ${alpha})`;

    starContext.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    starContext.fill();
  });

  requestAnimationFrame(animateStars);
}

if (starCanvas && starContext) {
  resizeStarCanvas();
  animateStars();

  window.addEventListener(
    "resize",
    resizeStarCanvas
  );
}

/* =========================================
   CURSOR GLOW
========================================= */

const cursorGlow = $("#cursorGlow");

window.addEventListener(
  "pointermove",
  (event) => {
    if (!cursorGlow) return;

    cursorGlow.style.left =
      `${event.clientX}px`;

    cursorGlow.style.top =
      `${event.clientY}px`;
  }
);

/* =========================================
   REVEAL ELEMENTS WHILE SCROLLING
========================================= */

const revealObserver =
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            "visible"
          );
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

$$(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

/* =========================================
   OPEN SURPRISE BUTTON
========================================= */

const openSurprise = $("#openSurprise");

if (openSurprise) {
  openSurprise.addEventListener(
    "click",
    () => {
      document.body.classList.remove(
        "not-opened"
      );

      createPetals(35);

      requestAnimationFrame(() => {
        const birthdaySection =
          $("#birthday");

        if (birthdaySection) {
          birthdaySection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  );
}

/* =========================================
   MUSIC PLAYER
========================================= */

const musicButton = $("#musicButton");
const backgroundMusic = $("#bgMusic");
const musicLabel = $("#musicLabel");

if (
  musicButton &&
  backgroundMusic &&
  musicLabel
) {
  musicButton.addEventListener(
    "click",
    async () => {
      try {
        if (backgroundMusic.paused) {
          await backgroundMusic.play();

          musicButton.classList.add(
            "playing"
          );

          musicLabel.textContent =
            "Pause Our Song";
        } else {
          backgroundMusic.pause();

          musicButton.classList.remove(
            "playing"
          );

          musicLabel.textContent =
            "Play Our Song";
        }
      } catch (error) {
        musicLabel.textContent =
          "Add our-song.mp3";

        console.error(
          "Music could not be played:",
          error
        );
      }
    }
  );
}

/* =========================================
   BOUQUET PARALLAX
========================================= */

const bouquetWrap = $("#bouquetWrap");
const bouquetSvg = $(".realistic-bouquet");

if (bouquetWrap && bouquetSvg) {
  bouquetWrap.addEventListener(
    "pointermove",
    (event) => {
      if (window.innerWidth < 700) {
        return;
      }

      const rectangle =
        bouquetWrap.getBoundingClientRect();

      const pointerX =
        event.clientX - rectangle.left;

      const pointerY =
        event.clientY - rectangle.top;

      const rotateY =
        (
          pointerX / rectangle.width -
          0.5
        ) * 10;

      const rotateX =
        (
          pointerY / rectangle.height -
          0.5
        ) * -8;

      bouquetSvg.style.animation = "none";

      bouquetSvg.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-5px)
      `;
    }
  );

  bouquetWrap.addEventListener(
    "pointerleave",
    () => {
      bouquetSvg.style.transform = "";

      bouquetSvg.style.animation =
        "bouquetIdle 5s ease-in-out infinite";
    }
  );

  bouquetWrap.addEventListener(
    "click",
    () => {
      bouquetSvg.animate(
        [
          {
            transform: "scale(1)",
          },
          {
            transform: "scale(1.045)",
          },
          {
            transform: "scale(1)",
          },
        ],
        {
          duration: 650,
          easing: "ease-out",
        }
      );

      createBouquetSparkles(18);
    }
  );
}

/* =========================================
   BOUQUET SPARKLES
========================================= */

function createBouquetSparkles(
  amount = 15
) {
  if (!bouquetWrap) return;

  for (
    let index = 0;
    index < amount;
    index++
  ) {
    const sparkle =
      document.createElement("span");

    sparkle.className =
      "bouquet-sparkle";

    sparkle.style.left =
      `${15 + Math.random() * 70}%`;

    sparkle.style.top =
      `${8 + Math.random() * 55}%`;

    sparkle.style.setProperty(
      "--sparkle-x",
      `${-40 + Math.random() * 80}px`
    );

    sparkle.style.setProperty(
      "--sparkle-y",
      `${-40 - Math.random() * 65}px`
    );

    bouquetWrap.appendChild(sparkle);

    window.setTimeout(() => {
      sparkle.remove();
    }, 1300);
  }
}

/* =========================================
   PHOTO IMAGE FALLBACKS
========================================= */

$$(".photo-area img").forEach(
  (image) => {
    image.addEventListener(
      "error",
      () => {
        image.style.display = "none";
      }
    );
  }
);

/* =========================================
   PHOTO TAP COMPLIMENTS
========================================= */

$$(".polaroid").forEach((card) => {
  card.addEventListener(
    "click",
    () => {
      const wasActive =
        card.classList.contains("active");

      $$(".polaroid").forEach(
        (item) => {
          item.classList.remove(
            "active"
          );
        }
      );

      if (!wasActive) {
        card.classList.add("active");
      }
    }
  );
});

/* =========================================
   MEMORY SLIDER
========================================= */

const memoryTrack = $("#memoryTrack");
const memoryCards = $$(".polaroid");
const previousMemory = $("#prevMemory");
const nextMemory = $("#nextMemory");
const memoryDots = $("#memoryDots");

let activeMemory = 0;

function getMemoryCardWidth() {
  if (
    !memoryTrack ||
    memoryCards.length === 0
  ) {
    return 0;
  }

  const styles =
    getComputedStyle(memoryTrack);

  const gap = parseFloat(
    styles.columnGap ||
      styles.gap ||
      "0"
  );

  return (
    memoryCards[0]
      .getBoundingClientRect()
      .width + gap
  );
}

function updateMemorySlider(index) {
  if (
    !memoryTrack ||
    memoryCards.length === 0
  ) {
    return;
  }

  activeMemory = Math.max(
    0,
    Math.min(
      index,
      memoryCards.length - 1
    )
  );

  memoryTrack.scrollTo({
    left:
      getMemoryCardWidth() *
      activeMemory,
    behavior: "smooth",
  });

  $$("#memoryDots button").forEach(
    (dot, dotIndex) => {
      dot.classList.toggle(
        "active",
        dotIndex === activeMemory
      );
    }
  );
}

if (memoryDots) {
  memoryCards.forEach(
    (_, index) => {
      const dot =
        document.createElement("button");

      dot.type = "button";

      dot.setAttribute(
        "aria-label",
        `Open memory ${index + 1}`
      );

      dot.addEventListener(
        "click",
        () => {
          updateMemorySlider(index);
        }
      );

      memoryDots.appendChild(dot);
    }
  );

  updateMemorySlider(0);
}

if (previousMemory) {
  previousMemory.addEventListener(
    "click",
    () => {
      updateMemorySlider(
        activeMemory - 1
      );
    }
  );
}

if (nextMemory) {
  nextMemory.addEventListener(
    "click",
    () => {
      updateMemorySlider(
        activeMemory + 1
      );
    }
  );
}

let memoryScrollTimer;

if (memoryTrack) {
  memoryTrack.addEventListener(
    "scroll",
    () => {
      clearTimeout(
        memoryScrollTimer
      );

      memoryScrollTimer =
        setTimeout(() => {
          const cardWidth =
            getMemoryCardWidth();

          if (!cardWidth) return;

          activeMemory = Math.round(
            memoryTrack.scrollLeft /
              cardWidth
          );

          $$("#memoryDots button").forEach(
            (dot, index) => {
              dot.classList.toggle(
                "active",
                index === activeMemory
              );
            }
          );
        }, 100);
    }
  );
}

/* =========================================
   LOVE COUNTER
========================================= */

const loveButton = $("#loveButton");
const loveNumber = $("#loveNumber");
const loveMessage = $("#loveMessage");

let loveAnimationPlayed = false;

if (
  loveButton &&
  loveNumber &&
  loveMessage
) {
  loveButton.addEventListener(
    "click",
    () => {
      if (loveAnimationPlayed) {
        return;
      }

      loveAnimationPlayed = true;
      loveButton.disabled = true;

      const values = [
        "1",
        "10",
        "100",
        "1K",
        "10K",
        "100K",
        "1M",
        "∞",
      ];

      let index = 0;

      const counter =
        window.setInterval(() => {
          loveNumber.textContent =
            values[index];

          loveNumber.animate(
            [
              {
                opacity: 0.3,
                transform:
                  "scale(0.7)",
              },
              {
                opacity: 1,
                transform:
                  "scale(1)",
              },
            ],
            {
              duration: 280,
              easing: "ease-out",
            }
          );

          index++;

          if (
            index === values.length
          ) {
            clearInterval(counter);

            loveMessage.textContent =
              "Infinity still does not feel like enough.";

            loveButton.textContent =
              "Forever Yours ♡";

            createPetals(35);
          }
        }, 330);
    }
  );
}

/* =========================================
   WISH BOX
========================================= */

const wishButton = $("#wishButton");
const wishInput = $("#wishInput");
const wishResult = $("#wishResult");

if (
  wishButton &&
  wishInput &&
  wishResult
) {
  wishButton.addEventListener(
    "click",
    () => {
      const wish =
        wishInput.value.trim();

      if (wish) {
        wishResult.textContent =
          `Your wish “${wish}” is safe with me, Princess. ♡`;
      } else {
        wishResult.textContent =
          "Your wish is safe with me, Princess. ♡";
      }

      wishResult.classList.add(
        "show"
      );

      wishButton.textContent =
        "Wish Safely Kept ♡";

      wishButton.disabled = true;

      createPetals(22);
    }
  );
}

/* =========================================
   FALLING PETALS
========================================= */

function createPetals(count = 70) {
  const petalLayer = $("#petalLayer");

  if (!petalLayer) return;

  for (
    let index = 0;
    index < count;
    index++
  ) {
    const petal =
      document.createElement("i");

    petal.className =
      "falling-petal";

    petal.style.left =
      `${Math.random() * 100}vw`;

    petal.style.setProperty(
      "--duration",
      `${4 + Math.random() * 4}s`
    );

    petal.style.setProperty(
      "--drift",
      `${-120 + Math.random() * 240}px`
    );

    petal.style.setProperty(
      "--spin",
      `${180 + Math.random() * 720}deg`
    );

    petal.style.animationDelay =
      `${Math.random() * 1.1}s`;

    petal.style.transform =
      `scale(${
        0.55 +
        Math.random() * 0.95
      })`;

    petalLayer.appendChild(petal);

    window.setTimeout(() => {
      petal.remove();
    }, 9500);
  }
}

/* =========================================
   FIREWORKS
========================================= */

const fireworksCanvas =
  $("#fireworksCanvas");

const finalSurpriseButton =
  $("#finalSurprise");

const finaleSection = $("#finale");

if (
  fireworksCanvas &&
  finalSurpriseButton &&
  finaleSection
) {
  const fireworksContext =
    fireworksCanvas.getContext("2d");

  let fireworks = [];
  let fireworkParticles = [];

  let fireworksRunning = false;
  let fireworksEndTime = 0;
  let lastLaunchTime = 0;

  function resizeFireworksCanvas() {
    const rectangle =
      finaleSection.getBoundingClientRect();

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    fireworksCanvas.width =
      rectangle.width * dpr;

    fireworksCanvas.height =
      rectangle.height * dpr;

    fireworksCanvas.style.width =
      `${rectangle.width}px`;

    fireworksCanvas.style.height =
      `${rectangle.height}px`;

    fireworksContext.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  }

  class Firework {
    constructor() {
      this.x =
        60 +
        Math.random() *
          (
            fireworksCanvas.clientWidth -
            120
          );

      this.y =
        fireworksCanvas.clientHeight;

      this.targetY =
        fireworksCanvas.clientHeight *
        (
          0.14 +
          Math.random() * 0.42
        );

      this.speed =
        7 + Math.random() * 2;

      this.radius = 2.5;

      const colors = [
        335,
        345,
        355,
        5,
        25,
        45,
        280,
        310,
      ];

      this.hue =
        colors[
          Math.floor(
            Math.random() *
              colors.length
          )
        ];

      this.exploded = false;

      this.trail = [];
    }

    update() {
      this.trail.push({
        x: this.x,
        y: this.y,
      });

      if (this.trail.length > 7) {
        this.trail.shift();
      }

      this.y -= this.speed;

      this.speed *= 0.987;

      if (
        this.y <= this.targetY ||
        this.speed < 1.8
      ) {
        this.explode();

        this.exploded = true;
      }
    }

    draw() {
      if (this.trail.length > 1) {
        fireworksContext.beginPath();

        fireworksContext.moveTo(
          this.trail[0].x,
          this.trail[0].y
        );

        fireworksContext.lineTo(
          this.x,
          this.y
        );

        fireworksContext.strokeStyle =
          `hsla(${this.hue}, 100%, 72%, 0.7)`;

        fireworksContext.lineWidth = 1.5;

        fireworksContext.stroke();
      }

      fireworksContext.beginPath();

      fireworksContext.fillStyle =
        `hsl(${this.hue}, 100%, 76%)`;

      fireworksContext.shadowBlur = 18;

      fireworksContext.shadowColor =
        `hsl(${this.hue}, 100%, 60%)`;

      fireworksContext.arc(
        this.x,
        this.y,
        this.radius,
        0,
        Math.PI * 2
      );

      fireworksContext.fill();

      fireworksContext.shadowBlur = 0;
    }

    explode() {
      const particleCount =
        75 +
        Math.floor(
          Math.random() * 40
        );

      for (
        let index = 0;
        index < particleCount;
        index++
      ) {
        const angle =
          (
            Math.PI *
            2 *
            index
          ) /
            particleCount +
          Math.random() * 0.12;

        const speed =
          2.2 +
          Math.random() * 5.5;

        fireworkParticles.push(
          new FireworkParticle(
            this.x,
            this.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            this.hue
          )
        );
      }
    }
  }

  class FireworkParticle {
    constructor(
      x,
      y,
      velocityX,
      velocityY,
      hue
    ) {
      this.x = x;
      this.y = y;

      this.velocityX = velocityX;
      this.velocityY = velocityY;

      this.gravity = 0.055;
      this.friction = 0.985;

      this.alpha = 1;

      this.decay =
        0.011 +
        Math.random() * 0.014;

      this.hue =
        hue +
        Math.random() * 24 -
        12;

      this.radius =
        1 +
        Math.random() * 1.8;

      this.history = [];
    }

    update() {
      this.history.push({
        x: this.x,
        y: this.y,
      });

      if (this.history.length > 6) {
        this.history.shift();
      }

      this.velocityX *=
        this.friction;

      this.velocityY *=
        this.friction;

      this.velocityY +=
        this.gravity;

      this.x += this.velocityX;
      this.y += this.velocityY;

      this.alpha -= this.decay;
    }

    draw() {
      if (this.history.length > 1) {
        fireworksContext.beginPath();

        fireworksContext.moveTo(
          this.history[0].x,
          this.history[0].y
        );

        fireworksContext.lineTo(
          this.x,
          this.y
        );

        fireworksContext.strokeStyle =
          `hsla(${this.hue}, 100%, 72%, ${this.alpha})`;

        fireworksContext.lineWidth =
          this.radius;

        fireworksContext.shadowBlur =
          12;

        fireworksContext.shadowColor =
          `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;

        fireworksContext.stroke();
      }

      fireworksContext.beginPath();

      fireworksContext.fillStyle =
        `hsla(${this.hue}, 100%, 80%, ${this.alpha})`;

      fireworksContext.arc(
        this.x,
        this.y,
        this.radius,
        0,
        Math.PI * 2
      );

      fireworksContext.fill();

      fireworksContext.shadowBlur = 0;
    }
  }

  function launchFirework() {
    fireworks.push(
      new Firework()
    );
  }

  function animateFireworks(time) {
    if (!fireworksRunning) return;

    fireworksContext.fillStyle =
      "rgba(3, 2, 3, 0.18)";

    fireworksContext.fillRect(
      0,
      0,
      fireworksCanvas.clientWidth,
      fireworksCanvas.clientHeight
    );

    for (
      let index =
        fireworks.length - 1;
      index >= 0;
      index--
    ) {
      const firework =
        fireworks[index];

      firework.update();
      firework.draw();

      if (firework.exploded) {
        fireworks.splice(index, 1);
      }
    }

    for (
      let index =
        fireworkParticles.length - 1;
      index >= 0;
      index--
    ) {
      const particle =
        fireworkParticles[index];

      particle.update();
      particle.draw();

      if (particle.alpha <= 0) {
        fireworkParticles.splice(
          index,
          1
        );
      }
    }

    if (
      performance.now() <
        fireworksEndTime &&
      time - lastLaunchTime > 450
    ) {
      launchFirework();

      if (Math.random() > 0.5) {
        window.setTimeout(
          launchFirework,
          130
        );
      }

      lastLaunchTime = time;
    }

    if (
      performance.now() >=
        fireworksEndTime &&
      fireworks.length === 0 &&
      fireworkParticles.length === 0
    ) {
      fireworksRunning = false;

      fireworksContext.clearRect(
        0,
        0,
        fireworksCanvas.clientWidth,
        fireworksCanvas.clientHeight
      );

      finaleSection.classList.remove(
        "fireworks-active"
      );

      finalSurpriseButton.style.display =
        "inline-flex";

      finalSurpriseButton.disabled =
        false;

      return;
    }

    requestAnimationFrame(
      animateFireworks
    );
  }

  finalSurpriseButton.addEventListener(
    "click",
    () => {
      if (fireworksRunning) return;

      resizeFireworksCanvas();

      finalSurpriseButton.style.display =
        "none";

      finalSurpriseButton.disabled =
        true;

      finaleSection.classList.add(
        "fireworks-active"
      );

      fireworksRunning = true;

      fireworksEndTime =
        performance.now() + 9000;

      lastLaunchTime = 0;

      fireworks = [];
      fireworkParticles = [];

      createPetals(90);

      for (
        let index = 0;
        index < 5;
        index++
      ) {
        window.setTimeout(
          () => {
            launchFirework();
          },
          index * 300
        );
      }

      requestAnimationFrame(
        animateFireworks
      );
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (fireworksRunning) {
        resizeFireworksCanvas();
      }
    }
  );
}

/* =========================================
   SCROLL TO TOP
========================================= */

const scrollTopButton =
  $("#scrollTop");

if (scrollTopButton) {
  scrollTopButton.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  );
}