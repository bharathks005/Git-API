let publicUsers = null;
var userData = {};
let userName = null;
var colHeadings = ["types", "limit", "remaining"];
var rowHeadings = ["core", "search", "graphql", "rate"];
$('[data-toggle="tooltip"]').tooltip();
var rateLimit = null;
var serchKey = 'Bangalore';
var panelBoxData = {
    img: '',
    following: '',
    updated_at: '',
    html_url: ''
}

var arrList = [];
var panelDefaultImg = "https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=100";

$(window).on("load", function () {    
    $('#preloader').css('display', 'none');
    $('#profile-info').css('display', 'block');   
    $('html, body').animate({ scrollTop: 0 }, 300);
});

////////////////////// Decrypt data   //////////////////////////

var adminUser = decrypt(getAllUrlParams(window.location.href).username, '256314');
var checkPass = decrypt(getAllUrlParams(window.location.href).password, '256341');

function decrypt(data, key) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}

function getAllUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
            paramName = paramName;
            if (typeof paramValue === 'string') paramValue = paramValue;
            if (paramName.match(/\[(\d+)?\]$/)) {
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                if (paramName.match(/\[\d+\]$/)) {
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    obj[key].push(paramValue);
                }
            } else {
                if (!obj[paramName]) {
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    obj[paramName].push(paramValue);
                }
            }
        }
    }
    return obj;
}

////////////////////// Fetch data  in GitHub  //////////////////////////

function getData(_url, myFn, _id) {
    fetch(_url)
        .then((resp) => resp.json())
        .then(function (data) {
            myFn(data, _id);
        })
        .catch(function (error) {
            return JSON.stringify(error);
        });
}

////////////////////// Login User data  //////////////////////////////

var mainUlrs = 'https://api.github.com/users/' + adminUser;
getData(mainUlrs, updateAdminFn);


////////////////////// Searching data //////////////////////////

let crtUrl = 'https://api.github.com/legacy/user/search/' + serchKey;
$('.add-on').find('#srch-term').val(capsLetter(serchKey));
getData(crtUrl, getUserData);

////////////////////// Add Eventslisteners  //////////////////////////

$('.panel-close').find('.closeBtn').on('click', onPanelCloseClicked);
$('.panel-btn').find('#gitHubBtn').on('click', onPanelGitClicked);
$('.add-on').find('#searchBtn').on('click', searchBtnClicked);
$('.signoutBtn').on('click', signoutBtnClicked);

////////////////////// Shuffling data    //////////////////////////

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

////////////////////// Update Admin user Veiw  //////////////////////////

function updateAdminFn(data) {
    $('title').html(capsLetter(data.name));
    var fullName = (data.name) ? data.name : data.login;
    var location = (data.location) ? data.location : '';
    var followers = (data.followers) ? data.followers : 0;
    var following = (data.following) ? data.following : 0;
    var public_repos = (data.public_repos) ? data.public_repos : 0;
    var adminImg = data.avatar_url ? data.avatar_url : 'images/profileImg.png';
    $('#profile-content').find('#adminImg').attr('src', adminImg)
    $('#profile-content').find('#loginUserName').html(fullName.toUpperCase());
    $('#profile-content').find('#userLocation').html('<h5>'+ location.toUpperCase()+'</h5>');
    $('#profile-content').find('#follwersData').html(followers);
    $('#profile-content').find('#followingData').html(following);
    $('#profile-content').find('#reposData').html(public_repos);
}


////////////////////// Show  First letter capital  ///////////////////////

function capsLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

////////////////////// Show  Rate limit in GitHub  ///////////////////////

function rateLimitFn(data) {
    for (var a = 0; a < rowHeadings.length; a++) {
        $('#' + rowHeadings[a]).find("#" + colHeadings[0]).text(capsLetter(rowHeadings[a]));
        var tableData = (a === 3) ? 'data' : 'data.resources';
        for (var b = 1; b < colHeadings.length; b++) {
            $('#' + rowHeadings[a]).find("#" + colHeadings[b]).text(eval(tableData + '.' + rowHeadings[a] + '.' + colHeadings[b]));
        }
    }
    rateLimit = eval(tableData + '.' + rowHeadings[3] + '.' + colHeadings[1])
}


//////////////////////Get the user lists in GitHub  ///////////////////////////// 

