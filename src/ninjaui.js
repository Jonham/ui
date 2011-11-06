/*copyright 2008-2011 Jamie Hoover*/

/*jshint bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: true*/

(function ($) {

  'use strict';

  $('<link/>', {
    rel: 'stylesheet',
    href: '../src/ninjaui.css'
  }).appendTo('head');

  var
    counter = 0,
    ninja = $.sub();

  function uniqueNumber() {
    return counter ++;
  }

  ninja.fn.extend({

    defaults: {
      radius: '0.35em'
    },

    button: function (options) {
      options = $.extend({
        radius: ninja().defaults.radius
      }, options);
      var $button = $.ninja('<span/>', {
        'class': 'ninja'
      });
      if (options.radius) {
        $button.round({
          radius: options.radius
        });
      }
      if (options.css) {
        $button.css(options.css);
      }
      if (options.html) {
        $button.html(options.html);
      }
      $button.bind({
        'click.ninja': function () {
          if (!$button.is('.ninja-state-disabled')) {
            if ($button.is('.ninja-state-selected')) {
              $button.trigger('deselect.ninja');
            }
            else {
              $button.trigger('select.ninja');
            }
          }
        },
        'deselect.ninja': function () {
          $button.removeClass('ninja-state-selected');
        },
        'mouseenter.ninja': function () {
          if (!$button.is('.ninja-state-disabled')) {
            $button.addClass('ninja-state-hovered');
          }
        },
        'mouseleave.ninja': function () {
          if (!$button.is('.ninja-state-disabled')) {
            $button.removeClass('ninja-state-hovered');
          }
        },
        'select.ninja': function () {
          $button.addClass('ninja-state-selected');
        }
      });
      if (options.select) {
        $button.trigger('select.ninja');
      }
      if (options.disable) {
        $button.disable();
      }
      return $button;
    },

    change: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(callback)) {
          $object.bind('change.ninja', callback);
        }
        else {
          $object.trigger('change.ninja');
        }
      });
    },

    deselect: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if (callback && $.isFunction(callback)) {
          $object.bind('deselect.ninja', callback);
        }
        else if ($object.is('.ninja-state-selected') && !$object.is('.ninja-state-disabled')) {
          $object.trigger('deselect.ninja');
        }
      });
    },

    detach: function () {
      this.trigger('detach.ninja');
      $.fn.detach.apply(this);
    },

    disable: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if (callback && $.isFunction(callback)) {
          $object.bind('disable.ninja', callback);
        }
        else {
          $object.fadeTo('fast', 0.25).addClass('ninja-state-disabled').trigger('disable.ninja');
        }
      });
    },

    drawer: function (options) {
      options = $.extend({
        radius: ninja().defaults.radius,
        texture: ninja().defaults.texture
      }, options);
      var
        $tray = $('<div/>', {
          'class': 'ninja-drawer-tray',
          css: options.css,
          html: options.html
        }).ninja().round({
          corners: 'bottom',
          radius: options.radius
        }),
        $icon = $('<span/>', {
          'class': 'ninja-icon ninja-icon-arrow-right'
        }),
        $handle = $.ninja().button($.extend(options, {
          select: options.select,
          html: options.title
        })).addClass('ninja-drawer-handle').bind({
          'deselect.ninja': function () {
            $tray.slideUp('fast', function () {
              if (options.radius) {
                $handle.ninja().round({
                  radius: options.radius
                });
              }
            });
          },
          'select.ninja': function () {
            if (options.radius) {
              $handle.ninja().round({
                corners: 'top',
                radius: options.radius
              });
            }
            $tray.slideDown('fast');
          }
        }).prepend($icon, ' '),
        $drawer = $('<div/>', {
          'class': 'ninjaDrawer'
        }).append($handle, $tray);
      if (options.select) {
        if (options.radius) {
          $handle.ninja().round({
            corners: 'top',
            radius: options.radius
          });
        }
      }
      else {
        $tray.hide();
      }
      return $drawer;
    },

    enable: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('enable.ninja', callback);
        }
        else {
          $object.fadeTo('fast', 1).removeClass('ninjaStateDisabled').trigger('enable.ninja');
        }
      });
    },

    error: function (message, callback) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(callback)) {
          $object.bind('error.ninja', callback);
        }
        else {
          $object.trigger({
            type: 'error.ninja',
            message: message
          });
        }
      });
    },

    icon: function (options) {
      options = $.extend({
        color: $('body').css('color'),
        name: 'spin'
      }, options);
      var defs = '', g = '', mask, points, number = uniqueNumber(), idMask = number + 'Mask', idSymbol = number + 'Symbol', idVector = number + 'Vector', script = '';
      if ($.inArray(options.name, ['arrow-down', 'arrow-right']) > -1) {
        if (options.name === 'arrow-down') {
          points = '128,128 384,128 256,384';
        }
        else {
          points = '128,128 384,256 128,384';
        }
        g = '<polygon points="' + points + '"/>';
      }
      else if (options.name === 'camera') {
        defs = '<defs><mask id="' + idMask + '"><rect fill="#fff" x="0" y="0" width="512" height="512"/><circle cx="256" cy="288" r="160"/></mask></defs>';
        g = '<rect x="0" y="128" width="512" height="352" rx="64" ry="64" mask="url(#' + idMask + ')"/><polygon points="128,256 128,128 192,32 320,32 384,128 384,256" mask="url(#' + idMask + ')"/><circle cx="256" cy="288" r="96"/>';
      }
      else if ($.inArray(options.name, ['circle', 'circle-clear', 'circle-minus', 'circle-plus']) > -1) {
        if (options.name === 'circle-clear') {
          mask = '<polygon points="224,128 288,128 288,224 384,224 384,288 288,288 288,384 224,384 224,288 128,288 128,224 224,224" transform="rotate(45 256 256)"/>';
        }
        else if (options.name === 'circle-minus') {
          mask = '<rect x="128" y="224" width="256" height="64"/>';
        }
        else if (options.name === 'circle-plus') {
          mask = '<polygon points="224,128 288,128 288,224 384,224 384,288 288,288 288,384 224,384 224,288 128,288 128,224 224,224"/>';
        }
        defs = '<defs><mask id="' + idMask + '"><rect fill="#fff" x="0" y="0" width="512" height="512"/>' + mask + '</mask></defs>';
        g = '<circle cx="256" cy="256" mask="url(#' + idMask + ')" r="256"/>';
      }
      else if (options.name === 'go') {
        g = '<circle fill="none" stroke="' + options.color + '" stroke-width="64" cx="256" cy="256" r="224"/>';
      }
      else if (options.name === 'home') {
        g = '<polygon points="0,320 0,256 256,0 512,256 512,320 448,320 448,512 320,512 320,320 192,320 192,512 64,512 64,320"/><rect x="352" y="32" width="128" height="256"/>';
      }
      else if (options.name === 'mail') {
        g = '<polygon points="0,112 128,240 0,368"/><polygon points="0,80 512,80 256,336"/><polygon points="384,240 512,112 512,368"/><polygon points="0,432 0,400 144,256 256,368 368,256 512,400 512,432"/>';
      }
      else if (options.name === 'search') {
        g = '<circle fill="none" stroke="' + options.color + '" stroke-width="48" cx="200" cy="200" r="176"/><polygon points="288,352 352,288 512,448 448,512"/>';
      }
      else if (options.name === 'star') {
        g = '<polygon points="0,196 196,196 256,0 316,196 512,196 354,316 414,512 256,392 98,512 158,316"/>';
      }
      else if (options.name === 'stop') {
        g = '<polygon points="0,362 0,150 150,0 362,0 512,150 512,362 362,512 150,512"/>';
      }
      else if ($.inArray(options.name, ['triangle', 'warn']) > -1) {
        if (options.name === 'warn') {
          mask = '<polygon points="256,192 384,448 128,448"/>';
        }
        defs = '<defs><mask id="' + idMask + '"><rect fill="#fff" x="0" y="0" width="512" height="512"/>' + mask + '</mask></defs>';
        g = '<polygon mask="url(#' + idMask + ')" points="256,0 512,512 0,512"/>';
      }
      else {
        script = 'onload="var frame=0;var spin=setInterval(function(){frame=frame+30;if(frame===10800){clearInterval(spin);}document.getElementById(\'' + idVector + '\').setAttributeNS(null,\'transform\',\'rotate(\'+frame+\' 256 256)\');},100)"';
        defs = '<defs><rect id="' + idSymbol + '" x="224" rx="24" width="64" height="128"/></defs>';
        g = '<use xlink:href="#' + idSymbol + '" style="opacity:.1" transform="rotate(30 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.2" transform="rotate(60 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.3" transform="rotate(90 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.4" transform="rotate(120 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.5" transform="rotate(150 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.6" transform="rotate(180 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.7" transform="rotate(210 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.8" transform="rotate(240 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.9" transform="rotate(270 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.9.5" transform="rotate(300 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.9.75" transform="rotate(330 256 256)"/><use xlink:href="#' + idSymbol + '"/>';
      }
      var $icon = $('<svg aria-label="' + options.name + '" class="ninja-icon"' + script + ' role="img" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><title>' + options.name + '</title>' + defs + '<g fill="' + options.color + '" id="' + idVector + '">' + g + '</g></svg>');
      return $icon;
    },

    list: function (options) {
      options = $.extend({
        radius: ninja().defaults.radius,
        texture: ninja().defaults.texture
      }, options);
      var $object = this;
      var $list = $.ninja('<div/>', {
        'class': 'ninjaList'
      });
      if (options.html) {
        $list.html(options.html);
      }
      if (options.css) {
        $list.css(options.css);
      }
      $.each(options.choices, function (i, choice) {
        var $choice = $('<div/>', {
          'class': 'ninja',
          html: choice.display || choice.html || choice
        });
        if (choice.spacer) {
          $choice.addClass('ninjaListSpacer');
        }
        else {
          $choice.addClass('ninjaListChoice').bind({
            'click.ninja': function () {
              $list.trigger({
                type: 'select.ninja',
                html: choice.html || choice
              });
              /* individual select function */
              if ($.isFunction(choice.select)) {
                choice.select();
              }
            },
            'mouseenter.ninja': function () {
              $('.ninjaStateHovered', $list).removeClass('ninjaStateHovered ninjaTexturePlastic');
              $choice.addClass('ninjaStateHovered');
              if (options.texture) {
                $choice.addClass('ninjaTexturePlastic');
              }
            }
          });
        }
        $list.append($choice).bind({
          'mouseleave.ninja': function () {
            $('.ninjaStateHovered', $list).removeClass('ninjaStateHovered ninjaTexturePlastic');
          }
        });
      });
      $(document).unbind('keydown.ninja keyup.ninja').bind({
        'keydown.ninja': function (event) {
          if ($.inArray(event.keyCode, [38, 40]) > -1) {/* down or up */
            return false;/* prevents page scrolling via the arrow keys when a list is active */
          }
        },
        'keyup.ninja': function (event) {
          if ($.inArray(event.keyCode, [13, 38, 40]) > -1) {/* return, down or up */
            var $button = $('.ninjaStateHovered', $list);
            if (event.keyCode === 13) {/* return */
              $button.click();
              $(document).unbind('keydown.ninja keyup.ninja');
            }
            else if (event.keyCode === 40) {/* down arrow */
              if ($button.length) {
                $button.mouseleave();
                if ($button.nextAll('.ninjaListChoice').length) {
                  $button.nextAll('.ninjaListChoice:first').trigger('mouseenter.ninja');
                }
                else {
                  $('.ninjaListChoice:first', $list).trigger('mouseenter.ninja');
                }
              }
              else {
                $('.ninjaListChoice:first', $list).trigger('mouseenter.ninja');
              }
            }
            else if (event.keyCode === 38) {/* up arrow */
              if ($button.length) {
                $button
                  .trigger('mouseleave.ninja')
                  .prevAll('.ninjaListChoice:first').trigger('mouseenter');
              }
              else {
                $('.ninjaListChoice:last', $list).trigger('mouseenter');
              }
            }
            return false;
          }
        }
      });
      return $list;
    },

    popup: function (options) {
      options = $.extend({
        button: false,
        radius: '0.3em',
        window: false
      }, options);
      var
        $object = this,
        $popup = $.ninja('<span/>', {
          'class': 'ninjaPopup ninjaInline ninjaShadow',
          css: {
            minWidth: $object.width()
          }
        }),
        number = uniqueNumber();
      if (options.css) {
        $popup.css(options.css);
      }
      if (options.radius) {
        $popup.round({
          radius: options.radius
        });
      }
      $popup.bind({
        'detach.ninja remove.ninja': function () {
          if ($object.is('.ninjaButton.ninjaStateSelected')) {
            $object.deselect();
          }
          $(document).unbind('click.ninja' + number);
        },
        'update.ninja': function (event) {
          $popup.html(event.html);
          if (options.button) {
            var
              $button = $('<span/>', {
                'class': 'ninjaPopupButton ninjaInline ninjaShadow ninjaSymbol ninjaSymbolClear'
              }).ninja().round({
                radius: '0.6em'
              }).click(function () {
                $popup.remove();
              });
            $popup.append($button);
          }
          if (options.theme) {
            var $theme = $('<div/>', {
              'class': 'ninjaTheme' + options.theme
            }).append($popup);
            $(document.body).append($theme);
          }
          else {
            $(document.body).append($popup);
          }
          if (options.window) {
            $popup.css({
              left: ($(window).width() / 2) - ($popup.outerWidth() / 2),
              top: ($(window).height() / 2) - ($popup.outerHeight() / 2) + $(window).scrollTop()
            });
          }
          else {
            var
              offset = $object.offset(),
              $stem = $('<span/>', {
                'class': 'ninjaPopupStem ninjaSymbol ninjaSymbolTriangle'
              });
            $popup.css({
              top: offset.top + $object.outerHeight()
            });
            if (offset.left + $popup.outerWidth() > $(window).width()) {
              $popup.css({
                right: 0
              });
              $stem.css({
                right: $object.outerWidth() / 2
              });
            }
            else {
              $popup.css({
                left: offset.left
              });
              $stem.css({
                left: $object.outerWidth() / 2
              });
            }
            $popup.append($stem);
            $(document).bind('click.ninja' + number, function (event) {
              if ($popup.is(':visible')) {
                var $parents = $(event.target).parents();
                if ($.inArray($popup[0], $parents) < 0 && $object[0] !== event.target && $.inArray($object[0], $parents) < 0) {
                  $popup.detach();
                }
              }
            });
          }
          $(document).bind('keydown.ninja', function (event) {
            if (event.keyCode === 27) {/* escape */
              $popup.detach();
              $(document).unbind('keydown.ninja');
            }
          });
        }
      });
      if (options.html) {
        $popup.trigger({
          type: 'update.ninja',
          html: options.html
        });
      }
      return $popup;
    },

    rating: function (options) {
      options = $.extend({
        starsAverage: 0,
        starsUser: 0
      }, options);
      var $rating = $('<span/>', {
        'class': 'ninjaInline ninjaRating'
      }).bind({
        'mouseleave.ninja': function (event) {
          $('.ninjaStar', $rating).each(function (iStar, star) {
            var $star = $(star);
            if (iStar < options.starsAverage) {
              $star.addClass('ninjaStarAverage');
            }
            else {
              $star.removeClass('ninjaStarAverage');
            }
            if (iStar < options.starsUser) {
              $star.addClass('ninjaStarUser');
            }
            else {
              $star.removeClass('ninjaStarUser');
            }
          });
        }
      });
      $.each(options.choices, function (i, choice) {
        var iChoice = i + 1;
        var $choice = $('<span/>', {
          'class': 'ninjaStar ninjaSymbol ninjaSymbolStar'
        }).append(choice).bind({
          'mouseenter.ninja': function (event) {
            $('.ninjaStar', $rating).each(function (iStar, star) {
              var $star = $(star);
              if (iStar <= i) {
                $star.addClass('ninjaStarUser');
              }
              else {
                $star.removeClass('ninjaStarUser');
              }
            });
          },
          'click.ninja' : function () {
            options.starsUser = iChoice;
            /* individual select function */
            if (choice.select) {
              choice.select();
            }
            /* global select function */
            $rating.trigger({
              type: 'select',
              html: choice.html || choice
            });
          }
        });
        if (iChoice <= options.starsAverage) {
          $choice.addClass('ninjaStarAverage');
        }
        if (iChoice <= options.starsUser) {
          $choice.addClass('ninjaStarUser');
        }
        $rating.append($choice);
      });
      return $rating;
    },

    remove: function () {
      this.trigger('remove.ninja');
      $.fn.remove.apply(this);
    },

    round: function (options) {
      return this.each(function () {
        var $object = $(this);
        options = $.extend({
          corners: null,
          radius: '0.3em'
        }, options);
        if (options.radius) {
          var radii;
          if (options.corners === 'bottom') {
            radii = [0, 0, options.radius, options.radius];
          }
          else if (options.corners === 'bottomLeft') {
            radii = [0, 0, 0, options.radius];
          }
          else if (options.corners === 'bottomRight') {
            radii = [0, 0, options.radius, 0];
          }
          else if (options.corners === 'left') {
            radii = [options.radius, 0, 0, options.radius];
          }
          else if (options.corners === 'right') {
            radii = [0, options.radius, options.radius, 0];
          }
          else if (options.corners === 'top') {
            radii = [options.radius, options.radius, 0, 0];
          }
          else if (options.corners === 'topLeft') {
            radii = [options.radius, 0, 0, 0];
          }
          else if (options.corners === 'topRight') {
            radii = [0, options.radius, 0, 0];
          }
          else {
            radii = [options.radius, options.radius, options.radius, options.radius];
          }
          var
            borderRadius = false,
            style = document.body.style;
          if (style.borderRadius !== undefined) {
            borderRadius = 'border';
          }
          else if (style.WebkitBorderRadius !== undefined) {
            borderRadius = '-webkit-border';
          }
          else if (style.MozBorderRadius !== undefined) {
            borderRadius = '-moz-border';
          }
          if (borderRadius && borderRadius === 'border') {
            if (radii[0] === radii[1] && radii[0] === radii[2] && radii[0] === radii[3]) {
              $object.css({
                'border-radius': radii[0]
              });
            }
            else {
              $object.css({
                'border-radius': radii.join(' ')
              });
            }
          }
          else if (borderRadius && borderRadius === '-moz-border') {
            $object.css({
              '-moz-border-radius-topleft': radii[0],
              '-moz-border-radius-topright': radii[1],
              '-moz-border-radius-bottomright': radii[2],
              '-moz-border-radius-bottomleft': radii[3]
            });
          }
          else if (borderRadius && borderRadius === '-webkit-border') {
            $object.css({
              '-webkit-border-top-left-radius': radii[0],
              '-webkit-border-top-right-radius': radii[1],
              '-webkit-border-bottom-right-radius': radii[2],
              '-webkit-border-bottom-left-radius': radii[3]
            });
          }
        }
      });
    },

    select: function (event) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(event)) {
          $object.bind('select.ninja', event);
        }
        else if (!$object.is('.ninjaStateDisabled')) {
          $object.trigger('select.ninja');
        }
      });
    },

    slider: function (options) {
      options = $.extend({
        slot: 0,
        width: 200
      }, options);
      var
        drag = false,
        offsetX = 0,
        touch,
        slots = options.choices.length - 1,
        increment = options.width / slots,
        left = options.slot * increment,
        $choice = $('<span/>', {
          'class': 'ninjaSliderChoice',
          html: options.choices[options.slot].html
        }),
        $button = ninja('<span/>', {
          'class': 'ninjaSliderButton ninjaInline',
          css: {
            left: left
          }
        }).round({
          radius: '1em'
        }),
        $temp = $button.clone().css({
          display: 'none'
        }).appendTo('body'),
        buttonDiameter = $temp.outerWidth(),
        buttonRadius = buttonDiameter / 2,
        trackWidth = options.width + buttonDiameter,
        $level = ninja('<div/>', {
          'class': 'ninjaSliderLevel',
          css: {
            marginLeft: buttonRadius,
            marginRight: buttonRadius,
            width: left
          }
        }).round({
          radius: '0.3em'
        }),
        $slider = $('<span/>', {
          'class': 'ninjaInline ninjaSlider'
        }).bind({
          'change.ninja select.ninja': function (event) {
            var slot = function () {
              if (event.sliderX < 0) {
                return 0;
              }
              else if (event.sliderX > slots) {
                return slots;
              }
              else {
                return event.sliderX;
              }
            };
            event.choice = options.choices[slot()];
            $choice.html(event.choice.html);
            left = slot() * increment;
            $button.css({
              left: left
            });
            $level.css({
              width: left
            });
          },
          'select.ninja': function (event) {
            if (event.choice.select) {
              event.choice.select(event);
            }
          }
        }).append($choice),
        $track = ninja('<div/>', {
          'class': 'ninjaSliderTrack',
          css: {
            width: trackWidth
          }
        }).appendTo($slider),
        $groove = ninja('<div/>', {
          'class': 'ninjaSliderGroove',
          css: {
            marginLeft: buttonRadius,
            marginRight: buttonRadius,
            opacity: 0.25
          }
        }).round({
          radius: '0.3em'
        }).bind('click.ninja', function (event) {
          $button.trigger({
            type: 'select.ninja',
            sliderX: Math.round((event.pageX - $track.offset().left) / increment)
          });
        });
      $track.append($level, $groove, $button);
      $temp.remove();
      $choice.css({
        marginRight: buttonRadius
      });
      if (options.title) {
        $choice.before($('<span/>', {
          'class': 'ninjaSliderTitle',
          css: {
            marginLeft: buttonRadius
          },
          text: options.title + ': '
        }));
      }
      else {
        $choice.css({
          marginLeft: buttonRadius
        });
      }
      $button.bind({
        'mousedown.ninja': function (event) {
          event.preventDefault();
          offsetX = event.pageX - $button.position().left;
          drag = true;
          $(document).bind({
            'mousemove.ninja': function (event) {
              if (!drag) {
                return;
              }
              $slider.trigger({
                type: 'change.ninja',
                sliderX: Math.round((event.pageX - offsetX) / increment)
              });
            },
            'mouseup.ninja': function (event) {
              drag = false;
              $button.trigger({
                type: 'select.ninja',
                sliderX: Math.round((event.pageX - offsetX) / increment)
              });
              $(document).unbind('mousemove.ninja mouseup.ninja');
            }
          });
        },
        'touchstart.ninja': function (event) {
          event.preventDefault();
          touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
          offsetX = touch.pageX - $button.position().left;
        },
        'touchmove.ninja': function (event) {
          event.preventDefault();
          touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
          $slider.trigger({
            type: 'change.ninja',
            sliderX: Math.round((touch.pageX - offsetX) / increment)
          });
        },
        'touchend.ninja': function (event) {
          event.preventDefault();
          $button.trigger({
            type: 'select.ninja',
            sliderX: Math.round((touch.pageX - offsetX) / increment)
          });
        }
      });
      return $slider;
    },

    suggest: function (options) {
      options = $.extend({
        radius: '0.3em'
      }, options);
      var $suggest = $.ninja('<span/>', {
        'class': 'ninjaEditable ninjaInline ninjaSuggest'
      });
      if (options.css) {
        $suggest.css(options.css);
      }
      if (options.html) {
        $suggest.prepend(options.html);
      }
      if (options.radius) {
        $suggest.round({
          radius: options.radius
        });
      }
      var $input = $('<input/>', {
        'class': 'ninja',
        type: 'text'
      });
      if (options.placeholder) {
        if ($.support.opacity) {
          $input.css({
            opacity: 0.25
          });
        }
        $input.val(options.placeholder);
      }
      var $clear = $('<span/>', {
        'class': 'ninjaSuggestClear ninjaSymbol ninjaSymbolClear'
      }).bind('click.ninja', function () {
        $input.val('').focus();
        $clear.css({
          visibility: 'hidden'
        });
      });
      var $popup = $suggest.popup(), value;
      $input.bind({
        'focus.ninja': function () {
          if (!$input.is('.ninjaFocused')) {
            if ($.support.opacity) {
              $input.addClass('ninjaFocused').css({
                opacity: 1
              });
            }
            var value = $input.val();
            if (options.placeholder && value === options.placeholder) {
              $input.val('');
            }
            else {
              if (value !== '') {
                $suggest.trigger({
                  type: 'change.ninja',
                  value: value
                });
                $clear.css({
                  visibility: 'visible'
                });
              }
            }
          }
        },
        'blur.ninja': function (event) {
          if ($input.is('.ninjaFocused')) {
            $input.removeClass('ninjaFocused');
            if (options.placeholder && $input.val() === '') {
              if ($.support.opacity) {
                $input.css({
                  opacity: 0.25
                });
              }
              $input.val(options.placeholder);
            }
            if ($('.ninjaStateHovered', $popup).length === 0) {
              $popup.hide();
            }
          }
        },
        'change.ninja select.ninja': function () {/* prevent these events from submitting prematurely */
          return false;
        },
        'keydown.ninja': function (event) {
          value = $input.val();
          if ($.inArray(event.keyCode, [13, 48, 56, 57, 219, 220]) > -1) {/* return or regular expression metacharacters */
            return false;
          }
          else if (event.keyCode === 8 && value.length === 1) {/* delete last character */
            $clear.css({
              visibility: 'hidden'
            });
            $popup.hide();
          }
        },
        'keyup.ninja': function (event) {
          if (event.keyCode === 27) {/* escape */
            $input.blur();
          }
          if (event.keyCode === 13) {/* return */
            if ($('.ninjaStateHovered', $popup).length === 0) {
              $suggest.trigger({
                type: 'select.ninja',
                html: $input.val()
              });
            }
            $popup.hide();
          }
          else if ($.inArray(event.keyCode, [38, 40]) === -1) {/* not down nor up */
            var valueNew = $input.val();
            if (event.keyCode !== 8 && valueNew.length === 1) {/* first character */
              $clear.css({
                visibility: 'visible'
              });
            }
            if (valueNew.length > 0 && value !== valueNew) {
              $suggest.trigger({
                type: 'change.ninja',
                value: valueNew
              });
            }
          }
        }
      });
      $suggest.bind({
        'error.ninja': function (event) {
          $popup.update({
            html: $('<div/>', {
              'class': 'ninjaError',
              text: 'Error: ' + event.message
            })
          }).css({
            minWidth: $suggest.outerWidth()
          });
        },
        'select.ninja': function (event) {
          if (event.html) {
            $input.val($.trim(event.html.toString().replace(new RegExp('/<\/?[^>]+>/', 'gi'), '')));
          }
          else {
            event.html = $input.val();
          }
          $input.blur();
          $popup.hide();
        },
        'update.ninja': function (event) {
          if (event.choices.length) {
            value = $input.val();
            $popup.show().update({
              html: $.ninja().list({
                choices: $.map(event.choices, function (choice) {
                  choice.display = choice.html.toString().replace(new RegExp(value, 'gi'), '<strong>' + value + '</strong>');
                  choice.html = choice.html || choice;
                  choice.select = function () {
                    $suggest.trigger({
                      type: 'select.ninja',
                      html: choice.html || choice
                    });
                  };
                  return choice;
                })
              })
            }).css({
              minWidth: $suggest.outerWidth()
            });
          }
          else {
            $popup.hide();
          }
        }
      }).append($input, $clear);
      return $suggest;
    },

    tabs: function (options) {
      options = $.extend({
        choice: 0,
        radius: ninja().defaults.radius
      }, options);
      var $object = this;
      var $tabs = $.ninja('<span/>');
      if (options.vertical) {
        $tabs.addClass('ninja-tabs-vertical');
      }
      else {
        $tabs.addClass('ninja-tabs-horizontal');
      }
      if (options.css) {
        $tabs.css(options.css);
      }
      $.each(options.choices, function (i, choice) {
        var $choice = ninja('<span/>', {
          'class': 'ninja ninja-tab',
          html: choice.html || choice
        }).bind({
          'click.ninja': function () {
            ninja('.ninja-tab', $tabs).removeClass('ninja-state-selected');
            $choice.addClass('ninja-state-selected');
            $tabs.trigger({
              type: 'select.ninja',
              html: choice.html || choice
            });
            if ($.isFunction(choice.select)) {
              choice.select();
            }
          },
          'mouseenter.ninja': function () {
            $choice.addClass('ninja-state-hovered');
          },
          'mouseleave.ninja': function () {
            $choice.removeClass('ninja-state-hovered');
          }
        });
        if (options.texture) {
          $choice.addClass(options.texture);
        }
        if (i === 0) {
          $choice.addClass('ninja-tab-first').ninja().round({
            corners: 'left',
            radius: options.radius
          });
        }
        else if (i === options.choices.length - 1) {
          $choice.ninja().round({
            corners: 'right',
            radius: options.radius
          });
        }
        if (i === options.choice - 1) {
          $choice.addClass('ninja-state-selected');
        }
        $tabs.append($choice);
      });
      return $tabs;
    },

    update: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(callback)) {
          $object.bind('update.ninja', callback);
        }
        else if (callback) {
          if (callback.html) {
            $object.trigger({
              type: 'update.ninja',
              html: callback.html
            });
          }
          else if (callback.choices) {
            $object.trigger({
              type: 'update.ninja',
              choices: callback.choices
            });
          }
        }
        else {
          $object.trigger('update.ninja');
        }
      });
    },

    version: function () {
      return 'development';
    }

  });

  $.ninja = ninja;

  $.fn.ninja = function () {
    return ninja(this);
  };

}(jQuery));
