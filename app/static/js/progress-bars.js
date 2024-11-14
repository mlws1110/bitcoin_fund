document.addEventListener('DOMContentLoaded', function() {
    // Initialize all progress bars
    document.querySelectorAll('.progress-bar[data-progress]').forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = `${progress}%`;
        }, 100);
    });
}); 