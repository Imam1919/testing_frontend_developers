// footer.js
const footerHTML = `
<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-left">
      <img src="/uploads/MTG_logo/MTG_BYR.svg" alt="Logo" class="footer-logo" />
      <div class="social-icons">
        <a href="#"><img src="/uploads/social_media/facebook.svg" alt="Facebook" /></a>
        <a href="#"><img src="/uploads/social_media/tiktok.svg" alt="TikTok" /></a>
        <a href="#"><img src="/uploads/social_media/instagram.svg" alt="Instagram" /></a>
        <a href="#"><img src="/uploads/social_media/x.svg" alt="X" /></a>
      </div>
    </div>
    <div class="footer-links">
      <div>
        <h4>SUPPORT</h4>
        <a href="#">Tour Listing</a>
        <a href="#">About Us</a>
        <a href="#">Contact Us</a>
      </div>
      <div>
        <h4>COMPANY</h4>
        <a href="#">Terms and Conditions</a>
        <a href="#">Privacy policy</a>
      </div>
      <div>
        <h4>CONTACT US</h4>
        <p>📞 +60 12–6265328</p>
        <p>📧 malaysiatravelgate@gmail.com</p>
        <p>🕐 24/7 Customer Support</p>
        <p>📍 No 11A–2, Jalan PDR 6, Kawasan Perniagaan Desa Ria,<br>Off Jalan Balakong, 43300, Seri Kembangan, Selangor, Malaysia.</p>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    © 2025 Malaysia Travel Gate
  </div>
</footer>
`;

// Function to load footer
function loadFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHTML;
  }
}

// Load footer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFooter);
} else {
  loadFooter();
}