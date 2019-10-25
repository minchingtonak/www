const MOBILE_WIDTH = 1006 // experimental threshold based on testing
const DARK_MODE_COLOR = '#2d2d2d'
const LIGHT_MODE_COLOR = '#ffffff'

var get_device_state = function () {
    return $(window).width() <= MOBILE_WIDTH ? 'mobile' : 'desktop'
}
var is_mobile = function () {
    return $(window).width() <= MOBILE_WIDTH
}

var handle_link = function (text) {
    var regex = /\[[^\]]+?\][\s]*\([^\s\)]+?[\s]+?'[\s\S]+?'\)/g
    var matches = []
    while (match = regex.exec(text))
        matches.push(match)

    if (matches.length) {
        for (i = 0; i < matches.length; i++) {
            var mid = /\]\s*\(/g.exec(matches[i][0])
            var end = /\s*['"]/g.exec(matches[i][0].substr(mid.index + mid.length))

            text = text.replace(matches[i][0], $('<a>', {
                text: matches[i][0].substring(1, mid.index),
                href: matches[i][0].substring(mid.index + mid[0].length, end.index + mid.index + 1),
                title: matches[i][0].substring(end.index + mid.index + end[0].length + 1, matches[i][0].length - 2)
            })[0].outerHTML)
        }
    }
    return text
}

var make_title = function (name) {
    var section = $('<section>', {
        'class': 'container'
    })
    section.append($('<h1>', {
        id: name.toLowerCase().replace(/[^0-9a-z]/gi, ''),
        'class': 'category',
        text: name.toUpperCase()
    }))
    section.append($('<hr>', {
        'class': 'dim'
    }))
    return section
}

var make_section = function (category, category_name) {
    var section = make_title(category_name)
    for (entry in category) {
        var entry_section = $('<section>', {
            'class': 'entry'
        })
        for (property in category[entry]) {
            if (property == "desc") {
                var ul = $('<ul>', {
                    'class': 'desc'
                })
                for (bullet in category[entry][property]) {
                    ul.append($('<li>', {
                        html: handle_link(category[entry][property][bullet])
                    }))
                }
                entry_section.append(ul)
            } else {
                var p = $('<p>', {
                    'class': 'e-' + property,
                    html: handle_link(category[entry][property])
                })
                entry_section.append(p)
            }
        }
        section.append(entry_section)
    }
    $('#main-content').append(section)
}

var make_skills = function (skills, skills_name) {
    var section = make_title(skills_name)
    var ul = $('<ul>', {
        'class': 'desc'
    })
    var entry_section = $('<section>', {
        'class': 'entry'
    })
    for (type in skills) {
        var li = $('<li>', {
            html: $('<h2>', {
                text: type + ':'
            })[0].outerHTML + skills[type]
        })
        ul.append(li)
    }
    entry_section.append(ul)
    section.append(entry_section)
    $('#main-content').append(section)
}

var make_navbar_item = function (name, icon) {
    var p_name = name.toLowerCase()
    var a = $('<a>', {
        'class': 'navbar-item',
        href: '#' + p_name.replace(/[^0-9a-z]/gi, ''),
        role: 'button',
        title: 'Go to the ' + p_name + ' section.'
    })
    a.append($('<p>', {
        html: name
    }))
    a.append($('<i>', {
        'class': icon + ' nav-icon'
    }))
    $('#navbar-container').append(a)
}

var generate = function () {
    // https://gist.githubusercontent.com/minchingtonak/c83ff547dfa762624edf900691ad3bc5/raw
    $.getJSON('http://127.0.0.1:5500/resume.json', function (resume) {
        var keys = Object.keys(resume)
        for (var i = 0; i < keys.length; i++)
            make_navbar_item(keys[i], resume[keys[i]]['icon'])
        for (var i = 0; i < keys.length - 1; i++)
            make_section(resume[keys[i]]['entries'], keys[i])
        make_skills(resume[keys[keys.length - 1]]['entries'], keys[keys.length - 1])
        after_generate()
    })
}

