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

  const authorizedNameHashes = new Set([
    "e0a418b540f9ef468b3850f6a56e6191c9295231e7371e1c9e36237d48120e1c",
    "a3054d0b859324a67af460f8f3b09dcc0dd0549fa9186d7a70a4f93d5e6148d2",
    "3a3b15951b18a4e610a032fb80517eafc9f628f7c19b70250822fa1d70a04cbe",
    "467f64c2a24b85c6c425b57162936e91d56dfecc4d383ccb04bcb9694b41e72e",
    "c183a37bfa199c272cfa0fc00cae30908c465c46223ccd533f5bebbaa5fdcdd8",
    "41d1764e49617c46a99cae0b2bd466c490a46a9c468e6ae3736be6da50c9aeea",
    "f71d8ba30f40603e60a61acb837c6a3853cf10e8e0159692b137b858d54c9552",
    "5377ef65149e736f5a14e4e678eef3753ca8856de59d3c00403b75ecea286faa",
    "f1ecf3f266f1dc339dac7fb3591e6d6e65621318e02578c551bbb1622144e065",
    "bced89c6e0add6d0e6a0b01d152bfc33450498c4dc1e0ed5c15f8683827da5d3",
    "d1332281a627a7eb91b75cf9db05bf29592f154d09aa14734d947ab5bb3e109a",
    "6b5d6927ca9132de16a43f63ada18ec9da05f99a1d36fe41f07f16ac22de6d99",
    "05a5cdabcdb4c51eb0244176153ac5908384b3176d9117d2ba1af22020153895",
    "6b652758fdec6b36d792ebdc17b235f7bfd92dee8f3e45155eedfa3275ba2f10",
    "087b11465d45b8fdacd20d8f6dc04bea427f73476024c9763b810612e61dcac8",
    "9fe8bc6068f82326afd6644402e1f705c4a03fe977688138f697db1901caa985",
    "b8f9ce42964787ffd8402f2f20d18fa40133b2a9a9b4432d65b150f92c8caecf",
    "90041ff72302f346b7d78a9374a21e2f80f8dfb8f364387ad398df0962b624d3",
    "232665db00605d796deb04ba9e87eb5ff7a1749dd70a501e32b2a7f7b8bec418",
    "b86da40239186ab08434b38fc17db7b205822504f894aae50d6f07beb37e5569",
    "ec75275bd9db66c93ecb48fa5564af6725ab9b6563e99d5aea8a7845f22a8e33",
    "0e0d5b3dd6951f9ee733fcc42dfb46e214dfe2543a2773cb967706e9c5a186cd",
    "6b67732e5c4c9dbec934faf34ec6c096e2ddf393f3d61d474d86051d510daf4d",
    "ad38dbc836f05894bcb0f460bb50ce3e5e66bd4527ffa2aa3b8625a3b174e858",
    "68a2c65cd6f2486e18c1439aabd4feecc9e6556c05b46820a299fae92f596589",
    "67417bb1986988c3d35bb1233a94ab1ae5207809f6da0f258e32ea766495e1e2",
    "24f4adbcb0ba165c44ae7abb0561a5ff00588d9d76f163df3050d56f23e6bc78",
    "d037455021205166d66a0aa1c72cace14f69b37d77b04517e93332d22099aab2",
    "0bfaf0b20857e85cfa2a44f769593a66d6f429edb23c7b1af4ef513067bb01bb",
    "68f1bfe25b4ad1129487564b8b3f633dcf89a5fdf0b21098da50686722dd8ae3",
    "05192112400b45ef478b9cd1cecd8c362cc75f609c825fe818e20a46714b2590",
    "e4f0a28405377eefb820df344f13499c8312a747ac1e90affcdc4798224c553a",
    "e0354ceeb76a057b01fb9fe704b64829efe8ea63d6a6884561aae6105c03009c",
    "a7513b1d011a4d991aa48b75e93b94e0d1e5e8d1d12f5a613f946ac27194fe16",
    "e182ae6b071b95abc8fb49241b8cb13adfec72b923b924ed6fe959724dabaaf0",
    "4a6c4939c8733ce3a17d7862fffa26e1268dff6b16811b3400960638f1979cf9",
    "2964263ec8f4d855c91e90fad4ab6e81834c9afcc7552051de425d05af5a7434",
    "de8dd3f6ade60a5e10fd8ddfea796867dd1bcf897a15dc95662b9bb50cbe67e5",
    "82b868ce783bbf88343fd48724e99b535ef5626056ffd294ee4d540321b4e1a6",
    "c74e0a5418f161198bff7a8eb3be269430be2f14374cefd154dd9dd0a1357b71",
    "0fa0dafa0f04afc41b2261f3a71ac631ad40b3ba47c18de094414d06d76ed599",
    "b09a9a72d6db7c17ab6a97caede231f7fdd4352e3bfdc0a10ac50a3b6198617a",
    "c90798f8d2048d7330a8a065a02e08bdbbbffd3ceee3df8ed95bca8b0d17ba58",
    "fde13d79076a7e2e5de49176922889d8504b0be91fcd6bded617de8c27218380",
    "8e76b7c01335a58e6e22dce31f42a6d2ca90f1ba0992a0aee5e002f1334be5a4",
    "205e6da1f7e4e6be3c724bb42660513a99285f22ae71e282f822c029108a2c61",
    "aec0588a470489f331c92ea8d19f9d831c9c1429f92f9101313845660e7262c9"
  ]);
  const accessStorageKey = "agibuilder-house-access-ok";
  const legacyAccessStorageKey = "agibuilder-house-access-name";
  const normalizeName = (value) => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
  const nameKeys = (value) => {
    const normalized = normalizeName(value);
    return [normalized, normalized.replace(/\s+/g, "")];
  };
  async function hashNameKey(value) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("Crypto API unavailable");
    }
    const data = new TextEncoder().encode(value);
    const buffer = await window.crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function isAuthorizedName(value) {
    const hashes = await Promise.all(nameKeys(value).map(hashNameKey));
    return hashes.some((hash) => authorizedNameHashes.has(hash));
  }

  const accessGate = document.querySelector("[data-access-gate]");
  const accessForm = document.querySelector("[data-access-form]");
  const accessInput = document.querySelector("[data-access-name]");
  const accessError = document.querySelector("[data-access-error]");

  function grantAccess(showMessage) {
    document.documentElement.classList.add("access-granted");
    if (accessGate) accessGate.hidden = true;
    try {
      window.localStorage.setItem(accessStorageKey, "1");
      window.localStorage.removeItem(legacyAccessStorageKey);
    } catch (error) {
      // Local storage can be unavailable in private browsing.
    }
    if (showMessage) showToast("已进入指南");
  }

  function lockAccess() {
    document.documentElement.classList.remove("access-granted");
    if (accessGate) accessGate.hidden = false;
    window.setTimeout(() => accessInput && accessInput.focus(), 0);
  }

  if (accessForm && accessInput) {
    let hasStoredAccess = false;
    let legacyStoredName = "";
    try {
      hasStoredAccess = window.localStorage.getItem(accessStorageKey) === "1";
      legacyStoredName = window.localStorage.getItem(legacyAccessStorageKey) || "";
    } catch (error) {
      hasStoredAccess = false;
      legacyStoredName = "";
    }

    if (hasStoredAccess) {
      grantAccess(false);
    } else {
      lockAccess();
      if (legacyStoredName) {
        isAuthorizedName(legacyStoredName)
          .then((authorized) => {
            if (authorized) grantAccess(false);
          })
          .catch(() => {
            lockAccess();
          });
      }
    }

    accessForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = accessInput.value;
      if (accessError) accessError.textContent = "";

      try {
        if (await isAuthorizedName(name)) {
          grantAccess(true);
          return;
        }
      } catch (error) {
        if (accessError) accessError.textContent = "当前浏览器暂不支持本地校验，请换一个浏览器打开。";
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
