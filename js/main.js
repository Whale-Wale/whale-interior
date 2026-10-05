/**
 * WHALE INTERIOR - Luxury Ocean Organic & Contemporary Architecture
 * Advanced Interactive & Animation Engine
 * Inspired by High-End Editorial Studios (Sōl Haus) & Interactive Room Explorers (RoomSketch)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeaderScroll();
  initScrollReveal();
  initCounters();
  initRoomExplorer();
  initEditorialPortfolioSlider();
  initBeforeAfterSlider();
  init3DCardTilt();
  initHeroSlider();
  initProjectFilter();
  initCart();
  initCostCalculator();
  initMobileMenu();
  initConsultModal();
  initOceanSoundscape();
  initMobileBottomNav();
});

/* ==========================================================================
   1. PRELOADER DISMISS
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 800);
  });

  setTimeout(() => {
    preloader.classList.add('loaded');
  }, 2200);
}

/* ==========================================================================
   2. HEADER SCROLL SHRINK & BLUR
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. METRICS COUNT-UP ANIMATION
   ========================================================================== */
function initCounters() {
  const counterItems = document.querySelectorAll('.metric-num[data-target]');
  if (!counterItems.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const target = parseInt(item.getAttribute('data-target'), 10);
        const suffix = item.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateNumber(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeProgress * target);

          item.innerHTML = currentVal.toLocaleString('vi-VN') + `<span>${suffix}</span>`;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            item.innerHTML = target.toLocaleString('vi-VN') + `<span>${suffix}</span>`;
          }
        }

        requestAnimationFrame(updateNumber);
        obs.unobserve(item);
      }
    });
  }, { threshold: 0.3 });

  counterItems.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. INTERACTIVE ROOM EXPLORER & HOTSPOTS (INSPIRATION: ROOMSKETCH)
   ========================================================================== */
