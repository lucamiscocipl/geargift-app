$(document).ready(function () {
  if (window.innerWidth > 480) {
    $(".product a").hide();
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
  } else $(".product a").show();
  $(".logo-large").click(function () {
    window.location.href = "../index.html";
  });

  $("#home").click(function () {
    window.location.href = "../index.html";
  });

  $("#contact").click(function () {
    window.location.href = "../inquiries.html";
  });
  $("#home-mb").click(function () {
    window.location.href = "../index.html";
  });

  $("#contact-mb").click(function () {
    window.location.href = "../inquiries.html";
  });

  $(".logo-sm").click(function () {
    window.location.href = "../index.html";
  });
});
