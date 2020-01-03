/* eslint-disable no-undef */
$(function() {
    // remove errors
    function removeErrors() {
        $('form.signin p.error, form.signup p.error').remove();
        $('form.signin input, form.signup input').removeClass('error');
    }

    //toggle
    var flag = true;
    $('.switch-button').on('click', function(e) {
        e.preventDefault();
        $('input').val('');
        removeErrors();
        if (flag) {
            flag = false;
            $('.signup').show('slow');
            $('.signin').hide();
        } else {
            flag = true;
            $('.signin').show('slow');
            $('.signup').hide();
        }
    });
    // clear
    $('form.signin input, form.signup input').on('focus', function() {
        removeErrors();
    });

    //signup
    $('.signup-button').on('click', function(e) {
        e.preventDefault();
        removeErrors();

        var data = {
            login: $('#signup-login').val(),
            password: $('#signup-password').val(),

            passwordConfirm: $('#signup-password-confirm').val()
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/signup'
        }).done(function(data) {
            if (!data.ok) {
                $('.signup h2').after(
                    '<p class="error">' + data.error + '</p>'
                );
                if (data.fields) {
                    data.fields.forEach(function(item) {
                        $('input[name=' + item + ']').addClass('error');
                    });
                }
            } else {
                // $('.signup h2').after('<p class="success">Отлично!!!</p>');
                $(location).attr('href', '/');
            }
        });
    });

    //signin
    $('.signin-button').on('click', function(e) {
        e.preventDefault();
        removeErrors();

        var data = {
            login: $('#signin-login').val(),
            password: $('#signin-password').val()
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/signin'
        }).done(function(data) {
            if (!data.ok) {
                $('.signin h2').after(
                    '<p class="error">' + data.error + '</p>'
                );
                if (data.fields) {
                    data.fields.forEach(function(item) {
                        $('input[name=' + item + ']').addClass('error');
                    });
                }
            } else {
                // $('.signin h2').after('<p class="success">Отлично!!!</p>');
                $(location).attr('href', '/');
            }
        });
    });
});

/* eslint-enable no-undef */