// Seems jank -> find a better way later?
async function scrollAfterDelay(dest, delay) {
    var x = await (function (dest, N) {
        return new Promise(resolve => {
            setTimeout(() => {
                var d = $(dest).parent()
                // center section if it fits within the screen, else scroll to the top of it
                // +50 px of leeway to prevent ugly scroll position when heights are very close
                var t = $(window).height() - $('#navbar').height() <= d.outerHeight(true) + 50 ? d.offset().top - $('#navbar').height() : d.offset().top + (d.outerHeight(true) * 0.5) - $(window).height() * 0.5
                $('html,body').scrollTop(t)
                resolve(dest)
            }, N)
        })
    }(dest, delay))
}

var after_generate = function () {
    var html_body = $('.html-body')

    // Configure accessibility tag state based on device type
    is_mobile() ? $('.navbar-item').attr('aria-hidden', 'true') : $('.navbar-item').attr('aria-hidden', 'false')

    // Dark mode transitions on all relevant elements
    $('html,body,#navbar,#navbar-container,#burger,#main-content').addClass('transition')
    $('#navbar, #main-content').children().addClass('transition')

    // Toggle dark mode
    $('#dark-toggle').click(function () {
        var theme = $('meta[name=theme-color],meta[name=apple-mobile-web-app-status-bar-style]')
        $('meta[name=theme-color]').attr('content') != LIGHT_MODE_COLOR ? theme.attr('content', LIGHT_MODE_COLOR) : theme.attr('content', DARK_MODE_COLOR)
        $('#navbar,#burger,#main-content').children().toggleClass('dark-theme')
        $('#main-content,#navbar').toggleClass('dark-theme')
        $('.e-date', '.entry').toggleClass('dark-theme')
        $('html,body').toggleClass('dark-html')
    })

    // Don't keep focus on navbar items after click
    $('a.navbar-item', '#navbar').mouseup(function () {
        $(this).blur()
    })

    // subtract navbar hieght from scroll targets before scrolling
    $('a.navbar-item', '#navbar').click(function (e) {
        // e.preventDefault()
        is_mobile() ? toggle_mobile_navbar() : void(0)
        scrollAfterDelay($(this).attr('href'), 250) // 'fast' animation duration + 50ms
        return false
    })

    var toggle_mobile_navbar = function () {
        if (typeof toggle_mobile_navbar.show == 'undefined') toggle_mobile_navbar.show = false
        // Also seems jank -> find a better way later?
        if (toggle_mobile_navbar.show) {
            $("#navbar-container").css('display', 'flex').animate({
                height: 'toggle'
            }, 'fast')
            $('#navbar-burger').removeClass('is-active bg-color-grey').attr('aria-expanded', 'false')
            $('.navbar-item', '#navbar').attr('aria-hidden', 'true')
        } else {
            $("#navbar-container").css('display', 'flex').hide().animate({
                height: 'toggle'
            }, 'fast')
            $('#navbar-burger').addClass('is-active bg-color-grey').attr('aria-expanded', 'true')
            $('.navbar-item', '#navbar').attr('aria-hidden', 'false')
        }
        toggle_mobile_navbar.show = !toggle_mobile_navbar.show
    }
    $("#burger").click(toggle_mobile_navbar)

    // position: sticky doesn't work after 1 screen's worth of height if html,body height is 100%
    // to fix, start at 100% then immediately freeze the title page height and unset the height of html,body
    $('#title-container').css('height', $("#navbar").offset().top)
    html_body.css('height', 'unset')

    // Resize the title page if the window size changes
    var state = get_device_state()
    var prev_state = state
    var prev_height = $(window).height()
    $(window).resize(function () {
        prev_state = state
        state = get_device_state()

        // Fix height of title page on window vertical resize
        if ($(window).height() != prev_height) {
            html_body.css('height', '100%')
            $('#title-container').css('height', '100%').css('height', $("#navbar").offset().top)
            html_body.css('height', 'unset')
            prev_height = $(window).height()
        }

        // When switching between mobile and desktop, hide/show navbar buttons accordingly
        if (!is_mobile())
            $('#navbar-container').show()
        else if (state == 'mobile' && prev_state == 'desktop' && $('#navbar-container').css('display') != 'none')
            $('#navbar-container').css('display', 'none')
    })
}

$(generate)