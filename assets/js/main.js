// Mobile Navigation Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const icon = mobileBtn.querySelector('i');
  
  if (navLinks.classList.contains('active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links > a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const icon = mobileBtn.querySelector('i');
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  });
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(0, 0, 0, 0.95)";
    navbar.style.borderBottom = "1px solid var(--border-hover)";
  } else {
    navbar.style.background = "rgba(0, 0, 0, 0.85)";
    navbar.style.borderBottom = "1px solid var(--border)";
  }
});

// Fetch GitHub Repositories
const fetchRepos = async () => {
  const container = document.getElementById('github-repos');
  const countLabel = document.getElementById('repo-count');
  
  try {
    // Fetch repositories sorted by updated date
    const response = await fetch("https://api.github.com/users/tasbaris/repos?sort=updated&per_page=100");
    if (!response.ok) throw new Error("Failed to fetch repos");
    
    const repos = await response.json();
    let count = 0;
    container.innerHTML = '';

    repos.forEach(repo => {
      // Exclude forks to show only original work
      if (!repo.fork) {
        count++;
        const description = repo.description || "A personal project developed and open-sourced on GitHub.";
        const date = new Date(repo.updated_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
        
        const repoHTML = `
          <div class="project-card reveal">
            <div class="project-header">
              <i class="fa-regular fa-folder project-icon"></i>
              <div class="project-links">
                <a href="${repo.html_url}" target="_blank" aria-label="View Source on GitHub">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>
            <h3 class="project-title">
              <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </h3>
            <p class="project-desc">${description}</p>
            <div class="project-footer">
              <span>${date}</span>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', repoHTML);
      }
    });

    countLabel.textContent = `Showing ${count} original repositories`;

    // Observe newly added project cards
    if (window.revealObserver) {
      container.querySelectorAll('.project-card').forEach(el => {
        window.revealObserver.observe(el);
      });
    }

  } catch (error) {
    console.error("GitHub API Error:", error);
    container.innerHTML = `
      <div style="grid-column: 1 / -1; color: var(--text-muted); border: 1px solid var(--border); padding: 24px; border-radius: 6px;">
        <p>Unable to load repositories. You might have hit the GitHub API rate limit.</p>
        <a href="https://github.com/tasbaris" target="_blank" style="color: var(--text-main); text-decoration: underline; margin-top: 10px; display: inline-block;">
          View my projects directly on GitHub
        </a>
      </div>
    `;
    countLabel.textContent = '';
  }
};

// Scroll Reveal Animation Logic
const initScrollReveal = () => {
  const elementsToReveal = document.querySelectorAll('.section-title, .skill-category, .blog-card');
  elementsToReveal.forEach(el => el.classList.add('reveal'));

  window.revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  document.querySelectorAll('.reveal').forEach(el => {
    window.revealObserver.observe(el);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  fetchRepos();
});
