document.addEventListener("DOMContentLoaded", function () {
  // Initialize Slider
    const initSlider = () => {
        // Select slide buttons, image list, and gallery wrapper
        const slideButtons = document.querySelectorAll(".slide-button");
        const imageList = document.querySelector(".image-list");
        const galleryWrap = document.querySelector(".gallary-Wrap");

        // Check if required elements exist
        if (!imageList || !galleryWrap || slideButtons.length === 0) {
            console.warn("One or more slider elements not found.");
            return;
        }

        // Function to scroll images
        const scrollImages = (direction) => {
            const scrollAmount = galleryWrap.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        };

        // Attach click event listeners to slide buttons
        slideButtons.forEach(button => {
            button.addEventListener("click", () => {
                const direction = button.id === "prev-slide" ? -1 : 1;
                scrollImages(direction);
            });
        });
    };

    // Initialize the slider
    initSlider();


  // Hamburger Menu
  const hamburger = document.querySelector(".hamburger");
  const navCollapse = document.querySelector(".navbar-collapse");

  if (hamburger && navCollapse) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active");
      navCollapse.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
      if (!hamburger.contains(event.target) && !navCollapse.contains(event.target)) {
        hamburger.classList.remove("active");
        navCollapse.classList.remove("show");
      }
    });
  } else {
    console.warn("Hamburger or navbar-collapse elements not found.");
  }

  // Secondary Slider (for .slides)
  const slides = document.querySelector(".slides");
  const images = slides ? slides.querySelectorAll(".img") : [];
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  if (slides && images.length > 0 && prevButton && nextButton) {
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentSlideWidth = images[0].clientWidth;

    function updateSlidePosition() {
      slides.style.transform = `translateX(-${currentIndex * currentSlideWidth}px)`;
    }

    function changeSlide(direction) {
      currentIndex += direction;
      if (currentIndex < 0) {
        currentIndex = images.length - 1;
      } else if (currentIndex >= images.length) {
        currentIndex = 0;
      }
      updateSlidePosition();
    }

    prevButton.addEventListener("click", function () {
      changeSlide(-1);
    });

    nextButton.addEventListener("click", function () {
      changeSlide(1);
    });

    window.addEventListener("resize", function () {
      currentSlideWidth = images[0].clientWidth;
      updateSlidePosition();
    });

    slides.addEventListener("mousedown", startDrag);
    slides.addEventListener("mouseup", endDrag);
    slides.addEventListener("mouseleave", endDrag);
    slides.addEventListener("mousemove", drag);

    slides.addEventListener("touchstart", startDrag);
    slides.addEventListener("touchend", endDrag);
    slides.addEventListener("touchmove", drag);

    function startDrag(event) {
      isDragging = true;
      startPos = getPositionX(event);
      animationID = requestAnimationFrame(animation);
      slides.classList.add("grabbing");
    }

    function endDrag() {
      isDragging = false;
      cancelAnimationFrame(animationID);
      const movedBy = currentTranslate - prevTranslate;

      if (movedBy < -100 && currentIndex < images.length - 1) {
        currentIndex += 1;
      }

      if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
      }

      setPositionByIndex();
      slides.classList.remove("grabbing");
    }

    function drag(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }

    function getPositionX(event) {
      return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
      slides.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
      currentTranslate = currentIndex * -currentSlideWidth;
      prevTranslate = currentTranslate;
      setSliderPosition();
    }
  } else {
    console.warn("Secondary slider elements not found or no images available.");
  }

  // FAQ Toggle
  window.toggleAnswer = function (element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector(".toggle-icon");
    const h4 = element.querySelector(".faq-question h4");

    if (answer && icon && h4) {
      if (answer.style.display === "block") {
        answer.style.display = "none";
        icon.textContent = "+";
        icon.style.color = "black";
        h4.style.color = "black";
      } else {
        answer.style.display = "block";
        icon.textContent = "-";
        icon.style.color = "red";
        h4.style.color = "rgb(15, 35, 151)";
      }
    }
  };

  // WhatsApp Button Scroll Behavior
  const button = document.getElementById("toggleBtn1");
  let lastScrollTop = 0;

  if (button) {
    window.addEventListener("scroll", function () {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop < lastScrollTop) {
        button.style.bottom = "25px";
      } else {
        button.style.bottom = "5px";
      }
      lastScrollTop = scrollTop;
    });
  } else {
    console.warn("WhatsApp button not found.");
  }

  // GSAP Animations (assuming GSAP and ScrollTrigger are included)
  if (typeof gsap !== "undefined") {
    if (document.querySelector(".small h2")) {
      gsap.from(".small h2", {
        duration: 0.6,
        x: -500,
      });
    } else {
      console.warn("GSAP target .small h2 not found.");
    }

    if (document.querySelector(".moving-div .move")) {
      gsap.to(".moving-div .move", {
        transform: "translateX(-100%)",
        repeat: -1,
        duration: 20,
        ease: "none",
      });
    } else {
      console.warn("GSAP target for moving-div not found.");
    }

    gsap.from(".footer h3", {
      x: -900,
      scrollTrigger: {
        trigger: ".footer",
        scroller: "body",
        start: "top 60%",
        end: "top 80%",
        scrub: 5,
      },
    });
  } else {
    console.warn("GSAP library not loaded.");
  }

  // Initialize the slider
  initSlider();
});