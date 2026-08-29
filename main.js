/* =========================================================
   Nikhil Ranjan — personal site
   No framework. No build step. Just the DOM and me.
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------------
     1. Theme: system by default, explicit choice remembered.
     The <head> already applied any stored choice before paint;
     this wires the toggle and keeps <meta theme-color> honest.
     ------------------------------------------------------- */

  function setupTheme() {
    var btn = document.getElementById("themeToggle");
    var sun = document.querySelector(".theme-toggle__icon--sun");
    var moon = document.querySelector(".theme-toggle__icon--moon");
    if (!btn || !sun || !moon) return;

    var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

    function currentTheme() {
      var set = document.documentElement.getAttribute("data-theme");
      if (set === "light" || set === "dark") return set;
      return systemDark.matches ? "dark" : "light";
    }

    function paint() {
      var dark = currentTheme() === "dark";
      // Show the control for the theme you'd switch *to*.
      sun.hidden = !dark;
      moon.hidden = dark;
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");

      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", dark ? "#0e0f12" : "#ededee");
    }

    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) { /* storage blocked — choice lasts this visit only */ }
      paint();
    });

    // If the visitor hasn't chosen, follow the OS as it changes.
    systemDark.addEventListener("change", function () {
      var stored = null;
      try {
        stored = localStorage.getItem("theme");
      } catch (e) { /* ignore */ }
      if (stored !== "light" && stored !== "dark") paint();
    });

    paint();
  }

  /* -------------------------------------------------------
     2. Ambient serving log
     A faint tail of an inference service doing its job in the
     background. Text only, no glow. Kept on purpose.
     ------------------------------------------------------- */

  var SNIPPETS = [
    "INFO  serving: model=fraud-gnn rev=1f4c2e status=ready",
    "INFO  graph: loaded ~1B edges (accounts, merchants, devices)",
    "INFO  etl: feature build finished on GPU (cugraph)",
    "DEBUG batch=4096 neighbors=[15, 10] device=cuda:0",
    "INFO  vllm: worker up, kv-cache warm",
    "INFO  onnx: embedding session initialized (CUDA)",
    "INFO  rag: retrieved docs for \"chargeback rules apac\"",
    "INFO  rag: answer grounded, citations attached",
    "INFO  agent: plan -> retrieve -> act -> respond",
    "INFO  checkpoint: state saved, thread=risk-472",
    "WARN  drift: feature \"merchant_age\" psi rising (watch)",
    "DEBUG torch.cuda.synchronize()",
    "INFO  writer: wrote embeddings partition dt=2026-08-29",
    "INFO  health: all checks green",
    "INFO  sampler: 2-hop subgraph built in 3.1ms (p50)",
    "INFO  gnn: GraphSAGE forward pass, hidden=256, layers=2",
    "DEBUG message-passing: aggregating mean over 25 neighbors",
    "INFO  triton: dynamic batching, max_batch=64, queue=0",
    "INFO  vllm: prefix cache hit rate 0.71 last 5m",
    "DEBUG tokens: prompt=1832 completion=214 tp=0.9",
    "INFO  llm: speculative decoding on, accept rate 0.63",
    "INFO  rerank: cross-encoder scored 40 candidates, kept 8",
    "INFO  retriever: hybrid bm25 + dense, alpha=0.5",
    "WARN  retriever: empty result set, falling back to keyword",
    "INFO  eval: faithfulness 0.94, context precision 0.88",
    "INFO  guardrail: pii scrub passed, 0 spans redacted",
    "DEBUG faiss: nprobe=32 recall@10=0.97",
    "INFO  embed: batch of 512 chunks -> pgvector upsert ok",
    "INFO  feature-store: online read p99 4ms",
    "WARN  gpu0: memory 92% used, activation checkpointing on",
    "INFO  scheduler: preempting low-pri job risk-scan-91",
    "DEBUG nccl: all-reduce 128MB across 4 ranks, 0.8ms",
    "INFO  train: epoch 7/20 loss=0.213 val_auc=0.981",
    "INFO  graph: PageRank converged in 41 iterations",
    "INFO  graph: community detection found 1,204 clusters",
    "DEBUG neo4j: cypher match ring pattern, depth<=4, 12 hits",
    "WARN  fraud-gnn: score 0.97 on acct 4f21 -> queued for review",
    "INFO  fraud-gnn: 3 mule accounts flagged in same component",
    "INFO  serving: canary rev=1f4c2e at 5% traffic, error 0.0%",
    "INFO  serving: promoted rev=1f4c2e to 100%",
    "INFO  autoscale: replicas 3 -> 6, qps 210",
    "DEBUG cache: embedding LRU evicted 2,048 entries",
    "INFO  quantize: int8 export, accuracy delta -0.3%",
    "INFO  onnx: graph optimization fused 118 nodes",
    "WARN  latency: p99 spiked to 480ms, cause=cold replica",
    "INFO  latency: recovered, p99 back to 90ms",
    "INFO  lineage: run logged to mlflow, id=8c86d0e",
    "DEBUG kv-cache: paged attention, block_size=16, frag 4%",
    "INFO  agent: tool call get_txn_history(acct=4f21) ok",
    "INFO  agent: max steps reached, returning partial plan",
    "WARN  coffee: level low, refill queued (manual)",
    "# TODO: refresh the personal website  (done)"
  ];

  function renderConsole() {
    var host = document.getElementById("consoleRain");
    if (!host || reduceMotion) return;

    var MAX_LINES = 44;
    var i = Math.floor(Math.random() * SNIPPETS.length);

    function tick() {
      var line = document.createElement("p");
      line.textContent = SNIPPETS[i % SNIPPETS.length];
      host.appendChild(line);
      i += 1;

      while (host.childElementCount > MAX_LINES) {
        host.removeChild(host.firstElementChild);
      }

      window.setTimeout(tick, 380 + Math.random() * 340);
    }

    tick();
  }

  /* -------------------------------------------------------
     3. Navigation: mobile toggle, sticky state, active link
     ------------------------------------------------------- */

  function setupNav() {
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!nav || !toggle || !links) return;

    function closeMenu() {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) closeMenu();
    });

    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Highlight the section currently in view.
    var anchors = Array.prototype.slice.call(links.querySelectorAll("a"));
    var sections = anchors
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || !sections.length) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        anchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* -------------------------------------------------------
     4. Scroll reveal
     ------------------------------------------------------- */

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, idx) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(idx * 60, 240) + "ms";
        el.classList.add("is-visible");
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------
     5. Email: assembled at runtime.
     The static HTML holds a decoy; the real address is only
     ever put together in a browser that ran this script.
     ------------------------------------------------------- */

  function setupEmail() {
    var el = document.querySelector("[data-obf]");
    if (!el) return;

    var parts = el.getAttribute("data-obf").split("|");
    if (parts.length !== 2) return;

    var address = parts[0] + String.fromCharCode(64) + parts[1];
    var link = document.createElement("a");
    link.href = "mailto:" + address;
    link.textContent = address;
    el.textContent = "";
    el.appendChild(link);
  }

  /* -------------------------------------------------------
     6. Odds and ends
     ------------------------------------------------------- */

  function setupYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function greet() {
    if (!window.console || !console.log) return;
    console.log(
      "%cclass NikhilRanjan(Inference):",
      "color:#1e6f45;font-family:monospace;font-size:13px;font-weight:700"
    );
    console.log(
      "%c    # You opened devtools. We should probably talk.\n" +
      "%c    linkedin.com/in/nikhil-ranjan",
      "color:#83878f;font-family:monospace",
      "color:#1e6f45;font-family:monospace"
    );
  }

  function init() {
    setupTheme();
    setupNav();
    setupReveal();
    setupEmail();
    setupYear();
    renderConsole();
    greet();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
