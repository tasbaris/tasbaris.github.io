function nav() {
    var nav_ul = document.getElementById("nav-ul");
    var nav = document.getElementById("nav");
    if (nav_ul.className === "") {
      nav_ul.className += "responsive";
      nav.style.display = "flex";
    } else {
      nav.style.display = "none"; 
      nav_ul.className = "";
    }
  }