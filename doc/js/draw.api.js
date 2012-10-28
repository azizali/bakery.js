
$.fn.extend({
   asideMenu:function(section){
       var menu = $(this),
            ul = $('<ul/>').appendTo(menu).addClass('aside-menu');
        $('fieldset', section).each(function(){
            var fieldset = $(this),
                id = fieldset.attr('id'),
                legend = $('legend', fieldset).text();
            var li = $('<li/>').appendTo(ul);
            $('<a/>').attr('href', '#' + id)
                .text(legend)
                .appendTo(li);
            $('<div/>')
                .appendTo(li)
                .asideSubMenu(fieldset);
        });
       var menuTop = menu.offset().top;
       var win = $(window).scroll(function(){
           var scrollTop = win.scrollTop();
           if(scrollTop > menuTop){
               menu.css({
                   position:'fixed',
                   top:10
               });
           } else {
                menu.css({
                    position:'absolute',
                    top:menuTop
                })
           }
       });
       return menu;
   },
    asideSubMenu:function(fieldset){
        var menu = $(this),
            ul = $('<ul/>').appendTo(menu).addClass('aside-sub-menu');
        $('dt', fieldset).each(function(){
           var dt = $(this),
               id = dt.attr('id'),
               title = dt.text().replace(/^.*\./, '');
            var li = $('<li/>').appendTo(ul);
            if(!id){
                id = 'dt-' + fieldset.prevAll('fieldset').size()
                 + '-' + dt.prevAll('dt').size();
                dt.attr('id', id);
            }
            $('<a/>')
                .attr('href', '#' + id)
                .text(title)
                .appendTo(li);
        });

        return menu;
    },
    callTest:function(){
        return $(this).each(function(){
            var fine = true;
            var B = Bakery;
            $('dt', this).each(function(){
                var dt = $(this),
                    dd = dt.next('dd');
                var name = (function(dt){
                    $('*', dt).remove();
                    return dt.text().replace(/[\n\s]/g,'');
                })(dt.clone()),
                    shortName = name.replace(/^.*\./, '');

                eval('var ' + shortName + ' = ' + name + ';');
                function assertMethod(method){
                    var has = false;
                    eval('has = ' + shortName + '.prototype.hasOwnProperty("' + method + '")');
                    if(!has){
                        var err = '[api test failed]there is no method "' + method + '" in ' + shortName;
                        console.error(err)
                    }
                    return has;
                }
                $('th', dd).each(function(){
                    var th = $(this),
                        name = th.text().replace(/\n\s/g, '');
                    var match = name.match(/(^\.)(.*)(\([^\)]*\))/);
                    if(match && match.length > 2){
                        fine = fine && assertMethod(match[2]);
                    }
                    if(th.is('.field')){
                        fine = fine && assertMethod(name);
                    }
                });
            });
            if(fine) console.log('[api test passed] signatures are fine.')
        });
    }
});

$(function(){
    var apiSection = $('#section-api');
    $('aside').asideMenu(apiSection);

    $('fieldset', apiSection).callTest();
});