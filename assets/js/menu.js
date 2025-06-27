document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const menu = document.getElementById('menu');
  const menuLinks = menu.querySelectorAll('a');

  function openMenu() {
    menu.classList.add('show');
    menuToggle.style.display = 'none';
    menuClose.style.display = 'block';
  }

  function closeMenu() {
    menu.classList.remove('show');
    menuToggle.style.display = 'block';
    menuClose.style.display = 'none';
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  // Cierra el menú al hacer clic en un enlace (solo en mobile)
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });
});
