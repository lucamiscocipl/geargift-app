function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("active");
}

$(".hamburger").click(function () {
  toggleMenu();
});
$("#mobileMenu a:nth-of-type(1)").click(function () {
  toggleMenu();
});
