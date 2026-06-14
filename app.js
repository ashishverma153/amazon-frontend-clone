/* Amazon Clone — interactive bits
   - Cart drawer (open/close, add items from shop cards)
   - Toast notifications
   - Navbar shrink on scroll
   - Smooth back-to-top
*/

(() => {
    const cartBtn       = document.getElementById("cart-btn");
    const cartDrawer    = document.getElementById("cart-drawer");
    const cartClose     = document.getElementById("cart-close");
    const cartBackdrop  = document.getElementById("drawer-backdrop");
    const cartBody      = document.getElementById("cart-body");
    const cartCountEl   = document.getElementById("cart-count");
    const toast         = document.getElementById("toast");
    const navbar        = document.getElementById("navbar");
    const toTop         = document.getElementById("to-top");

    const cart = [];
    let toastTimer = null;

    // ---------- Cart drawer ----------
    const openDrawer = () => {
        cartDrawer.hidden = false;
        cartBackdrop.hidden = false;
        // next frame so transitions fire
        requestAnimationFrame(() => {
            cartDrawer.classList.add("open");
            cartBackdrop.classList.add("show");
        });
    };
    const closeDrawer = () => {
        cartDrawer.classList.remove("open");
        cartBackdrop.classList.remove("show");
        setTimeout(() => {
            cartDrawer.hidden = true;
            cartBackdrop.hidden = true;
        }, 350);
    };
    cartBtn.addEventListener("click", openDrawer);
    cartClose.addEventListener("click", closeDrawer);
    cartBackdrop.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && cartDrawer.classList.contains("open")) closeDrawer();
    });

    // ---------- Toast ----------
    const showToast = (msg) => {
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
    };

    // ---------- Cart rendering ----------
    const renderCart = () => {
        cartCountEl.textContent = cart.length;
        cartCountEl.classList.remove("bump");
        // restart animation
        void cartCountEl.offsetWidth;
        cartCountEl.classList.add("bump");

        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <p>Your cart is empty.</p>
                </div>`;
            return;
        }

        cartBody.innerHTML = cart.map((item, i) => `
            <div class="cart-item">
                <div class="cart-item-img" style="background-image:url('${item.image}')"></div>
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <span>${item.cat}</span>
                    <strong>$${item.price.toFixed(2)}</strong>
                    <button class="cart-item-remove" data-idx="${i}">Remove</button>
                </div>
            </div>
        `).join("");

        cartBody.querySelectorAll(".cart-item-remove").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const i = +e.currentTarget.dataset.idx;
                cart.splice(i, 1);
                renderCart();
            });
        });
    };

    // ---------- Add to cart from shop cards ----------
    const fakePrices = [29.99, 19.50, 149.00, 89.99, 24.99, 14.99, 34.99, 59.99];
    document.querySelectorAll(".box").forEach((box) => {
        box.addEventListener("click", () => {
            const title = box.querySelector("h2").textContent.trim();
            const cat   = box.dataset.cat || "Product";
            const img   = box.querySelector(".box-image").style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || "";
            const price = fakePrices[Math.floor(Math.random() * fakePrices.length)];

            cart.push({ title, cat, image: img, price });
            renderCart();
            showToast(`Added “${title}” to cart`);
        });
    });

    // ---------- Navbar shrink on scroll ----------
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const y = window.scrollY;
        navbar.classList.toggle("shrunk", y > 80);
        lastScroll = y;
    }, { passive: true });

    // ---------- Back to top ----------
    toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // initial render
    renderCart();
})();
