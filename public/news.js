gsap.from(".news-item img",{
    scale:0,
    duration:1,
    stagger : 0.11,
});
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = "block";
    modalImg.src = imageSrc;
}

// Close the modal
function closeModal() {
    document.getElementById('imageModal').style.display = "none";
}