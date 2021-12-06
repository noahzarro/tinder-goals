$(document).ready(function() {

    $.get('goals.json', (res)=>{
      res.reverse().forEach(goal => {
        $(".demo__card-cont").append(
          $('<div/>', {'class': 'demo__card'}).append(
              $('<div/>', {'class': 'demo__card__top ' + goal.color}).append(
                  $('<div/>', {'class': 'demo__card__name', text: goal.id})
              )
          )
          .append(
              $('<div/>', {'class': 'demo__card__btm'}).append(
                  $('<div/>', {'class': 'demo__card__we', text: goal.content})
              )
          )
      );
      });
    })

    var animating = false;
    var cardsCounter = 0;
    var numOfCards = 6;
    var decisionVal = 80;
    var pullDeltaX = 0;
    var deg = 0;
    var $card, $cardReject, $cardLike;
  
    function pullChange() {
      animating = true;
      deg = pullDeltaX / 10;
      $card.css("transform", "translateX("+ pullDeltaX +"px) rotate("+ deg +"deg)");
  
      var opacity = pullDeltaX / 100;
      var rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
      var likeOpacity = (opacity <= 0) ? 0 : opacity;
      $cardReject.css("opacity", rejectOpacity);
      $cardLike.css("opacity", likeOpacity);
    };
  
    function release() {
  
      if (pullDeltaX >= decisionVal) {
        $card.addClass("to-right");
        console.log($card.find(".demo__card__we").text(), "swiped right")
      } else if (pullDeltaX <= -decisionVal) {
        $card.addClass("to-left");
        console.log($card.find(".demo__card__we").text(), "swiped left")
      }
      
      if (Math.abs(pullDeltaX) >= decisionVal) {
        $card.addClass("inactive");
  
        setTimeout(function() {
          //$card.addClass("below").removeClass("inactive to-left to-right");
          $card.remove()
          cardsCounter++;
          if (cardsCounter === numOfCards) {
            //cardsCounter = 0;
            //$(".demo__card").removeClass("below");
          }
        }, 300);
      }
  
      if (Math.abs(pullDeltaX) < decisionVal) {
        $card.addClass("reset");
      }
  
      setTimeout(function() {
        $card.attr("style", "").removeClass("reset")
          .find(".demo__card__choice").attr("style", "");
  
        pullDeltaX = 0;
        animating = false;
      }, 300);
    };
  
    $(document).on("mousedown touchstart", ".demo__card:not(.inactive)", function(e) {
      if (animating) return;
  
      $card = $(this);
      $cardReject = $(".demo__card__choice.m--reject", $card);
      $cardLike = $(".demo__card__choice.m--like", $card);
      var startX =  e.pageX || e.originalEvent.touches[0].pageX;
  
      $(document).on("mousemove touchmove", function(e) {
        var x = e.pageX || e.originalEvent.touches[0].pageX;
        pullDeltaX = (x - startX);
        if (!pullDeltaX) return;
        pullChange();
      });
  
      $(document).on("mouseup touchend", function() {
        $(document).off("mousemove touchmove mouseup touchend");
        if (!pullDeltaX) return; // prevents from rapid click events
        release();
      });
    });
  
  });