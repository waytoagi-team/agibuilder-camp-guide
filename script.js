(function () {
  const toast = document.querySelector("[data-toast]");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    return Promise.resolve();
  }

  const accessNames = [
    "郝凯源",
    "陈创平",
    "王心怡",
    "马立德",
    "倪豪",
    "陈柏宇",
    "张天远",
    "董志伟",
    "谷晓涓",
    "叶子野",
    "张龑",
    "柯晔坤",
    "洪莎俐",
    "罗燕",
    "陈思伟",
    "李经纬",
    "张天琦",
    "joanna liu",
    "樊舒扬",
    "王泽",
    "李样兵",
    "刘朝",
    "刘雨",
    "吴衍晴",
    "王健乐",
    "王俊凯",
    "李利伟",
    "王莹",
    "于昊任",
    "聂勇刚",
    "邱源顺",
    "王维真",
    "何凡",
    "闫硕",
    "高嘉丰",
    "郑百川",
    "沈煜洁",
    "屈江峰",
    "张雨霏",
    "陈瀚翔",
    "郑忠炜",
    "陈泉",
    "陈越",
    "高雁",
    "王贝",
    "熊腾焱"
  ];
  const accessStorageKey = "agibuilder-house-access-name";
  const normalizeName = (value) => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
  const nameKeys = (value) => {
    const normalized = normalizeName(value);
    return [normalized, normalized.replace(/\s+/g, "")];
  };
  const authorizedNameKeys = new Set(accessNames.flatMap(nameKeys));
  const isAuthorizedName = (value) => nameKeys(value).some((key) => authorizedNameKeys.has(key));

  const accessGate = document.querySelector("[data-access-gate]");
  const accessForm = document.querySelector("[data-access-form]");
  const accessInput = document.querySelector("[data-access-name]");
  const accessError = document.querySelector("[data-access-error]");

  function grantAccess(name, showMessage) {
    document.documentElement.classList.add("access-granted");
    if (accessGate) accessGate.hidden = true;
    if (name) {
      try {
        window.localStorage.setItem(accessStorageKey, normalizeName(name));
      } catch (error) {
        // Local storage can be unavailable in private browsing.
      }
    }
    if (showMessage) showToast("已进入指南");
  }

  function lockAccess() {
    document.documentElement.classList.remove("access-granted");
    if (accessGate) accessGate.hidden = false;
    window.setTimeout(() => accessInput && accessInput.focus(), 0);
  }

  if (accessForm && accessInput) {
    let storedName = "";
    try {
      storedName = window.localStorage.getItem(accessStorageKey) || "";
    } catch (error) {
      storedName = "";
    }

    if (storedName && isAuthorizedName(storedName)) {
      grantAccess(storedName, false);
    } else {
      lockAccess();
    }

    accessForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = accessInput.value;
      if (isAuthorizedName(name)) {
        if (accessError) accessError.textContent = "";
        grantAccess(name, true);
        return;
      }

      if (accessError) accessError.textContent = "未找到这个名字，请检查姓名是否完整。";
      accessInput.select();
    });
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      copyText(button.dataset.copy)
        .then(() => showToast("已复制"))
        .catch(() => showToast("复制失败，请手动选择文本"));
    });
  });

  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        document.body.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const searchInput = document.querySelector("[data-search-input]");
  const searchResult = document.querySelector("[data-search-result]");
  const searchCards = [...document.querySelectorAll("[data-search-card]")];
  if (searchInput && searchCards.length) {
    const updateSearch = () => {
      const query = searchInput.value.trim().toLowerCase();
      let visible = 0;

      searchCards.forEach((card) => {
        const haystack = `${card.textContent} ${card.dataset.search || ""}`.toLowerCase();
        const matched = !query || haystack.includes(query);
        card.hidden = !matched;
        if (matched) visible += 1;
      });

      if (searchResult) {
        searchResult.textContent = query ? `找到 ${visible} 个相关入口` : "输入关键词可筛选下方入口";
      }
    };

    searchInput.addEventListener("input", updateSearch);
    updateSearch();
  }

  const periodButtons = [...document.querySelectorAll("[data-period-filter]")];
  const scheduleItems = [...document.querySelectorAll("[data-period]")];
  periodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const period = button.dataset.periodFilter;
      periodButtons.forEach((item) => item.classList.toggle("active", item === button));
      scheduleItems.forEach((item) => {
        item.hidden = period !== "all" && item.dataset.period !== period;
      });
    });
  });

  const header = document.querySelector(".site-header");
  const navLinks = [...document.querySelectorAll(".desktop-nav a")];
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${active.target.id}`);
        });
      },
      {
        rootMargin: `-${header ? header.offsetHeight + 10 : 80}px 0px -62% 0px`,
        threshold: [0.1, 0.25, 0.5]
      }
    );
    observedSections.forEach((section) => observer.observe(section));
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
})();
