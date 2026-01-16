document.addEventListener("DOMContentLoaded", function () {
    const moreInfoBtn = document.getElementById("moreInfoBtn");

    if (moreInfoBtn) {
        moreInfoBtn.addEventListener("click", function () {
            window.location.href = "doctorinfoindex.html";
        });
    }
});


//--- GSAP Contact Header ---
function initContactAnim() {
  if (typeof gsap === "undefined") return;

  gsap.from(".head h2",{
  duration:0.7,
  opacity:0,
  x : -1000,
  stagger:1,
});

//   gsap.from(".small h2", {
//     duration: 0.6,
//     x: -500,
//   });
}

document.addEventListener("DOMContentLoaded", () => {
    initContactAnim();
  });

