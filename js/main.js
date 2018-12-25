let userName = null;
let passWord = null;
let authUser = null;
var getUserInfo = null;

$(window).on("load", function() {  
    $('#preloader').css('display', 'none');
    $('body').css('background-image', 'linear-gradient(to right bottom, #ffffff, #b9b9b9, #777777, #3b3b3b, #000000)')
    $('#login').css('display', 'block');
});

function submitFn() {
    userName = $('#username').val();
    passWord = $('#password').val();
    getUserInfo = new GitHub({
        username: userName,
        password: passWord
    });
    var me = getUserInfo.getUser();
    me.getProfile(function(err, profile) {
        if (err) {
            $('#error').css('display', 'block');
        } else {
            $('#error').css('display', 'none');           
            // Encrypt
            var user = CryptoJS.AES.encrypt(profile.login, '256314');
            var pass = CryptoJS.AES.encrypt(passWord, '256341');
            $('#preloader').css('display', 'block');           
            $('#login').css('display', 'none');
            window.open('profile.html?username=' + user + "&" + 'password=' + pass, '_self');
        }
    });
}

$(".toggle-password").click(function() {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $('#password');
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });


$('#password').on('keyup',function(e){
   var val =  e.currentTarget.value;
    if(val.length !=0){
        $('.fa-eye').show();
    }
    else{
        $('.fa-eye').hide();
    }
})