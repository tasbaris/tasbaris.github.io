async function nav() {
    var nav_ul = document.getElementById("nav-ul");
    var nav = document.getElementById("nav");
    var btn = document.getElementById("hamburger")
    
    if (!nav.classList.contains("nav-active")) {
      nav.classList.add("nav-active");
      btn.style.transform = "rotate(90deg)";
    } else {
      nav.classList.remove("nav-active");
      btn.style.transform = "rotate(0deg)";
    }
  }
  
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".header");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});