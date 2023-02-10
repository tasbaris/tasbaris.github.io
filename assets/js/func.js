async function nav() {
    var nav_ul = document.getElementById("nav-ul");
    var nav = document.getElementById("nav");
    var btn = document.getElementById("hamburger")
    var header = document.querySelector(".header");
    if (nav_ul.className === "") {
      header.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      nav_ul.className += "responsive";
      nav.style.display = "flex";
      btn.style.transform = "rotate(180deg)";
    } else {
      btn.style.transform = "rotate(0deg)"; 
      nav.style.display = "none"; 
      nav_ul.className = "";
      header.style.backgroundColor = "";
    }
  }
  
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".header");
  if (window.scrollY > 0) {
    navbar.style.borderBottom = "2px solid rgba(0,0,0,0.3)";
    navbar.style.backgroundColor = "#37373735";
  }
   else {
    navbar.style.borderBottom = "";
    navbar.style.backgroundColor = "";
  }
});