function initRoomExplorer() {
  const hotspots = document.querySelectorAll('.hotspot');
  const compareBtn = document.getElementById('btnRoomToggleCompare');
  const roomImg = document.getElementById('roomExplorerImg');
  let isComparing = false;

  const mobSheet = document.getElementById('mobileHotspotSheet');
  const mobImg = document.getElementById('mobHotspotImg');
  const mobBadge = document.getElementById('mobHotspotBadge');
  const mobTitle = document.getElementById('mobHotspotTitle');
  const mobMaterial = document.getElementById('mobHotspotMaterial');
  const mobPrice = document.getElementById('mobHotspotPrice');
  const mobAddBtn = document.getElementById('mobHotspotAddBtn');
  const mobCloseBtn = document.getElementById('mobHotspotClose');
  const mobBackdrop = document.getElementById('mobHotspotBackdrop');

  function closeMobSheet() {
    if (mobSheet) mobSheet.classList.remove('active');
    hotspots.forEach(s => s.classList.remove('active'));
  }

  if (mobCloseBtn) mobCloseBtn.addEventListener('click', closeMobSheet);
  if (mobBackdrop) mobBackdrop.addEventListener('click', closeMobSheet);

  function openMobSheet(spot) {
    if (!mobSheet) return;
    const titleEl = spot.querySelector('.hotspot-card-title');
    const badgeEl = spot.querySelector('.hotspot-card-badge');
    const matEl = spot.querySelector('.hotspot-card-material');
    const priceEl = spot.querySelector('.hotspot-card-price');
    const imgEl = spot.querySelector('.hotspot-card-thumb');

    if (mobTitle && titleEl) mobTitle.textContent = titleEl.textContent;
    if (mobBadge && badgeEl) mobBadge.textContent = badgeEl.textContent;
    if (mobMaterial && matEl) mobMaterial.textContent = matEl.textContent;
    if (mobPrice && priceEl) mobPrice.textContent = priceEl.textContent;
    if (mobImg && imgEl) mobImg.src = imgEl.src;

    hotspots.forEach(s => s.classList.remove('active'));
    spot.classList.add('active');
    mobSheet.classList.add('active');

    if (mobAddBtn) {
      mobAddBtn.onclick = (e) => {
        e.stopPropagation();
        const title = titleEl ? titleEl.textContent : '';
        const priceText = priceEl ? priceEl.textContent : '';
        const img = imgEl ? imgEl.src : '';
        const priceNum = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

        cart.push({ title, priceText, priceNum, img });
        updateCartUI();
        showToast(`Đã thêm "${title}" từ phối cảnh vào giỏ hàng`);

        closeMobSheet();

        const cartDrawer = document.getElementById('cartDrawer');
        const cartOverlay = document.getElementById('cartDrawerOverlay');
        if (cartDrawer && cartOverlay) {
          cartDrawer.classList.add('active');
          cartOverlay.classList.add('active');
        }
      };
    }
  }

  // Toggle hotspot active state on mobile touch or click
  hotspots.forEach(spot => {
    const dot = spot.querySelector('.hotspot-dot');
    if (dot) {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.innerWidth <= 768) {
          openMobSheet(spot);
        } else {
          hotspots.forEach(s => {
            if (s !== spot) s.classList.remove('active');
          });
          spot.classList.toggle('active');
        }
      });
    }

    // Add to cart from desktop hotspot card
    const addBtn = spot.querySelector('.btn-hotspot-add');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const title = spot.querySelector('.hotspot-card-title').innerText;
        const priceText = spot.querySelector('.hotspot-card-price').innerText;
        const img = spot.querySelector('.hotspot-card-thumb').src;
        const priceNum = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

        cart.push({ title, priceText, priceNum, img });
        updateCartUI();
        showToast(`Đã thêm "${title}" từ phối cảnh vào giỏ hàng`);

        const cartDrawer = document.getElementById('cartDrawer');
        const cartOverlay = document.getElementById('cartDrawerOverlay');
        if (cartDrawer && cartOverlay) {
          cartDrawer.classList.add('active');
          cartOverlay.classList.add('active');
        }
      });
    }

    // Prevent closing when clicking inside hotspot card
    const card = spot.querySelector('.hotspot-card');
    if (card) {
      card.addEventListener('click', (e) => e.stopPropagation());
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#mobileHotspotSheet')) {
      closeMobSheet();
    }
    hotspots.forEach(s => s.classList.remove('active'));
  });

  // Toggle Before / After Room View
  if (compareBtn && roomImg) {
    const afterSrc = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80";
    const beforeSrc = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80";

    compareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isComparing = !isComparing;
      roomImg.style.opacity = '0.4';

      setTimeout(() => {
        if (isComparing) {
          roomImg.src = beforeSrc;
          compareBtn.innerHTML = '<span>👁️</span> XEM SAU KHI HOÀN THIỆN';
          showToast('Đang xem bản thiết kế phối cảnh ban đầu');
        } else {
          roomImg.src = afterSrc;
          compareBtn.innerHTML = '<span>⚖️</span> SO SÁNH HIỆN TRẠNG / 3D';
          showToast('Đang xem không gian hoàn thiện nội thất thực tế');
        }
        roomImg.style.opacity = '1';
      }, 250);
    });
  }
}

/* ==========================================================================
   6. EDITORIAL PORTFOLIO CAROUSEL (INSPIRATION: SŌL HAUS)
   ========================================================================== */
