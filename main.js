$(document).ready(function () {
    // Scroll smoothly on intra-page link click
    $("a[href^=\\#]").click(function (e) {
        e.preventDefault();
        var dest = $(this).attr('href');
        $('html,body').animate({ scrollTop: $(dest).offset().top }, 'fast', 'easeInOutSine');
    });

    var show = false;
    var toggle_mobile_navbar = function () {
        // Seems jank -> find a better way later?
        if (show)
            $("#navbar-container").css('display', 'flex').animate({
                height: 'toggle'
            });
        else
            $("#navbar-container").css('display', 'flex').hide().animate({
                height: 'toggle'
            });
        $('#burger').toggleClass('is-active');
        $('#burger').toggleClass('bg-color-grey');
        show = !show;
    }
    $("#navbar-button").click(toggle_mobile_navbar);
    if ($(window).width() <= 1023)
        $('.navbar-item').click(toggle_mobile_navbar);

    // position: sticky doesn't work after 1 screen's worth of height if html,body height is 100%
    // to fix, start at 100% then immediately freeze the title page height and unset the height of html,body
    $('#title-container').css('height', $("#navbar").offset().top);
    $('.html-body').css('height', 'unset');

    // Resize the title page if the window size changes
    $(window).resize(function () {
        $('.html-body').css('height', '100%');
        $('#title-container').css('height', '100%');
        $('#title-container').css('height', $("#navbar").offset().top);
        $('.html-body').css('height', 'unset');
    });
});