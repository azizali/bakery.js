

$(function () {
    var body = $('body');
    $('pre.js', body).each(function () {
        var js = $(this);
        js.snippet('javascript', {
            showNum:false,
            style:'rand01',
            menu:false
        });
    });

    var headNav = $('header nav', body);
    $('section', body).each(function () {
        var section = $(this),
            page = section.attr('data-page') || '',
            id = section.attr('id'),
            title = $('h1', section).text();

        var ref = page + '#' + id ;
        $('<a/>').attr('href', ref)
            .text(title)
            .appendTo(headNav);
        var nav = $('<nav/>').appendTo(section.find('h1'));
        $('fieldset', section).each(function () {
            var fieldset = $(this),
                id = fieldset.attr('id'),
                legend = $('legend', fieldset).text();
            $('<a/>').text(legend)
                .attr('href', '#' + id)
                .appendTo(nav);
        });
    });
});