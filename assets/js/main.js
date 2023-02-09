fetch("https://api.github.com/users/tasbaris/repos")
  .then(function (response) {
    return response.json();
  })
  .then(function (repos) {
    let output = "<ul>";

    repos.forEach(function (repo) {
      output += "<li>Repo Name : " + repo.name + "</li>";
      output += "<ul>";
      output +=
        "<li>Language : " + ((repo.language == null) ? "JSON" : repo.language)
        + "</li>";
      output +=
        '<li>Link : <a target="_blank" href="' +
        repo.html_url +
        '">Go To Project</a></li>';
      output += "</ul>";
    });

    output += "</ul>";

    //document.getElementById("projects").innerHTML += output;
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
