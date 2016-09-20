/*
* Flex Pulldown.js - jQuery plugin
* Flexible pulldown menu using jQuery, CSS
*
* Name:  Flex Pulldown.js
* Author:  Takuma Misumi
* Date:  March 9, 2016
* Version:  1.1.2
* Example:  http://mismith0227.github.io/flex-pulldown/
*
*/

;(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {
  var namespace = 'flex-pulldown';
  var _ = {
    init : function( options ) {

      options = $.extend({
        showNum: true,
        sp: true,
        breakwidth: 420
      }, options);

      _.settings = {
         state: false,
         class: {
           wrap: 'flex-pulldown',
           menu: 'flex-pulldown-menu',
           more: 'flex-pulldown-more',
           list: 'flex-menu-li',
           hideli: 'menu-hidden',
           visible: 'flex-pulldown-more-visible',
           addul: 'flex-pulldown-add-menu'
        }
      };

      return this.each(function() {

        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);

        options = $.extend({}, options);
          $this.data(namespace, {
          options: options
        });

        _.setup.call(_this);
        _.flexevent.call(_this);
        $(window).on('resize', function(){
          _.flexevent.call(_this);
        });

      });

    },

    setup : function () {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;

      $this.addClass(_.settings.class.wrap);

      // more以外のリストにclassをつける
      var $lists = $this.find('.' + _.settings.class.menu).find('> li');
      $lists.not('.' + _.settings.class.more).addClass(_.settings.class.list);
      var $menuLi = $this.find('.' + _.settings.class.list);

      // more以外のリストの数
      _.listNum = $menuLi.length;

      // calc breakpoint
      var sl = 0;
      _.bp = [];
      for (var i = 0; i < _.listNum; i++) {
        sl += $menuLi.eq(i).outerWidth(true);
        _.bp.push(sl);
      }

      _.more = $this.find('.' + _.settings.class.more)

      _.toggle.call(_this);

      // pulldown style
      if (options.showNum) _.showNum.call(_this);
      var lh = $this.find('.' + _.settings.class.more).height();
      $('.' + _.settings.class.addul).css({
        'top': lh
      });
    },


    flexevent : function() {
      // Calculation of the allowable width
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;

      var oW = $this.width();
      var iW = 0;
      $this.children().each(function(i){
        iW += $this.children().not('.' + _.settings.class.menu).eq(i).outerWidth(true);
        i++;
      });

      // 許容幅の計算
      var reqspace = oW - iW - 10;

      // 隠れいてないリストの幅の合計
      var resumlist = 0;
      for (var i = 0; i < _.listNum; i++) {
        resumlist += $this.find('.' + _.settings.class.list).not('.' + _.settings.class.hideli).eq(i).outerWidth(true);
      }

      if ($this.find('.' + _.settings.class.more).hasClass(_.settings.class.visible)) {
        resumlist += $this.find('.' + _.settings.class.more).outerWidth(true);
      }

      // 許容幅ないにあるブレイクポイントを抽出（ここちょっと問題）
      var bkspace = $.grep(_.bp, function(elem, index) {
        return (elem < reqspace);
      });

      var nowLength = $this.find('.' + _.settings.class.list).not('.' + _.settings.class.hideli).length;

      // add pulldown
      _.addpulldown.call(_this, bkspace, reqspace, resumlist);

      // remove pulldown
      _.removepulldown.call(_this, nowLength, reqspace);

      if($this.find('.' + _.settings.class.hideli).get(0)) {
        $this.find('.' + _.settings.class.more).addClass(_.settings.class.visible);
      }

      if (options.showNum) _.countNum.call(_this);

    },

    addpulldown : function(bkspace, reqspace, resumlist) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var w = $(window).width();

      var tl = $this.find('.' + _.settings.class.list);
      var al = $this.find('.' + _.settings.class.addul);

      if (options.sp && w <= options.breakwidth) {
        tl.prependTo('.' + _.settings.class.addul);
        al.find('> li').addClass(_.settings.class.hideli);
        $this.find('.' + _.settings.class.more).addClass(_.settings.class.visible);
      } else if (reqspace < resumlist) {
        tl.slice(bkspace.length - 1).prependTo(al);
        $this.find('.' + _.settings.class.addul).find('> li').addClass(_.settings.class.hideli);
      }
    },

    removepulldown : function(nowLength, flexspace) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var w = $(window).width();

      var rt = $this.find('.' + _.settings.class.more);

      if (!options.sp || options.sp && w > options.breakwidth) {
        if (flexspace >= _.bp[nowLength + 1] && _.listNum - 2 > nowLength) {
          $this.find('.' + _.settings.class.addul).find('> li').first()
                  .removeClass(_.settings.class.hideli)
                  .insertBefore(rt);
        } else if (flexspace >= _.bp[_.listNum - 1]) {
          $this.find('.' + _.settings.class.addul).find('> li')
                  .removeClass(_.settings.class.hideli)
                  .insertBefore(rt);

          $this.find('.' + _.settings.class.more).removeClass(_.settings.class.visible);
        }
      }

    },

    toggle : function() {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;


      _.more.on('click', function(){
        if ($this.find('.' + _.settings.class.addul).hasClass('show')) {
          _.close.call(_this);
        } else {
          _.open.call(_this);
        }
        event.preventDefault();
      });

    },

    open : function() {
      var $this = $(this);
      $this.find('.' + _.settings.class.addul).addClass('show');
      $this.find('.' + _.settings.class.more).addClass('open');
    },

    close : function() {
      var $this = $(this);
      $this.find('.' + _.settings.class.addul).removeClass('show');
      $this.find('.' + _.settings.class.more).removeClass('open');
    },

    showNum : function() {
      var $this = $(this);
      _.$MenuNum = $('<span class="menu-num"></span>');
      $this.find('.' + _.settings.class.more).append(_.$MenuNum);
      $this.find('.menu-num').css({'display': 'none'});
    },

    countNum : function() {
      var _this = this;
      var $this = $(this);
      if($this.find('.' + _.settings.class.hideli).get(0)) {
        $this.find('.menu-num').css({'display': 'block'});
        _.$MenuNum.text($this.find('.' + _.settings.class.hideli).length);
      }
    }
  };

  $.fn.fxpulldown = function(method) {
    if ( _[method] ) {
      return _[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return _.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }
  };
}));
