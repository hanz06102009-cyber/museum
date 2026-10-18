/* ============================================================
   THE MUSEUM OF HER - slide deck
   1. Curtain opening + rising title
   2. Brass lamps, sparks, sconces, plaque sheen
   3. Photo loading: every frame is sized to its photo
   4. Frames that lean toward your cursor
   5. The deck: arrows, keys, wheel, swipe, dots, full screen
   6. Lightbox
   7. Drifting dust
   ============================================================ */

(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-cap");

  /* ---------- 1. curtains + rising title ---------- */
  const curtains = document.querySelector(".curtains");
  if (reduced) {
    curtains && curtains.remove();
  } else {
    setTimeout(() => document.body.classList.remove("loading"), 350);
    setTimeout(() => curtains && curtains.classList.add("gone"), 2700);
  }

  const marquee = document.getElementById("marquee");
  const TITLE_DELAY = reduced ? 0 : 1.9; // letters appear as the curtains part

  function splitTitle(startAt) {
    if (!marquee || marquee.dataset.split === "1") return;
    const text = marquee.textContent;
    marquee.textContent = "";
    let i = 0;
    /* one span per letter, but each word is wrapped in an unbreakable box,
       so a narrow screen can only ever break the title between words */
    text.split(/\s+/).filter(Boolean).forEach((word, wi) => {
      if (wi > 0) {
        const sp = document.createElement("span");
        sp.className = "ch sp";
        sp.textContent = "\u00A0";
        sp.style.animationDelay = (startAt + i * 0.045).toFixed(3) + "s";
        sp.setAttribute("aria-hidden", "true");
        marquee.appendChild(sp);
        i++;
      }
      const wrap = document.createElement("span");
      wrap.className = "word";
      [...word].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "ch";
        span.textContent = ch;
        span.style.animationDelay = (startAt + i * 0.045).toFixed(3) + "s";
        span.setAttribute("aria-hidden", "true");
        wrap.appendChild(span);
        i++;
      });
      marquee.appendChild(wrap);
    });
    marquee.dataset.split = "1";
  }

  function replayTitle() {
    if (!marquee) return;
    const spans = marquee.querySelectorAll(".ch");
    spans.forEach((s) => (s.style.animation = "none"));
    void marquee.offsetWidth;
    spans.forEach((s, i) => {
      s.style.animation = "";
      s.style.animationDelay = (0.25 + i * 0.045).toFixed(3) + "s";
    });
  }

  splitTitle(TITLE_DELAY);

  /* ---------- 2. lamps, sparks, sconces, plaque sheen ---------- */
  document.querySelectorAll(".photo-slot").forEach((slot) => {
    const lamp = document.createElement("span");
    lamp.className = "lamp";
    lamp.setAttribute("aria-hidden", "true");
    slot.appendChild(lamp);

    ["s1", "s2", "s3", "s4"].forEach((cls) => {
      const spark = document.createElement("span");
      spark.className = "spark " + cls;
      spark.textContent = "\u2726";
      spark.setAttribute("aria-hidden", "true");
      slot.appendChild(spark);
    });
  });

  /* two flickering wall sconces flanking the room */
  ["left", "right"].forEach((side) => {
    const sconce = document.createElement("div");
    sconce.className = "sconce " + side;
    sconce.setAttribute("aria-hidden", "true");
    sconce.innerHTML =
      '<span class="flame"></span><span class="candle"></span><span class="cup"></span><span class="bracket"></span><span class="plate"></span>';
    document.body.appendChild(sconce);
  });

  document.querySelectorAll(".plaque").forEach((plaque) => {
    const sheen = document.createElement("span");
    sheen.className = "sheen";
    sheen.setAttribute("aria-hidden", "true");
    plaque.insertBefore(sheen, plaque.firstChild);
  });

  /* ---------- 3. photo loading: frames sized to the photo ---------- */
  const slots = Array.from(document.querySelectorAll(".photo-slot"));
  const gallery = [];
  let current = 0;

  /* give each frame the photo's exact shape, as large as the slide allows,
     so the picture sits in it perfectly - nothing cropped, nothing spare.
     The gilt face and the mount board are drawn inside the slot, so it is
     the window they leave that has to match the photo, not the slot. */
  function fitFrame(slot) {
    const img = slot.querySelector("img");
    const slide = slot.closest(".slide");
    if (!img || !slide || !img.naturalWidth || !img.naturalHeight) return;

    const ratio = img.naturalWidth / img.naturalHeight;
    const cs = getComputedStyle(slide);
    const inner = slot.closest(".slide-inner") || slide;
    const cap = inner.querySelector(".caption");
    const capH = cap ? cap.offsetHeight : 0;

    const frame = slot.querySelector(".frame");
    const mat = slot.querySelector(".mat");
    let borderX = 0;
    let borderY = 0;
    if (frame && mat) {
      const cf = getComputedStyle(frame);
      const cm = getComputedStyle(mat);
      borderX = (parseFloat(cf.paddingLeft) || 0) + (parseFloat(cf.paddingRight) || 0) +
                (parseFloat(cm.paddingLeft) || 0) + (parseFloat(cm.paddingRight) || 0);
      borderY = (parseFloat(cf.paddingTop) || 0) + (parseFloat(cf.paddingBottom) || 0) +
                (parseFloat(cm.paddingTop) || 0) + (parseFloat(cm.paddingBottom) || 0);
    }

    const availW = slide.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 14 - borderX;
    const availH = slide.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - capH - 22 - borderY;
    if (availW < 60 || availH < 60) return;

    const portrait = availW / availH < ratio;   /* width is the scarce side */
    let w = portrait ? availW : availH * ratio;
    let h = portrait ? availW / ratio : availH;

    slot.style.width = Math.round(w + borderX) + "px";
    slot.style.height = Math.round(h + borderY) + "px";
  }

  function fitAll() {
    slots.forEach((slot) => {
      if (slot.classList.contains("has-img")) fitFrame(slot);
    });
  }

  /* refit on the next frame after a resize, so a phone that is being
     rotated (or whose browser bars are sliding away) is measured once */
  let fitTimer = 0;
  function scheduleFit() {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitAll, 120);
  }

  slots.forEach((slot) => {
    const img = slot.querySelector("img");
    if (!img) return;
    const markLoaded = () => {
      fitFrame(slot);
      img.classList.add("loaded");
      slot.classList.add("has-img");
      if (!gallery.includes(img)) gallery.push(img);
    };
    if (img.complete && img.naturalWidth > 0) markLoaded();
    img.addEventListener("load", markLoaded);
    img.addEventListener("error", () => {
      slot.classList.remove("has-img");
      img.classList.remove("loaded");
      slot.style.width = "";
      slot.style.height = "";
    });
  });

  window.addEventListener("resize", scheduleFit);
  window.addEventListener("orientationchange", scheduleFit);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleFit);
  }
  if (window.screen && window.screen.orientation && window.screen.orientation.addEventListener) {
    window.screen.orientation.addEventListener("change", scheduleFit);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  fitAll();

  /* ---------- 4. frames lean toward the cursor, in three dimensions ---------- */
  if (!reduced && finePointer) {
    slots.forEach((slot) => {
      slot.addEventListener("mousemove", (e) => {
        const r = slot.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        slot.style.setProperty("--rx", (-ny * 5).toFixed(2) + "deg");
        slot.style.setProperty("--ry", (nx * 5).toFixed(2) + "deg");
        slot.style.setProperty("--mx", (50 + nx * 60).toFixed(1) + "%");
        slot.style.setProperty("--my", (50 + ny * 60).toFixed(1) + "%");
      });
      slot.addEventListener("mouseleave", () => {
        slot.style.setProperty("--rx", "0deg");
        slot.style.setProperty("--ry", "0deg");
        slot.style.setProperty("--mx", "50%");
        slot.style.setProperty("--my", "-10%");
      });
    });

    /* the room itself tips a little toward the pointer - only while the
       pointer is moving, so the type stays crisp when you hold still */
    const roomDeck = document.getElementById("deck");
    let roomTimer = 0;
    window.addEventListener("mousemove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      roomDeck.style.setProperty("--room-y", (nx * 2.4).toFixed(2) + "deg");
      roomDeck.style.setProperty("--room-x", (-ny * 1.5).toFixed(2) + "deg");
      roomDeck.classList.add("tilting");
      clearTimeout(roomTimer);
      roomTimer = setTimeout(() => {
        roomDeck.classList.remove("tilting");
        roomDeck.style.setProperty("--room-y", "0deg");
        roomDeck.style.setProperty("--room-x", "0deg");
      }, 700);
    });
  }

  /* ---------- 5. the deck ---------- */
  const slides = Array.from(document.querySelectorAll(".slide"));
  const deck = document.getElementById("deck");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsWrap = document.getElementById("dots");
  const hudNow = document.getElementById("hudNow");
  const hudTotal = document.getElementById("hudTotal");
  const fsBtn = document.getElementById("fsBtn");
  const restartBtn = document.getElementById("restartBtn");

  let index = 0;
  let busy = false;

  const pad = (n) => String(n).padStart(2, "0");
  hudTotal.textContent = pad(slides.length);

  slides.forEach((slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function lock() {
    busy = true;
    setTimeout(() => (busy = false), reduced ? 140 : 1000);
  }

  function goTo(i, dir) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    const target = slides[i];
    if (target === slides[index] && target.classList.contains("is-active")) return;

    const going = dir || (i > index ? 1 : -1);
    const leaving = slides[index];

    slides.forEach((s) => s.classList.remove("is-leaving"));
    slides.forEach((s, n) => s.classList.toggle("is-active", n === i));

    if (leaving && leaving !== target) {
      leaving.classList.add("is-leaving");
      setTimeout(() => leaving.classList.remove("is-leaving"), 760);
    }

    deck.classList.remove("going-next", "going-prev");
    void deck.offsetWidth;
    deck.classList.add(going > 0 ? "going-next" : "going-prev");

    index = i;
    hudNow.textContent = pad(i + 1);
    dots.forEach((d, n) => d.classList.toggle("is-on", n === i));
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === slides.length - 1;
    if (i === 0) replayTitle();
    lock();
  }

  const next = () => { if (index < slides.length - 1) goTo(index + 1, 1); };
  const prev = () => { if (index > 0) goTo(index - 1, -1); };

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  restartBtn && restartBtn.addEventListener("click", () => goTo(0, -1));

  /* click anywhere but a frame or a button to move on */
  slides.forEach((slide) => {
    slide.addEventListener("click", (e) => {
      if (swipedRecently()) return;    /* the tap that ended a swipe is not a click */
      if (e.target.closest(".photo-slot") || e.target.closest("button")) return;
      next();
    });
  });

  /* arrow keys, page keys, home/end, F for full screen */
  document.addEventListener("keydown", (e) => {
    if (lightbox && !lightbox.hidden) return; // the lightbox has its own keys
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || k === " " || k === "Enter") {
      e.preventDefault();
      next();
    } else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp" || k === "Backspace") {
      e.preventDefault();
      prev();
    } else if (k === "Home") {
      e.preventDefault();
      goTo(0, -1);
    } else if (k === "End") {
      e.preventDefault();
      goTo(slides.length - 1, 1);
    } else if (k.toLowerCase() === "f") {
      toggleFullScreen();
    }
  });

  /* mouse wheel / trackpad */
  let wheelAcc = 0;
  window.addEventListener("wheel", (e) => {
    if (lightbox && !lightbox.hidden) return;
    wheelAcc += e.deltaY;
    if (busy || Math.abs(wheelAcc) < 55) return;
    if (wheelAcc > 0) next(); else prev();
    wheelAcc = 0;
  }, { passive: true });

  /* swipe: sideways to turn the wall, upwards to move on */
  let startX = 0, startY = 0, touchMoved = false, swipeAt = 0;
  const swipedRecently = () => Date.now() - swipeAt < 450;

  window.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0];
    startX = t.clientX;
    startY = t.clientY;
    touchMoved = false;
  }, { passive: true });

  window.addEventListener("touchmove", () => { touchMoved = true; }, { passive: true });

  window.addEventListener("touchend", (e) => {
    if (!touchMoved) return;                       /* a plain tap: let the click through */
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < 45) return;             /* too small to be a gesture */

    const inLightbox = lightbox && !lightbox.hidden;
    if (ax > ay) {                                 /* sideways */
      swipeAt = Date.now();
      if (dx < 0) { inLightbox ? step(1) : next(); }
      else { inLightbox ? step(-1) : prev(); }
    } else if (!inLightbox) {                      /* up or down, outside the lightbox */
      swipeAt = Date.now();
      if (dy < 0) next(); else prev();
    }
  }, { passive: true });

  /* full screen */
  function toggleFullScreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  const fsLabel = fsBtn && fsBtn.querySelector(".hud-btn-label");
  fsBtn && fsBtn.addEventListener("click", toggleFullScreen);
  document.addEventListener("fullscreenchange", () => {
    if (!fsBtn) return;
    const on = !!document.fullscreenElement;
    fsBtn.classList.toggle("is-on", on);
    fsBtn.setAttribute("aria-pressed", on ? "true" : "false");
    if (fsLabel) fsLabel.textContent = on ? "Exit full screen" : "Full screen";
  });

  /* buttons reflect where we are */
  prevBtn.disabled = true;
  nextBtn.disabled = slides.length <= 1;
  dots[0] && dots[0].classList.add("is-on");

  /* ---------- 6. lightbox ---------- */
  function captionFor(img) {
    const slide = img.closest(".slide");
    if (!slide) return img.alt || "";
    const num = slide.querySelector(".pl-num");
    const title = slide.querySelector(".pl-title");
    return [num && num.textContent, title && title.textContent].filter(Boolean).join(" \u00b7 ");
  }

  function showCurrent(dir) {
    if (!gallery.length) return;
    const img = gallery[current];
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = captionFor(img);
    if (dir && !reduced) {
      lbImg.animate(
        [
          { opacity: 0, transform: "translateX(" + dir * 28 + "px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 320, easing: "ease-out" }
      );
    }
  }

  function openLightbox(img) {
    current = Math.max(0, gallery.indexOf(img));
    showCurrent(0);
    lightbox.hidden = false;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lbImg.src = "";
  }

  function step(dir) {
    if (!gallery.length) return;
    current = (current + dir + gallery.length) % gallery.length;
    showCurrent(dir);
  }

  slots.forEach((slot) => {
    slot.addEventListener("click", (e) => {
      e.stopPropagation();
      if (swipedRecently()) return;    /* a swipe over the frame is not a tap on it */
      const img = slot.querySelector("img");
      if (img && slot.classList.contains("has-img")) openLightbox(img);
    });
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.querySelector(".lb-close").addEventListener("click", closeLightbox);
  document.querySelector(".lb-prev").addEventListener("click", () => step(-1));
  document.querySelector(".lb-next").addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---------- 7. dust motes ---------- */
  const canvas = document.querySelector(".dust");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let w, h, motes, raf = 0;

    /* fewer motes on a phone: same glow, less to repaint every frame */
    function moteCount() {
      const area = window.innerWidth * window.innerHeight;
      return Math.max(22, Math.min(80, Math.round(area / 12000)));
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      motes = Array.from({ length: moteCount() }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.9,
        vy: 0.08 + Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
      }));
    }
    let dustTimer = 0;
    function scheduleDustResize() {
      clearTimeout(dustTimer);
      dustTimer = setTimeout(resize, 160);
    }

    resize();
    window.addEventListener("resize", scheduleDustResize);

    function draw(t) {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.vy;
        m.x += m.vx + Math.sin(t * 0.001 * m.speed + m.phase) * 0.16;
        if (m.y < -6) {
          m.y = h + 6;
          m.x = Math.random() * w;
        }
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.002 + m.phase * 3));
        ctx.beginPath();
        ctx.fillStyle = "rgba(234, 202, 132, " + (0.3 * twinkle).toFixed(3) + ")";
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* stop drawing when the room is not being looked at */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(draw);
      }
    });

    raf = requestAnimationFrame(draw);
  }
})();
