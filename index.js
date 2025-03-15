function scrollToElement(elementt) {
  const element = document.querySelector(elementt);
  const topOffset = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: topOffset, behavior: "smooth" });
}

$(document).ready(function () {
  $(window).on("scroll", function () {
    if (window.scrollY > 80) {
      $("#main-header").css("background-color", "white");
      $("#main-header .logo img").attr("src", "media/geargift-black.png");
      $("#main-header .page h1").css("color", "black");
      $("#main-header .logo-large img:nth-of-type(1)").attr(
        "src",
        "media/geargift-large-black.png"
      );
      $("#main-header .logo-large h1").css("color", "black");
      $("#main-header .page h1::after").css("background", "black");
      $("#main-header .page h1::before").css("background", "black");
    } else {
      $("#main-header").css("background-color", "transparent");
      $("#main-header .logo img").attr("src", "media/geargift-white.png");
      $("#main-header .page h1").css("color", "white");
      $("#main-header .logo-large img:nth-of-type(1)").attr(
        "src",
        "media/geargift-large-white.png"
      );
      $("#main-header .logo-large h1").css("color", "white");
      $("#main-header .page h1::after").css("background", "white");
      $("#main-header .page h1::before").css("background", "white");
    }
  });

  $(".button").click(function () {
    scrollToElement(".divider-2");
  });
});

$(".vendor:nth-of-type(1)").click(function () {
  window.location.href = "vendors/andymark.html";
});

$(".vendor:nth-of-type(2)").click(function () {
  window.location.href = "vendors/tetrix.html";
});

$(".vendor:nth-of-type(3)").click(function () {
  window.location.href = "vendors/rev.html";
});
$(".vendor:nth-of-type(4)").click(function () {
  window.location.href = "vendors/gobilda.html";
});

$(".logo-large").click(function () {
  window.location.href = "index.html";
});

$("#home").click(function () {
  window.location.href = "index.html";
});

$("#contact").click(function () {
  window.location.href = "inquiries.html";
});

$(".logo-sm").click(function () {
  window.location.href = "index.html";
});
$("#home-mb").click(function () {
  window.location.href = "../index.html";
});

$("#contact-mb").click(function () {
  window.location.href = "../inquiries.html";
});
