function scrollToElement(elementt) {
  const element = document.querySelector(elementt);
  const topOffset = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: topOffset, behavior: "smooth" });
}

$(document).ready(function () {
  $(".product a").hide();
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

  $(".button").click(function () {
    console.log("asjd");
    scrollToElement(".divider-2");
  });
});

$(".vendor:nth-of-type(1)").click(function () {
  window.location.href = "andymark.html";
});

$(".vendor:nth-of-type(2)").click(function () {
  window.location.href = "tetrix.html";
});

$(".vendor:nth-of-type(3)").click(function () {
  window.location.href = "rev.html";
});
$(".vendor:nth-of-type(4)").click(function () {
  window.location.href = "gobilda.html";
});

$(".product").hover(
  function () {
    $(this).find("h1").hide();
    $(this).find("a").fadeIn();
  },
  function () {
    $(this).find("a").hide();
    $(this).find("h1").fadeIn();
  }
);

$(".logo-large").click(function () {
  window.location.href = "index.html";
});
