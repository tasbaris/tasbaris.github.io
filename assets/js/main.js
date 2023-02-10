fetch("https://api.github.com/users/tasbaris/repos")
  .then(function (response) {
    return response.json();
  })
  .then(function (repos) {
    let count = 0;
    repos.forEach(function (repo) {
      count+=1;
    let output = '<div class="repo-card">';
      output += '<img class="repo-img" src="./assets/img/logo.webp" alt="Repo-Image">';
      output += '<div class="repo-info">';
      output += '<h3 class="repo-name">'+repo.name+'</h3>';
      output += '<p class="repo-description">'+repo.description+'</p>';
      output += '</div>';
      output += '<a target="_blank" href="'+repo.html_url+'" class="repo-link"><i class="fa-sharp fa-solid fa-circle-right"></i></a>';
      output += "</div>";
      document.getElementById("repos").innerHTML += output;
    });

    document.querySelector(".repo-count").textContent=count.toString()+" adet bulundu!";
  });

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
