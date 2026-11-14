'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.custom-nav-link');
    const navbarCollapse = document.getElementById('navbarNav');

    if (navbarCollapse && window.bootstrap) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse) 
                        || new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
                    bsCollapse.hide();
                }
            });
        });
    }
});

