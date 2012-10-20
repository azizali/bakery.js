$(function(){
    $('pre.js').each(function(){
        var js = $(this);
        js.snippet('javascript', {
            showNum:false,
            style:'rand01',
            menu:false
        });
    })
});