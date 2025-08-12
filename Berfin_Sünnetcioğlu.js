(() => {
  // Check to see if I'm on the Home Page:
  if (window.location.pathname === "/") {
    console.log("You are in the right place!");

    // I add a flag to check whether the code is run for the first time or not, this will ensure that it does not fetch twice:
    window.productListFetched = window.productListFetched || false;

    // Data will be fetched from the link if it has not been fetched before:
    if (!window.productListFetched) {
      fetch("https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json")
        .then(res => res.json())
        .then(data => {
          console.log("Product list:", data);
          window.productListFetched = true;
          // This part downloads jQuery and adds it to the page. If I don't do this, my code won't work because the '$' won't be recognized without jQuery:
          const script = document.createElement('script');
          script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
          // Added Data to Jquery to use it in buildHTML. In that way I can call the data in run function:
          script.onload = () => run(window.jQuery, data);
          document.head.appendChild(script);
        })
        .catch(err => console.error("Fetch error:", err));
    } else {
      // TODO!: Load products and liked products from local storage
      console.log("Previously fetched. Liked products are being loaded.");
    }

    // In this section, I will add the HTML, CSS and event codes I need to add:
    function run($, data) {
      $(() => {
        (() => {
          const init = () => {
            buildHTML();
            buildCSS();
            setEvents();
          };

          const buildHTML = () => {
            const html = `
              <div class="container">
                <div class="banner">
                  <div class="banner-title-container">
                    <h2 class="banner-title">Beğenebileceğinizi Düşündüklerimiz</h2>
                  </div>
                  <div class="container-products">
                    <div class="products-track"></div>
                  </div>
                  <button class="carousel-btn left" aria-label="Prev">
                    <svg class="chev" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M15 4 L7 12 L15 20" />
                    </svg>
                  </button>
                  <button class="carousel-btn right" aria-label="Next">
                    <svg class="chev" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 4 L17 12 L9 20" />
                    </svg>
                  </button>
                </div>
              </div>
            `;
            $('body').append(html);
            // I created the HTML where the products are displayed separately and added it to the main HTML so that the titles and buttons for each product will not be repeated:
            data.forEach(product => {
              // I create priceHTML separately to calculate discount:
              let priceHtml = `
                <span class="price-regular"><b>${product.price} TL</b></span>`; // If price is stable then I just add product price

              // If there is a discount:
              if (product.original_price && product.original_price > product.price) {  
                // Calculate discount percent:
                const discountAmount = product.original_price - product.price;
                const discountPercent = Math.round((discountAmount / product.original_price) * 100);

                // Add different HTML elements for discounted prices to design different in CSS:
                priceHtml = `
                  <span class="price-old">${product.original_price} TL</span>
                  <span class="discount-badge"><b>%${discountPercent}</b><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Eo_circle_green_arrow-down.svg/1200px-Eo_circle_green_arrow-down.svg.png" alt="Discount Icon" class="discount-icon"/></span>
                  <span class="price-new"><b>${product.price} TL</b></span>
                `;
              }

              const productHtml = `
                <div class="banner-products">
                  <a href="${product.url}">
                    <div class="favorite">
                      <img class="default-heart" src="assets/svg/default-favorite.svg" />
                      <img class="hover-heart" src="assets/svg/default-hover-favorite.svg" />
                      <img class="added-heart" src="assets/svg/added-favorite.svg" />
                    </div>
                    <img class="product-image" src="${product.img}" alt="${product.name.trim()}" />
                    <div class="product-info">
                      <div class="product-title"><b>${product.brand} -</b> ${product.name} </div>
                      <div class="product-price">${priceHtml}</div>
                    </div>
                  </a>
                  <div class="product-add-button"><b>Sepete Ekle</b></div>
                </div>`;
              $('.products-track').append(productHtml);
            });
          };

          const buildCSS = () => {
            const css = `
              .banner {
                padding: 0px 15px;
                width: 100%;
                margin-bottom: 1000px;
                position: relative;
              }
              .container-products {
                display: flex;
                flex-wrap: nowrap;
                overflow: hidden;
                box-shadow: 15px 15px 30px 0 #ebebeb80;
                border-bottom-left-radius: 35px;
                border-bottom-right-radius: 35px;
                background-color: #fff;
                width: 100% !important;
              }
              .container-products.carousel-fixed {
                width: 100%;
                margin: 0 auto;
              }
              .banner-products {
                margin-right: 20px;
                margin-top: 20px;
                margin-bottom: 20px;
                width: 250px;
                min-height:400px;
                position:relative;
                border: 1px solid #ededed;
                border-radius: 10px;
                display: flex;
                flex-direction:column;
                justify-content:space-between;
                padding: 5px;
                text-align: center;
                background: #fff;
                flex: 0 0 auto;
                scroll-snap-align: start;
                scroll-snap-stop: always;
              }
              .favorite {
                position: absolute;
                right: 15px;
                top: 10px;
                width: 40px;                      
                height: 40px;                     
                display: grid;                    
                place-items: center;             
                background-color: #fff;
                border-radius: 50%;
                box-shadow: 0 2px 4px 0 #00000024;
                z-index: 2;                      
              }
              .default-heart{
                position: absolute;
                width: 20px !important;
                height: 20px !important;
                inset: 0;                        
                margin: auto;
                display: block;                   
              }
              .hover-heart {
                position: absolute;
                width: 20px;
                height: 20px;
                inset: 0;
                margin: auto;
                display: none;                    
              }
              .added-heart {
                position: absolute;
                width: 20px;
                height: 20px;
                inset: 0;
                margin: auto;
                display: none;                    
              }
              .favorite:hover .default-heart { display: none; }
              .favorite:hover .hover-heart { display: block; }
              .favorite.is-active .added-heart { display: block; }
              .product-image {
                margin-bottom:45px;
              }
              .banner-products:hover { border: 3px solid #f28e00; cursor: pointer; }
              .product-image { margin-bottom:45px; }
              .banner-title-container {
                background-color: #fef6eb;
                font-family: Quicksand-Bold;
                padding: 25px 10px;
                border-top-left-radius: 35px;
                border-top-right-radius: 35px;
              }
              .banner-title { color: #f28e00; font-size: 3rem; padding-left: 15px;}
              .product-info {
                min-height: 70px; 
                padding: 0 20px 20px;
                font-size: 12px;
                font-family: Poppins,"cursive";
                text-align: start;
              }
              .product-title { 
                margin-bottom: 10px; 
                color: #686868;
                
              }
              .product-price { 
                color: #686868; 
                font-size: 2.2rem; 
                display: flex;
                align-items: baseline; 
                flex-wrap: wrap;
              }
              .padding-before-button { min-height: 70px; }
              .product-add-button {
                display: block;
                margin: 15px auto;
                padding: 10px;
                width: 200px;
                color: #f28e00;
                border-radius: 37.5px;
                background-color: #fff7ec;
                font-size: 1.4rem;
                font-family: Poppins,"cursive";
                text-align: center;
              }
              .carousel-btn{
                position:absolute;
                top:50%;
                transform:translateY(-50%);
                height:56px; width:56px;
                border-radius:50%;
                border:none;
                background:#FFF7EC;
                box-shadow:
                  0 6px 14px rgba(0,0,0,0.08),
                  inset 0 0 0 1px #FFE8CF;
                cursor:pointer;
                z-index:10;
                display:grid;
                place-items:center;
                user-select:none;
                transition:transform .18s ease, box-shadow .18s ease, background .18s ease;
              }
              .carousel-btn.left{ left:8px; }
              .carousel-btn.right{ right:8px; }
              .carousel-btn .chev{
                width:24px; height:24px;
                stroke:#F28E00;
                stroke-width:3.2;
                fill:none;
                stroke-linecap:round;
                stroke-linejoin:round;
              }
              .carousel-btn:hover{
                background:#FFF2E1;
                box-shadow:
                  0 8px 18px rgba(0,0,0,0.10),
                  inset 0 0 0 1px #FFE0BA;
                transform:translateY(-50%) scale(1.04);
              }
              .carousel-btn:active{
                transform:translateY(-50%) scale(0.98);
              }
              .carousel-btn:disabled{
                opacity:.45;
                cursor:default;
                transform:translateY(-50%);
              }
              @media (max-width: 768px){
                .carousel-btn{ display:none !important; }
              }
              .product-add-button:hover { color: white; background-color: #f28e00; cursor: pointer; }
              .products-track{
                display:flex;
                flex-wrap:nowrap;
                transition: transform 350ms ease;
                will-change: transform;
                scroll-snap-type: x mandatory;   
                scroll-behavior: smooth;
                overflow-x: auto; 
              }
              .products-track::-webkit-scrollbar {
                display: none; 
              }
              .carousel-btn{
                position:absolute;
                top:50%;
                transform:translateY(-50%);
                height:48px; width:48px;
                border-radius:50%;
                border:none;
                background:#fef6eb;
                cursor:pointer;
                z-index:10;
                display:grid;
                place-items:center;
                user-select:none;
              }
              .carousel-btn.left{ left:-45px; }
              .carousel-btn.right{ right:-45px; }
              .carousel-btn:hover{ background:rgba(0,0,0,.14); }
              .carousel-btn:disabled{ opacity:.35; cursor:default; }
              .carousel-btn .arrow{ font-size:24px; line-height:1; }
              .price-old{
                text-decoration: line-through;
                font-size: 1.4rem;
              }
              .discount-badge {
                color: #00a365;
                display: inline-flex;
                font-size: 18px;
                justify-content: center;
                align-items: center;
              }
              .discount-icon{
                width: 18px !important;
                height: 18px !important;
              }
              .price-new {
                color: #00a365;
                font-size: 2.2rem;
                display: block;
                width: 100%;
              }
              .price-regular{
                font-size: 2.2rem;
                display: block;
                width: 100%;
                margin-top: auto;
              }
            `;
            $('<style>').html(css).appendTo('head');
          };

          const setEvents = () => {
            $('.product-add-button').on('click', () => {
              console.log('Product Added.');
            });
            // When the favorite button is clicked, I activate the class so that the svg added in the design becomes visible in CSS:
            $('.container-products').on('click', '.favorite', function (e) {
              e.preventDefault();
              e.stopPropagation();
              const $btn = $(this);
              $btn.toggleClass('is-active');
              $btn.attr('aria-pressed', $btn.hasClass('is-active'));
            });

            // My first attempt at a carousel design was like this, but it wasn't responsive:

            // // I define all divs so that I can use them when creating a carousel:
            // const $cont = $('.container-products');
            // const $track = $cont.children('.products-track');
            // const $products = $track.children('.banner-products');
            // const $banner = $('.banner');
            // const $btnPrev = $banner.find('.carousel-btn.left');
            // const $btnNext = $banner.find('.carousel-btn.right');

            // const VISIBLE = 5; // How many products should be displayed on the screen?
            // const STEP = 1; // How many products should be moved when the button is pressed?
            // let startIndex = 0; // The current index of the first visible product

            // // I use that function for calculating *the exact area a product occupies on the screen*:
            // const productOuterWidth = () => Math.round($products.eq(0).outerWidth(true));   
            // const mr = () => 20; // Margin right of products
            // const maxStartIndex = () => 4.6; // I determined the index that would be on the far right. By trial and error.😅

            // // If I reach the end - left or right - the buttons are disabled:
            // const updateButtons = () => {
            //   $btnPrev.prop('disabled', startIndex <= 0);
            //   $btnNext.prop('disabled', startIndex >= maxStartIndex());
            // };

            // const goTo = (idx) => { // idx = the index I want to go to
            //   startIndex = Math.max(0, Math.min(idx, maxStartIndex())); // Keeps the index within the minimum and maximum product range
            //   const x = -(startIndex * productOuterWidth()); // EXAMPLE: if startIndex = 2, product width = 260px → x = -520px
            //   $track.css('transform', `translateX(${x}px)`); // Shifts the .products-track element horizontally
            //   updateButtons();
            // };

            // $btnPrev.off('click.carousel').on('click.carousel', () => goTo(startIndex - STEP)); // Left arrow: startIndex - STEP → back the specified step
            // $btnNext.off('click.carousel').on('click.carousel', () => goTo(startIndex + STEP)); // Right arrow: startIndex + STEP → forward by specified step

            // goTo(0); // Start from the first product

            // My second attempt at a carousel design is like this, it is more responsive and works better with the design I made:
            // I define all divs so that I can use them when creating a carousel: -AGAIN-
            const $track   = $('.products-track');
            const $banner  = $('.banner');
            const $btnPrev = $banner.find('.carousel-btn.left');
            const $btnNext = $banner.find('.carousel-btn.right');

            // I calculated the area covered by only one product so that I could scroll for only one product:
            const productWidth = () => {
              const $first = $track.children('.banner-products').eq(0);
              return Math.round($first[0]?.getBoundingClientRect().width || 0);
            };

            // I calculate the step size based on the product width and add a margin of 20px to it:
            const stepPx = () => (productWidth() + 20);

            $btnPrev.off('click.carousel').on('click.carousel', () => {
              $track[0].scrollBy({ left: -stepPx(), behavior: 'smooth' });
            });
            $btnNext.off('click.carousel').on('click.carousel', () => {
              $track[0].scrollBy({ left:  stepPx(), behavior: 'smooth' });
            });

            // If I reach the end - left or right - the buttons are disabled:
            const updateButtons = () => {
              const el  = $track[0];
              const max = el.scrollWidth - el.clientWidth;
              $btnPrev.prop('disabled', el.scrollLeft <= 0);
              $btnNext.prop('disabled', max <= 0 || el.scrollLeft >= max - 1);
            };

            $track.on('scroll', updateButtons); // Use updateButtons function while scrolling
            $(window).on('resize', () => setTimeout(updateButtons, 50)); // If my screen is resized, I need to recalculate

            // And nowwww my carousel is better!
          };
          init();
        })();
      });
    }
  } else {
    console.log("Wrong Page!");
  }
})();