function getUserData(_data) {
    panelBoxData.img = "";
    panelBoxData.following = "";
    panelBoxData.updated_at = "";
    panelBoxData.html_url = "";
    arrList = [];
    getData('https://api.github.com/rate_limit', rateLimitFn);
    $('#list_cointainer').empty();
    var listHtml = `<div class="d-flex flex-row rounded list-box" data-image-id="" data-toggle="modal" data-title="" data-image="" data-target="#profile-gallery">  
                         <div class="p-0 w-25">    
                         <img src="images/profileImg.png"  id = "list_profileImg" class="img-thumbnail border-0" /></div>
                             <div class="pl-3 pt-2 pr-2 pb-2 w-75 border-left">
                                 <div class="user_info" id ="user_info">
                                     <h4 id="username"></h4>
                                     <Label>Id : </Label>
                                     <span id="userId"></span>
                                 </div>
                             </div>
                         </div>
                     </div>`;
    userData = _data.users;
    if (_data.users.length == 0) {
        var errorBox = document.createElement('div');
        errorBox.setAttribute('class', 'no_data');
        $('#list_cointainer').append(errorBox);
        $('.no_data').html('<h2>No Data</h2><p><b>Please search  valid keyword!!!!</b></p>');
    }
    for (var l = 0; l < userData.length; l++) {
        arrList[l] = l;
    }
    shuffle(arrList);
    for (var i = 0; i < userData.length; i++) {
        var data = userData[arrList[i]];
        var fullName = (data.fullname) ? data.fullname : data.username;
        var imgId = data.id.toString().split('user-')[1];
        var avatarUrl = "https://avatars1.githubusercontent.com/u/" + imgId + "?v=4";
        var id = (data.id) ? data.id.toString().split('-')[1] : null;
        var userDetials = document.createElement('div');
        userDetials.setAttribute('class', 'user_detials');
        userDetials.setAttribute('id', 'user_' + (arrList[i] + 1));
        $('#list_cointainer').append(userDetials);
        $('#user_' + (arrList[i] + 1)).append(listHtml);
        $("#user_" + (arrList[i] + 1)).find("#username").html(capsLetter(fullName));
        $("#user_" + (arrList[i] + 1)).find("#userId").html(id);
        $("#user_" + (arrList[i] + 1)).find("#list_profileImg").attr('src', avatarUrl);
        $('#user_' + (arrList[i] + 1)).on("click", userListClicked);
    }
}

///////////////////////  List User detials //////////////////////////

function getProfileData(data, userId) {
    var imgId = userData[userId - 1].id.toString().split('user-')[1];
    panelBoxData.img = "https://avatars3.githubusercontent.com/u/" + imgId + "?v=4";
    panelBoxData.following = data.following;
    panelBoxData.updated_at = data.updated_at;
    panelBoxData.html_url = userData[userId - 1].username;
    var panelProfImg = (panelBoxData.img) ? panelBoxData.img : panelDefaultImg;
    var followindData = (panelBoxData.following) ? panelBoxData.following : 0;
    var updateTime = (panelBoxData.updated_at) ? panelBoxData.updated_at.split('T')[0] : "No data";
    var fullName = (userData[userId - 1].fullname) ? userData[userId - 1].fullname : userData[userId - 1].username;
    var userName = (userData[userId - 1].username) ? userData[userId - 1].username : '--';
    var email = (userData[userId - 1].email) ? userData[userId - 1].email : '--';
    var location = (userData[userId - 1].location) ? userData[userId - 1].location : '--';
    var repos = (userData[userId - 1].repos) ? userData[userId - 1].repos : 0;
    var follower = (userData[userId - 1].followers) ? userData[userId - 1].followers : 0;
    var created = (userData[userId - 1].created) ? userData[userId - 1].created.split('T')[0] : '--';
    var language = (userData[userId - 1].language) ? userData[userId - 1].language : '--';
    $('#profileContainer').find('#singleUserName').html(capsLetter(fullName));
    $('#profileContainer').find('#panel-username').html(userName);
    $('#profileContainer').find('#panel-email').html(email);
    $('#profileContainer').find('#panel-location').html(location);
    $('#profileContainer').find('#panel-repos').html(repos);
    $('#profileContainer').find('#panel-follower').html(follower);
    $('#profileContainer').find('#panel-createTime').html(created);
    $('#profileContainer').find('#panel-progileImg').attr('src', panelProfImg);
    $('#profileContainer').find('#panel-updateTime').html(updateTime);
    $('#profileContainer').find('#panel-following').html(followindData);
    $('#profileContainer').find('#panel-language').html(language);
}

////////////////// List User Function ////////////////////////////

function userListClicked(e) {
    panelBoxData = {
        img: '',
        following: '',
        updated_at: '',
        html_url: ''
    }
    var userId = e.currentTarget.id.split('_')[1];
    if (rateLimit >= 1) {
        var userUrl = 'https://api.github.com/users/' + userData[userId - 1].username;
        getData(userUrl, getProfileData, userId);
    } else {      
        alert('your limit is done!!!')          
    }

}

////////////////// Panel Close Function ////////////////////////////

function onPanelCloseClicked() {
    $('#user_list').show();
    $('.modal-backdrop').hide();
    $('#profile-gallery').hide();
    $('.profile-page').removeClass('modal-open');
    $('.profile-page').css(' padding-right', '0px');

    panelBoxData = {
        img: '',
        following: '',
        updated_at: '',
        html_url: ''
    }
}

////////////////// Home Buttton Function ////////////////////////////

function onPanelGitClicked() {
    var homeUrl = "https://github.com/" + panelBoxData.html_url;
    window.open(homeUrl, '_blank');
}


////////////////// Search Buttton Function ////////////////////////////

function searchBtnClicked() {
    var searchValue = $('.add-on').find('#srch-term').val();
    let searchUrl = 'https://api.github.com/legacy/user/search/' + searchValue;
    getData(searchUrl, getUserData);
    var topPos = $('#list_cointainer').position();
    $('html, body').animate({ scrollTop: 620 }, 'slow');
}

////////////////// Signout Buttton Function ////////////////////////////

function signoutBtnClicked() {
    var homeUrl = "index.html";
    history.back(-1)
    window.open(homeUrl, '_self');
}