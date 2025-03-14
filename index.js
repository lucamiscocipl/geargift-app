$(document).ready(function () {
  $(window).on("scroll", function () {
    if (window.scrollY > 80) {
      $(".header").css("background-color", "white");
      $(".header .logo img").attr("src", "media/geargift-black.png");
      $(".page h1").css("color", "black");
      $(".logo-large img:nth-of-type(1)").attr(
        "src",
        "media/geargift-large-black.png"
      );
      $(".logo-large h1").css("color", "black");
      $(".page h1::after").css("background", "black");
      $(".page h1::before").css("background", "black");
    } else {
      $(".header").css("background-color", "transparent");
      $(".header .logo img").attr("src", "media/geargift-white.png");
      $(".page h1").css("color", "white");
      $(".logo-large img:nth-of-type(1)").attr(
        "src",
        "media/geargift-large-white.png"
      );
      $(".logo-large h1").css("color", "white");
      $(".page h1::after").css("background", "white");
      $(".page h1::before").css("background", "white");
    }
  });
});
