const MOBILE_WIDTH = 1006; // experimental threshold based on testing

var get_device_state = function () {
    return $(window).width() <= MOBILE_WIDTH ? 'mobile' : 'desktop';
}
var is_mobile = function () {
    return $(window).width() <= MOBILE_WIDTH;
}

// Seems jank -> find a better way later?
async function scrollAfterDelay(dest, delay) {
    var x = await (function (dest, N) {
        return new Promise(resolve => {
            setTimeout(() => {
                $('html,body').scrollTop($(dest).offset().top - (is_mobile() ? $('#navbar-button-wrapper').height() : $('#navbar-container').height()));
                resolve(dest);
            }, N);
        });
    }(dest, delay));
}

$(document).ready(function () {
    $('.category').after('<hr class="dim">');

    $('a.navbar-item').mouseup(function () {
        $(this).blur();
    });

    // Scroll smoothly on intra-page link click
    $('a[href^=\\#]:not(.navbar-item)').click(function (e) {
        e.preventDefault();
        $('html,body').scrollTop($($(this).attr('href')).offset().top);
    });

    // subtract navbar hieght from scroll targets before scrolling
    $('a.navbar-item').click(function (e) {
        e.preventDefault();
        is_mobile() ? toggle_mobile_navbar() : void (0);
        scrollAfterDelay($(this).attr('href'), 250); // 'fast' animation duration + 50ms
    });

    var toggle_mobile_navbar = function () {
        if (typeof toggle_mobile_navbar.show == 'undefined') toggle_mobile_navbar.show = false;
        // Also seems jank -> find a better way later?
        if (toggle_mobile_navbar.show) {
            $("#navbar-container").css('display', 'flex').animate({
                height: 'toggle'
            }, 'fast');
            $('#burger').removeClass('is-active bg-color-grey');
        }
        else {
            $("#navbar-container").css('display', 'flex').hide().animate({
                height: 'toggle'
            }, 'fast');
            $('#burger').addClass('is-active bg-color-grey');
        }
        toggle_mobile_navbar.show = !toggle_mobile_navbar.show;
    }
    $("#navbar-button").click(toggle_mobile_navbar);

    // position: sticky doesn't work after 1 screen's worth of height if html,body height is 100%
    // to fix, start at 100% then immediately freeze the title page height and unset the height of html,body
    $('#title-container').css('height', $("#navbar").offset().top);
    $('.html-body').css('height', 'unset');

    // Resize the title page if the window size changes
    var state = get_device_state();
    var prev_state = state;
    var prev_height = $(window).height();
    $(window).resize(function () {
        prev_state = state;
        state = get_device_state();

        // Fix height of title page on window vertical resize
        if ($(window).height() != prev_height) {
            $('.html-body').css('height', '100%');
            $('#title-container').css('height', '100%');
            $('#title-container').css('height', $("#navbar").offset().top);
            $('.html-body').css('height', 'unset');
            prev_height = $(window).height();
        }

        // When switching between mobile and desktop, hide/show navbar buttons accordingly
        if (!is_mobile())
            $('#navbar-container').show();
        else if (state == 'mobile' && prev_state == 'desktop' && $('#navbar-container').css('display') != 'none')
            $('#navbar-container').css('display', 'none');
    });
});