(() => {
    // I add that block because ebebek does not have jquery:
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.onload = () => run(window.jQuery);
    document.head.appendChild(script);
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
            <div class="container-berfin">
              <h1>Deneme</h1>
            </div>
          `;
          $('body').append(html);
        };

        const buildCSS = () => {
          const css = `
            .container-berfin {
              background-color: red;
              height: 100px;
              width: 100px;
            }
          `;
          $('<style>').html(css).appendTo('head');
        };

        const setEvents = () => {
          $('.container-berfin').on('click', () => {
            console.log('clicked');
          });
        };

        init();
      })();
    });
  }
})();