const editorialProjects = [
  {
    num: "01 / 04",
    title: "VILLA OCEAN HORIZON",
    location: "NHA TRANG · KHÁNH HÒA",
    desc: "Đường nét hữu cơ bionic mềm mại lấy cảm hứng từ đại dương, kết hợp hoàn mỹ giữa gỗ Óc chó FAS Bắc Mỹ và đá cẩm thạch trắng Hy Lạp. Không gian mở ngập tràn ánh nắng và gió biển tự nhiên.",
    materials: "Gỗ Óc Chó FAS, Đá Quartz Calacatta, Vải Lanh Bỉ Tự Nhiên & Kính Tràn Viền",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
  },
  {
    num: "02 / 04",
    title: "THE MARINA PEARL PENTHOUSE",
    location: "ĐÀ NẴNG · VIEW VỊNH BIỂN",
    desc: "Căn hộ thông tầng panorama ngoạn mục. Sử dụng bảng màu trầm ấm của gỗ Sồi trắng sấy vi sóng và tone màu cát biển, tạo nên sự tĩnh tại thanh khiết giữa trung tâm vịnh biển phồn hoa.",
    materials: "Gỗ Sồi Trắng Bắc Mỹ, Da Bò Ý Thuộc Thảo Mộc, Đồng Thau Xước Thủ Công",
    img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80"
  },
  {
    num: "03 / 04",
    title: "WHALE SERENITY RETREAT",
    location: "TP.HCM · THẢO ĐIỀN",
    desc: "Sự giao thoa tinh tế giữa triết lý Japandi tối giản và phong cách đương đại ven biển. Điểm nhấn là giếng trời ngập sáng và hệ vách gỗ phay rãnh fluted uốn lượn như nhịp thở của biển sâu.",
    materials: "Gỗ Ash Tần Bì, Bê Tông Mài Terrazzo, Đèn Thủy Tinh Khói Thủ Công",
    img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80"
  },
  {
    num: "04 / 04",
    title: "EMERALD BAY SANCTUARY",
    location: "CAM RANH · BÃI DÀI",
    desc: "Kiến trúc tân cổ điển đương đại tiết chế nhẹ nhàng, phào chỉ sắc nét từng đường nét chế tác từ xưởng Whale Craft, đem lại cảm giác quyền uy và thanh lịch vượt thời gian.",
    materials: "Gỗ Óc Chó Chạm Khắc CNC 5 Trục, Vải Gấm Dệt Nỉ, Phụ Kiện Bản Lề Blum Áo",
    img: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1000&q=80"
  }
];

let currentEditorialIndex = 0;

function initEditorialPortfolioSlider() {
  const prevBtn = document.getElementById('btnEditorialPrev');
  const nextBtn = document.getElementById('btnEditorialNext');
  const numEl = document.getElementById('editorialSlideNum');
  const locEl = document.getElementById('editorialSlideLoc');
  const titleEl = document.getElementById('editorialSlideTitle');
  const descEl = document.getElementById('editorialSlideDesc');
  const matEl = document.getElementById('editorialSlideMaterials');
  const imgEl = document.getElementById('editorialSlideImg');

  if (!prevBtn || !nextBtn || !titleEl) return;

  function renderSlide(idx) {
    const p = editorialProjects[idx];
    imgEl.style.opacity = '0.3';
    
    setTimeout(() => {
      numEl.innerText = p.num;
      locEl.innerText = p.location;
      titleEl.innerText = p.title;
      descEl.innerText = p.desc;
      matEl.innerText = p.materials;
      imgEl.src = p.img;
      imgEl.style.opacity = '1';
    }, 200);
  }

  prevBtn.addEventListener('click', () => {
    currentEditorialIndex = (currentEditorialIndex - 1 + editorialProjects.length) % editorialProjects.length;
    renderSlide(currentEditorialIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentEditorialIndex = (currentEditorialIndex + 1) % editorialProjects.length;
    renderSlide(currentEditorialIndex);
  });
}

/* ==========================================================================
   7. BEFORE / AFTER 3D SLIDER (THE SIGNATURE CRAFT)
   ========================================================================== */
function initBeforeAfterSlider() {
  const baCard = document.querySelector('.before-after-card');
  if (!baCard) return;

  const baBefore = baCard.querySelector('.ba-before');
  const baHandle = baCard.querySelector('.ba-slider-handle');
  const beforeImg = baCard.querySelector('.ba-before img');
  let isDown = false;

  function syncBeforeImgWidth() {
    if (beforeImg) {
      beforeImg.style.width = `${baCard.offsetWidth}px`;
    }
  }
  syncBeforeImgWidth();
  window.addEventListener('resize', syncBeforeImgWidth, { passive: true });

  function updateSliderPosition(x) {
    const rect = baCard.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    if (pos < 0.05) pos = 0.05;
    if (pos > 0.95) pos = 0.95;

    const percentage = pos * 100;
    baBefore.style.width = `${percentage}%`;
    baHandle.style.left = `${percentage}%`;
  }

  baCard.addEventListener('mousedown', (e) => {
    isDown = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
  });

  baCard.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    updateSliderPosition(e.clientX);
  });

  baCard.addEventListener('touchstart', (e) => {
    isDown = true;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDown = false;
  });

  baCard.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });
}

