/*
    WContextmenu
    Project original http://www.abeautifulsite.net/
    Version by Webbers - 0.1.1
    Requeired: jQuery 1.5.1
*/
(function ($)
{
    $.WContextMenu = function (element, options)
    {
        var plugin = this;
        plugin.settings = {};
        var $element = $(element);

        var defaults =
            {
                inSpeed: 150,
                outSpeed: 75,
                menu: null,
                select: null,
                beforeOpen: function () { },
                afterClose: function () { }
            };

        plugin.settings = $.extend({}, defaults, options);

        var $menu = $('#' + plugin.settings.menu);
        $element.data('menu', $menu);

        if (plugin.settings.inSpeed === 0)
        {
            plugin.settings.inSpeed = -1;
        }
        if (plugin.settings.outSpeed === 0)
        {
            plugin.settings.outSpeed = -1;
        }

        var offset = $element.offset();
        $menu.addClass('contextMenu');

        $element.mousedown(function (mouseDownEvent)
        {
            mouseDownEvent.stopPropagation();
            $element.mouseup(function (mouseUpEvent)
            {
                mouseUpEvent.stopPropagation();
                $element.unbind('mouseup');
                if (mouseDownEvent.button == 2)
                {
                    plugin.settings.beforeOpen($element, mouseUpEvent);

                    $(".contextMenu").hide();

                    var widthContextMenu = $(".contextMenu").width() + 'px';
                    
                    if ($element.hasClass('disabled')) return false;

                    var d = {}, x, y;
                    if (self.innerHeight)
                    {
                        d.pageYOffset = self.pageYOffset;
                        d.pageXOffset = self.pageXOffset;
                        d.innerHeight = self.innerHeight;
                        d.innerWidth = self.innerWidth;
                    }
                    else if (document.documentElement && document.documentElement.clientHeight)
                    {
                        d.pageYOffset = document.documentElement.scrollTop;
                        d.pageXOffset = document.documentElement.scrollLeft;
                        d.innerHeight = document.documentElement.clientHeight;
                        d.innerWidth = document.documentElement.clientWidth;
                    }
                    else if (document.body)
                    {
                        d.pageYOffset = document.body.scrollTop;
                        d.pageXOffset = document.body.scrollLeft;
                        d.innerHeight = document.body.clientHeight;
                        d.innerWidth = document.body.clientWidth;
                    }

                    $menu
                        .find('a')
                        .mouseover(function ()
                        {
                            $(this).closest('.contextMenu').find('li.hover').removeClass('hover');

                            var $submenus = $menu.find('.contextMenu');
                            $submenus.each(function ()
                            {
                                $(this).hide();
                            });

                            if ($(this).parent().is('.disabled'))
                            {
                                return;
                            }

                            $(this).parent().addClass('hover');

                            var $submenu = $(this).parent().children('.contextMenu');
							
							if ((mouseUpEvent.pageY + $submenu.height() + $('.contextMenu').height()) > d.innerHeight)
                            {
                                $submenu.css('top', $(this)[0].offsetTop - $submenu.height() + $submenu.context.clientHeight + 'px');
                            } 
                            else 
                            {
                                $submenu.css('top', $(this)[0].offsetTop + 'px');
                            }
							
                            if ($submenu.length)
                            {
                                if ((mouseUpEvent.pageX + $('.contextMenu').width()) > d.innerWidth)
                                {
                                    $submenu.css('left', '-' + widthContextMenu);
                                }
                                else
                                {
                                    if ((mouseUpEvent.pageX + $submenu.width() + $('.contextMenu').width()) > d.innerWidth)
                                    {
                                        $submenu.css('left', '-' + widthContextMenu);
                                    } else
                                    {
                                        $submenu.css('left', $menu.width());
                                    }
                                }
                            }
                            else
                            {
                                $submenu = $(this).closest('.contextMenu');
                            }
                            $submenu.show();
                        })
                        .mouseout(function (mouseOutEvent)
                        {
                            if ($(this).parent()[0] != $(mouseOutEvent.toElement).closest('.contextMenu').parent()[0])
                            {
                                return;
                            }
                            if ($(this).parent().find('.contextMenu').length)
                            {
                                $(this).parent().find('.contextMenu').hide();
                            }
                        });

                    $menu.find('A').unbind('click');
                    $menu.find('LI A').click(function ()
                    {
                        if ($(this).parent().is('.disabled'))
                        {
                            return false;
                        }
                        $(document).unbind('click').unbind('keypress');
                        $(".contextMenu").hide();
                        // Callback
                        if (plugin.settings.select)
                        {
                            plugin.settings.select($(this).attr('href').substr(1),
                                            $($element),
                                            { x: x - offset.left, y: y - offset.top, docX: x, docY: y });
                        }
                        return false;
                    });

                    setTimeout(function ()
                    {
                        $(document).click(function ()
                        {
                            $(document).unbind('click').unbind('keypress');
                            $menu.hide();
                            plugin.settings.afterClose($element, mouseUpEvent);
                            return false;
                        });
                    }, 0);

                    if (mouseUpEvent.pageX)
                    {
                        x = mouseUpEvent.pageX;
                    }
                    else
                    {
                        x = mouseUpEvent.clientX + d.scrollLeft;
                    }
                    
                    if (mouseUpEvent.pageY)
                    {
                        y = mouseUpEvent.pageY;
                    }
                    else
                    {
                        y = mouseUpEvent.clientY + d.scrollTop;
                    }

                    $(document).unbind('click');
                    $menu.show();
                    var contextMenuIndex = $(this).index();
                    if ((mouseUpEvent.pageX + $('.contextMenu:eq(' + contextMenuIndex + ')').width()) > d.innerWidth)
                    {
                        x = x - $('.contextMenu').width();
                    }

                    var countLiFirst = 0;
                    $('.contextMenu:eq(' + contextMenuIndex + ')').children('li').each(function ()
                    {
                        countLiFirst = countLiFirst + 30;
                    });

                    if ((mouseUpEvent.pageY + countLiFirst) > d.innerHeight)
                    {
                        var countLi = 0;
                        $('.contextMenu li:visible').each(function ()
                        {
                            countLi = countLi + 30;
                        });
                        $('.hasChildren').each(function ()
                        {
                            $(this).children('.contextMenu').css('left', '-' + $('.contextMenu').width() + 'px');
                        });
                        y = y - countLi;
                    }

                    $menu.css({ top: y, left: x });

                }
            });
        });

        if ($.browser.mozilla)
        {
            $menu.each(function ()
            {
                $(this).css({ 'MozUserSelect': 'none' });
            });
        }
        else if ($.browser.msie)
        {
            $menu.each(function ()
            {
                $(this).bind('selectstart.disableTextSelect', function ()
                {
                    return false;
                });
            });
        }
        else
        {
            $menu.each(function ()
            {
                $(this).bind('mousedown.disableTextSelect', function ()
                {
                    return false;
                });
            });
        }
        $element.add($('UL.contextMenu')).bind('contextmenu', function ()
        {
            return false;
        });


        this.methods =
            {
                hideItems: function (o)
                {
                    if (o === undefined)
                    {
                        $(this).data('menu').find('LI').hide();
                        return ($(this));
                    }
                    $(this).each(function ()
                    {
                        if (o !== undefined)
                        {
                            var d = o.split(',');
                            for (var i = 0; i < d.length; i++)
                            {
                                $(this).data('menu').find('A[href="' + d[i] + '"]').parent().hide();

                            }
                        }
                    });
                    return $(this);
                },

                hideItemsByTypes: function (selectedRowTypes)
                {
                    $(this).each(function ()
                    {

                        for (var j = 0; j < selectedRowTypes.length; j++)
                        {
                            var rowType = selectedRowTypes[j];
                            var menus = $(this).data('menu').find('a');

                            for (var i = 0; i < menus.length; i++)
                            {
                                var menu = menus[i];
                                var filter = $(menu).attr("typeFilter");
                                if (!filter)
                                {
                                    continue;
                                }
                                var filterItems = filter.split(',');

                                if (filterItems.length == 1)
                                {
                                    if (filter != rowType)
                                    {
                                        $(menu).parent().hide();
                                    }
                                } else
                                {
                                    var contains = false;
                                    for (var k = 0; k < filterItems.length; k++)
                                    {
                                        if (rowType == filterItems[k])
                                        {
                                            contains = true;
                                            break;
                                        }
                                    }
                                    if (!contains)
                                    {
                                        $(menu).parent().hide();
                                    }
                                }
                            }
                        }
                    });
                    return $(this);
                },

                showItems: function (o)
                {
                    if (o === undefined)
                    {
                        $(this).data('menu').find('LI').show();
                        return ($(this));
                    }
                    $(this).each(function ()
                    {
                        if (o !== undefined)
                        {
                            var d = o.split(',');
                            for (var i = 0; i < d.length; i++)
                            {
                                $(this).data('menu').find('A[href="' + d[i] + '"]').parent().show();

                            }
                        }
                    });
                    return $(this);
                },
                disableItems: function (o)
                {
                    if (o === undefined)
                    {
                        $(this).data('menu').find('LI').addClass('disabled');
                        return ($(this));
                    }
                    $(this).each(function ()
                    {
                        if (o !== undefined)
                        {
                            var d = o.split(',');
                            for (var i = 0; i < d.length; i++)
                            {
                                $(this).data('menu').find('A[href="' + d[i] + '"]').parent().addClass('disabled');

                            }
                        }
                    });
                    return $(this);
                },

                enableItems: function (o)
                {
                    if (o === undefined)
                    {
                        $(this).data('menu').find('LI.disabled').removeClass('disabled');
                        return ($(this));
                    }
                    $(this).each(function ()
                    {
                        if (o !== undefined)
                        {
                            var d = o.split(',');
                            for (var i = 0; i < d.length; i++)
                            {
                                $(this).data('menu').find('A[href="' + d[i] + '"]').parent().removeClass('disabled');
                            }
                        }
                    });
                    return $(this);
                },

                disable: function ()
                {
                    $(this).each(function ()
                    {
                        $(this).addClass('disabled');
                    });
                    return $(this);
                },

                enable: function ()
                {
                    $(this).each(function ()
                    {
                        $(this).removeClass('disabled');
                    });
                    return $(this);
                },

                destroy: function ()
                {
                    $(this).each(function ()
                    {
                        $(this).unbind('mousedown').unbind('mouseup');
                    });
                    return $(this);
                }
            };

        $element.data('wcontextmenu', this);
        return $element;
    };

    $.fn.wcontextmenu = function (options)
    {
        var args = arguments;
        return this.each(function ()
        {
            var plugin = $(this).data('wcontextmenu');

            if (plugin && plugin.methods[options])
            {
                return plugin.methods[options].apply(this, Array.prototype.slice.call(args, 1));
            }
            if (plugin === undefined)
            {
                return new $.WContextMenu(this, options);
            }
            return $(this);
        });
    };
})(jQuery);
