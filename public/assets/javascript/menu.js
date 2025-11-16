export function toggleMenu() {
    const navMenuIcon = document.getElementById('navMenuIcon');
    const navTop = document.querySelector('.navTopWrap');
    if (navMenuIcon && navTop) {
        navMenuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navTop.classList.contains('menu-open');
            if (isOpen) {
                navTop.classList.remove('menu-open');
                navMenuIcon.classList.remove('fa-xmark');
                navMenuIcon.classList.add('fa-bars');
            }
            else {
                navTop.classList.add('menu-open');
                navMenuIcon.classList.remove('fa-bars');
                navMenuIcon.classList.add('fa-xmark');
            }
        });
        // Remove .menu-open on resize > 968px
        window.addEventListener('resize', () => {
            if (window.innerWidth > 968) {
                navTop.classList.remove('menu-open');
                navMenuIcon.classList.remove('fa-xmark');
                navMenuIcon.classList.add('fa-bars');
            }
        });
    }
}
//# sourceMappingURL=menu.js.map