/* ==========================================================================
   8. 3D CARD TILT EFFECT (PERSPECTIVE HOVER)
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.project-card, .product-card');
  if (!window.matchMedia('(hover: hover)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   9. HERO SLIDESHOW
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 6000);
}

/* ==========================================================================
   10. PROJECT FILTER
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   11. SHOPPING CART SIMULATOR
   ========================================================================== */
const cart = [];

function initCart() {
  const cartTrigger = document.querySelector('.btn-cart-trigger');
  const roomCartTrigger = document.getElementById('roomCartTrigger');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const addCartBtns = document.querySelectorAll('.btn-add-cart');

  const openCart = () => {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
    }
  };
  const closeCart = () => {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
    }
  };

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (roomCartTrigger) roomCartTrigger.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      const title = card.querySelector('.product-title').innerText;
      const priceText = card.querySelector('.product-price').innerText;
      const img = card.querySelector('.product-thumb img').src;
      
      const priceNum = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

      cart.push({ title, priceText, priceNum, img });
      updateCartUI();
      showToast(`Đã thêm "${title}" vào giỏ hàng`);

      openCart();
    });
  });
}

function updateCartUI() {
  const badge = document.querySelector('.cart-badge');
  const roomBadge = document.getElementById('roomCartTotal');
  const cartList = document.getElementById('cartItemsList');
  const cartTotal = document.getElementById('cartTotalPrice');

  if (badge) badge.innerText = cart.length;

  let total = 0;
  cart.forEach(item => total += item.priceNum);

  if (roomBadge) {
    roomBadge.innerText = total > 0 ? total.toLocaleString('vi-VN') + ' đ' : '0 đ';
  }

  if (cartList) {
    if (cart.length === 0) {
      cartList.innerHTML = '<p style="text-align:center; color:#94a3b8; padding:35px 0;">Giỏ hàng của bạn đang trống</p>';
      if (cartTotal) cartTotal.innerText = '0 đ';
      return;
    }

    cartList.innerHTML = cart.map((item, idx) => {
      return `
        <div class="cart-item-row">
          <img src="${item.img}" class="cart-item-img" alt="${item.title}">
          <div class="cart-item-info" style="flex-grow:1;">
            <h5>${item.title}</h5>
            <div class="cart-item-price">${item.priceText}</div>
          </div>
          <button onclick="removeFromCart(${idx})" style="color:#ef4444; font-size:1.1rem; padding:4px;">✕</button>
        </div>
      `;
    }).join('');

    if (cartTotal) {
      cartTotal.innerText = total.toLocaleString('vi-VN') + ' đ';
    }
  }
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

/* ==========================================================================
   12. COST CALCULATOR
   ========================================================================== */
function initCostCalculator() {
  const areaInput = document.getElementById('calcArea');
  const typeSelect = document.getElementById('calcType');
  const packageSelect = document.getElementById('calcPackage');
  const resultDisplay = document.getElementById('calcResultValue');
  const calcBtn = document.getElementById('btnCalculate');

  function calculateEstimate() {
    if (!areaInput || !typeSelect || !packageSelect || !resultDisplay) return;

    const area = parseFloat(areaInput.value) || 120;
    const typeRate = parseFloat(typeSelect.value) || 3200000;
    const packageMultiplier = parseFloat(packageSelect.value) || 1.35;

    const totalEstimate = Math.round(area * typeRate * packageMultiplier);
    const millions = (totalEstimate / 1000000).toFixed(0);

    resultDisplay.innerHTML = `${Number(millions).toLocaleString('vi-VN')} <span>Triệu VNĐ</span>`;
  }

  if (areaInput) areaInput.addEventListener('input', calculateEstimate);
  if (typeSelect) typeSelect.addEventListener('change', calculateEstimate);
  if (packageSelect) packageSelect.addEventListener('change', calculateEstimate);
  if (calcBtn) {
    calcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculateEstimate();
      showToast('Đã tính toán dự toán hoàn thành!');
    });
  }

  calculateEstimate();
}

