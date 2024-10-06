
function showAlert(event) {
  event.preventDefault();
  Swal.fire({
    position: "center",  // Position au centre de la page
    icon: "info",        // Icône de type 'info'
    title: "Le site est en cours de traitement", // Message principal
    text: "Merci de revenir plus tard !",       // Message supplémentaire
    showConfirmButton: false, // Pas de bouton 'OK'
    timer: 3000               // L'alerte disparaît après 3 secondes
  });
}
function sendEmail(event) {
  event.preventDefault();

  // Récupérer les valeurs des champs
  const fullName = document.getElementById('Full-name').value.trim();
  const email = document.getElementById('Your-email').value.trim();
  const subject = document.getElementById('Your-subject').value.trim();
  const message = document.getElementById('Your-Message').value.trim();

  // Regex pour valider l'email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation des champs avant d'envoyer l'email
  if (!fullName || !email || !subject || !message) {
    Swal.fire({
      title: 'Erreur de validation',
      text: 'Veuillez remplir tous les champs avant d\'envoyer votre message.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      background: '#f8d7da'
    });
    return;
  }

  if (!emailPattern.test(email)) {
    Swal.fire({
      title: 'Email invalide',
      text: 'Veuillez saisir un email valide.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      background: '#f8d7da'
    });
    return;
  }

  // Afficher le loader
  document.querySelector(".loading").style.display = "block";

  var params = {
    to_name: 'ImmoGestion',
    from_name: fullName,
    from_email: email,
    from_subject: subject,
    message: message,
    reply_to: email
  };

  // Envoi de l'email avec EmailJS
  emailjs.send("service_v19cftr", "template_1x3col3", params)
    .then(function (res) {
      document.querySelector(".loading").style.display = "none";

      Swal.fire({
        title: 'Message envoyé avec succès !',
        text: 'Votre message a bien été envoyé à ImmoGestion. Nous vous répondrons dès que possible.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        background: '#f4f4f4'
      });

      document.getElementById('form').reset();  // Efface le formulaire
    })
    .catch(function (err) {
      document.querySelector(".loading").style.display = "none";

      Swal.fire({
        title: 'Erreur lors de l\'envoi',
        text: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.',
        icon: 'error',
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#d33',
        background: '#f8d7da'
      });

      console.error('Détails de l\'erreur : ', err);
    });
}
(function() {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 10
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Clients Slider
   */
  new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        aos_init();
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfokio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },

      1200: {
        slidesPerView: 3,
      }
    }
  });

  /**
   * Animation on scroll
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();



  
})();