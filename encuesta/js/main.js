$(document).ready(function() {
      
      // Menu Box Toggle
      var $toggleMenu = $('.toggle-menu'),
          $menuBox = $('.menu-box'),
          $iframebox = $('.iframebox'),
          $iframe = $iframebox.children('iframe');

      
      // Change iframe
      var $fullBtn = $('.full-btn'),
          $mediumBtn = $('.medium-btn'),
          $smallBtn = $('.small-btn');
      
      $fullBtn.click(function() {
         $iframebox.attr('id','fullframe');
      });
      $mediumBtn.click(function() {
         $iframebox.attr('id','mediumframe');
      });
      $smallBtn.click(function() {
         $iframebox.attr('id','smallframe');
      });

      //
      $(".change-layout a").on("click", function(e){
         e.preventDefault();
         console.log($(this).attr('href'))
         $iframe.attr('src',$(this).attr('href'));
         $(".change-layout a").removeClass('selected');
         $(this).addClass('selected');
      });

      // Set height
      $iframe.height(2000)
      // $('iframe').load(function() {
      //   this.style.height = this.contentWindow.document.body.offsetHeight + 'px';
      // });

});