/* ==========================================================================
   13. MOBILE DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobileNavDrawer');
  const overlay = document.getElementById('mobileNavOverlay');

  if (toggle && mobileNav && overlay) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
}

/* ==========================================================================
   14. CONSULTATION MODAL
   ========================================================================== */
function initConsultModal() {
  const modal = document.getElementById('consultModal');
  const modalOverlay = document.getElementById('consultModalOverlay');
  const openBtns = document.querySelectorAll('.open-consult-modal');
  const closeBtn = document.getElementById('closeConsultModal');
  const consultForm = document.getElementById('consultForm');

  if (openBtns.length > 0 && modal && modalOverlay) {
    openBtns.forEach(b => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        modalOverlay.classList.add('active');
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      modalOverlay.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
  }

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Đã gửi thông tin tư vấn thành công! KTS Whale Interior sẽ gọi lại trong 15 phút.');
      consultForm.reset();
      if (modal && modalOverlay) {
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   15. WHALE SOUNDSCAPE SYNTHESIZER (WEB AUDIO API)
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let oceanGain = null;

function initOceanSoundscape() {
  const audioBtn = document.getElementById('oceanAudioToggle');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        createOceanSynthesizer();
      } catch (e) {
        console.warn('Web Audio API not supported', e);
        return;
      }
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      oceanGain.gain.setTargetAtTime(0.08, audioCtx.currentTime, 1);
      audioBtn.classList.add('active');
      audioBtn.title = "Tắt âm thanh tĩnh lặng đại dương";
      isAudioPlaying = true;
      showToast('Đang phát âm thanh tĩnh lặng đại dương Whale Soundscape 🌊');
    } else {
      oceanGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.8);
      audioBtn.classList.remove('active');
      audioBtn.title = "Bật âm thanh tĩnh lặng đại dương";
      isAudioPlaying = false;
    }
  });
}

function createOceanSynthesizer() {
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
    b6 = white * 0.115926;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(260, audioCtx.currentTime);

  const lfo = audioCtx.createOscillator();
  lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime);
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(140, audioCtx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  oceanGain = audioCtx.createGain();
  oceanGain.gain.setValueAtTime(0, audioCtx.currentTime);

  noise.connect(filter);
  filter.connect(oceanGain);
  oceanGain.connect(audioCtx.destination);

  noise.start();
  lfo.start();
}

/* ==========================================================================
   16. TOAST HELPER
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}

/* ==========================================================================
   17. MOBILE BOTTOM NAV & SCROLL SPY
   ========================================================================== */
function initMobileBottomNav() {
  const navItems = document.querySelectorAll('.mobile-bottom-nav .mob-nav-item');
  if (!navItems.length) return;

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          navItems.forEach(n => n.classList.remove('active'));
          item.classList.add('active');
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  const sections = [
    { id: 'hero', nav: 'home' },
    { id: 'projects', nav: 'projects' },
    { id: 'roomExplorer', nav: 'room' },
    { id: 'du-toan', nav: 'calc' }
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && el.offsetTop <= scrollPos) {
        navItems.forEach(item => {
          if (item.getAttribute('data-nav') === sections[i].nav) {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
          }
        });
        break;
      }
    }
  }, { passive: true });
}

