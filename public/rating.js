const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating');
const ratingResult = document.getElementById('rating-result');

stars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = star.getAttribute('data-value');
        ratingInput.value = rating; // Set the selected rating in the hidden input

        // Highlight the selected stars
        stars.forEach(s => s.classList.remove('selected'));
        star.classList.add('selected');
        let previousStar = star.previousElementSibling;
        while (previousStar) {
            previousStar.classList.add('selected');
            previousStar = previousStar.previousElementSibling;
        }
        ratingResult.textContent = `You rated this ${rating} star${rating > 1 ? 's' : ''}.`;
    });
});



function closeModal() {
    document.querySelector('.card').style.display = 'none'; // Or remove from DOM
}




