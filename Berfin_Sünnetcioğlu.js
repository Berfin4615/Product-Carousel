(() => {
    // This part downloads jQuery and adds it to the page. If I don't do this, my code won't work because the '$' won't be recognized without jQuery:
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.onload = () => run(window.jQuery);
    document.head.appendChild(script);

    // I add a flag to check whether the code is run for the first time or not, this will ensure that it does not fetch twice:
    window.productListFetched = window.productListFetched || false;

    // Data will be fetched from the link if it has not been fetched before:
    if (!window.productListFetched) {
        fetch("https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json")
            .then(res => res.json())
            .then(data => {
                console.log("Product list:", data);
                window.productListFetched = true; 
            })
            .catch(err => console.error("Fetch error:", err));
    } else {
        console.log("Daha önce fetch yapıldı. Beğenilen ürünler yükleniyor.");
    }
    
    // In this section, I will add the HTML, CSS and event codes I need to add:
    function run($) {
        $(() => {
          (() => {
            const init = () => {
              buildHTML();
              buildCSS();
              setEvents();
            };
    
            const buildHTML = () => {
              const html = `
                <div class="banner">
                    <div class="container-products">
                        <div class="banner-title-container">
                            <h2 class="banner-title">Beğenebileceğinizi Düşündüklerimiz</h2>
                        </div>
                        <div class="banner-products">
                            <img />
                            <div class="product-info"></div>
                            <div class="product-add-button">Sepete Ekle</div>
                        </div>
                    </div>
                </div>
              `;
              $('body').append(html);
            };
    
            const buildCSS = () => {
              const css = `
                  .banner {
                      padding: 0px 15px;
                  }
                  .banner-title-container {
                      background-color: #fef6eb;
                      font-family: Quicksand-Bold;
                      padding: 25px 67px;
                      border-top-left-radius: 35px;
                      border-top-right-radius: 35px;
                  }
                  .banner-title {
                      color: #f28e00;
                      font-size: 3rem;
                  }
                .product-add-button {
                  background-color: red;
                  height: 100px;
                  width: 100px;
                }
              `;
              $('<style>').html(css).appendTo('head');
            };
    
            const setEvents = () => {
              $('.product-add-button').on('click', () => {
                console.log('Product Added.');
              });
            };
    
            init();
          })();
        });
  }
})();

// TODO!: 
//  1- Add 'Çok Satan' and 'Yıldız Ürün' PNG into product img.
//  2- Add star ratings.
