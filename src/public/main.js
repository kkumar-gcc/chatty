$(document).ready(function () {
    $('ul.setting-bar li:first').addClass('active');
    $('.tab-content:not(:first)').hide();
    $(' ul.setting-bar li a').click(function (event) {
        event.preventDefault();
        var content = $(this).attr('href');
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');
        $(content).show();
        $(content).siblings('.tab-content').hide();
    });
    "use strict";
      var $navItems = $("ul.navbar > li").removeClass("active-page"); 

      $navItems.filter(function(){
        return $(this).find('a').prop('href') === location.href;
      }).addClass("active-page");

      $('ul.setting-bar > li').click(function(e) {
        e.preventDefault();
        $('ul.setting-bar  > li').removeClass('active');
        $(this).addClass('active');
      });
});
