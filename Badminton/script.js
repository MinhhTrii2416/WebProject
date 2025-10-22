window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        // Bạn có thể thêm một class để thay đổi style khi cuộn
        // Ví dụ: header.classList.add('scrolled');
    } else {
        // header.classList.remove('scrolled');
    }
});
