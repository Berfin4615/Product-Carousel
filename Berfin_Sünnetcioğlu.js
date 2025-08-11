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
                    // Added Data to Jquery to use it in buildHTML:
                    script.onload = () => run(window.jQuery, data);
                    document.head.appendChild(script);

                })
                .catch(err => console.error("Fetch error:", err));
        } else {
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
                            <div class="banner">
                                <div class="banner-title-container">
                                    <h2 class="banner-title">Beğenebileceğinizi Düşündüklerimiz</h2>
                                </div>
                                <div class="container-products"></div>
                            </div>
                            `;
                        $('body').append(html);

                        // I separated it into two different HTML formats. This way, the banner title is not repeated for each product.
                        data.forEach(product => {
                            const productHtml = `
                                <div class="banner-products">
                                    <img class="product-image" src="${product.img}" alt="${product.name.trim()}" />
                                    <div class="product-info">
                                        <div class="product-title"><b>${product.brand} -</b> ${product.name} </div>
                                        <div class="product-price"><b>${product.price} TL</b></div>
                                    </div>
                                    <div class="padding-before-button"></div>
                                    <div class="product-add-button"><b>Sepete Ekle</b></div>
                                </div>
                            `;
                            $('.container-products').append(productHtml);
                        });
                };
        
                const buildCSS = () => {
                  const css = `
                        .banner {
                          padding: 0px 15px;
                          width: 100%;
                          margin-bottom: 1000px;
                        }
                        .container-products {
                            display: flex;
                            flex-wrap: nowrap;
                            overflow: hidden;
                            box-shadow: 15px 15px 30px 0 #ebebeb80;
                            border-bottom-left-radius: 35px;
                            border-bottom-right-radius: 35px;
                            background-color: #fff;
                            width: 4000px;
                        }
                        .banner-products {
                            margin-right: 20px;
                            margin-top: 20px;
                            margin-bottom: 20px;
                            width: 250px;
                            border: 1px solid #ededed;
                            border-radius: 10px;
                            display: block;
                            padding: 5px;
                            text-align: center;
                        }
                        .product-image {
                            margin-bottom:45px;
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
                        .product-info {
                            min-height: 70px; 
                            padding: 0 17px 17px;
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
                        }
                        .padding-before-button {
                            height: 70px;
                        }
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
                        .product-add-button:hover {
                            color: white;
                            background-color: #f28e00;
                            cursor: pointer;
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
    } else {
        console.log("Wrong Page!");
    }
    
})();

// TODO!: 
//  1- Add 'Çok Satan' and 'Yıldız Ürün' PNG into product img.
//  2- Add star ratings.
