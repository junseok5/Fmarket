var socket = io.connect('http://localhost:3000');
var page = 1; // infinite scrolling page
var date = '0'; // date 변수를 통하여 가장 마지막에 페이징 된 게시글의 날짜가 저장되어 서버로 전송
var posts = $('#posts');
var likeBadge = $('#likeBadge');
var loading = $('#loading');
var mainMenu = $('#mainMenu');
var mainBadge = $('#mainBadge');
var likeMenu = $('#likeMenu');
var keywords;
var isMain = true; // 메인 화면 무한 스크롤링 상태
var isSearch = false; // 검색 화면 무한 스크롤링 상태
var isLike = false; // 관심 상품 화면 무한 스크롤링 상태
var postArr = new Array();
var postCount = 0;

// localStorage를 이용한 자동 로그인
if (id === '' && localStorage.getItem('autoLogin')) {
  location.href = '/auth/facebook';
} else if (id !== ''){
  localStorage.setItem('autoLogin', true);
}

requestPosts(date); // 첫 데이터 요청


$(document).ready(function(){
  // socket connected success !
  socket.on('connected', function(){
    console.log('socket.io server and clients connected');
  });

  // 메인화면에서 최신 순으로 게시글 나열
  socket.on('responsePosts', function(data){
    console.log(data.postList.length);
    var postLength = data.postList.length;

    // 요청할 데이터가 더이상 없을 때 리턴
    if (postLength === 0) {
      if (postCount === 0) {
        posts.append(`
          <div class="alert alert-danger" role="alert"><strong>Sorry,</strong> can't search your request posts.</div>
        `);
      }
      loading.fadeOut('slow');
      return;
    }
    // 첫 요청 때 관심상품 데이터가 존재할 시 배열에 담기
    if (data.ipostList !== 0) {
      if (postArr.length === 0) {
        for (var i = 0; i < data.ipostList.length; i++) {
          postArr.push(data.ipostList[i].postUrl);
        }
        likeBadge.text(postArr.length);
      }
    }

    for (var i = 0; i < postLength; i++) {
      // 로그인 사용자는 관심 상품 추가 버튼 보이게 하기
      if (id !== '') {
        posts.append(`
          <h3 id="interestButton`+ postCount +`" onclick="addItem(`+ postCount +`)"><span id="addItem" class="label label-success">관심상품 추가</span></h3>
          <input type="hidden" id="postUrl`+ postCount +`" value="` + data.postList[i].postUrl + `">
          <input type="hidden" id="isMarkLike`+ postCount +`" value="noMark">
          <iframe src="https://www.facebook.com/plugins/post.php?href=`+ data.postList[i].postUrl +`&width=500&show_text=true&appId=1726723337618733&height=772" width="500" height="772" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
        `);
        // 관심 상품에 추가 된 게시글은 관심 상품 표시하기

        for (var j = 0; j < postArr.length; j++) {
          if (data.postList[i].postUrl == postArr[j]) {
            var iButton = $('#interestButton' + postCount);
            console.log(iButton);
            iButton.empty();
            iButton.append(`
              <h3><span class="label label-primary"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>관심 상품</span></h3>
              <input type="hidden" id="isLike`+ postCount +`" value="like">
            `);
            $('#isMarkLike' + postCount).val('mark');
          }
        }
      } else {  // 비로그인 사용자는 관심 상품 추가 버튼 안보임
        posts.append(`
          <iframe src="https://www.facebook.com/plugins/post.php?href=`+ data.postList[i].postUrl +`&width=500&show_text=true&appId=1726723337618733&height=772" width="500" height="772" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
        `);
      }
      postCount++;
      mainBadge.text(postCount);  // 메인 아이콘 게시글 갯수 나타내기
    }
    date = getFormatDate(new Date(data.postList[postLength - 1].date));
    isMain = true;
    loading.fadeOut('slow');
  });

  // 검색한 단어에 대한 게시글 최신 순으로 나열
  socket.on('responseSearch', function(data){
    var postLength = data.postList.length;
    if (postLength === 0) {
      if (postCount === 0) {
        posts.append(`
          <div class="alert alert-danger" role="alert"><strong>Sorry,</strong> can't search your request posts.</div>
        `);
      }
      loading.fadeOut('slow');
      return;
    }
    for (var i = 0; i < postLength; i++) {
      if (id !== '') {
        posts.append(`
          <h3 id="interestButton`+ postCount +`" onclick="addItem(`+ postCount +`)"><span id="addItem" class="label label-success">관심상품 추가</span></h3>
          <input type="hidden" id="postUrl`+ postCount +`" value="` + data.postList[i].postUrl + `">
          <input type="hidden" id="isMarkLike`+ postCount +`" value="noMark">
          <iframe src="https://www.facebook.com/plugins/post.php?href=`+ data.postList[i].postUrl +`&width=500&show_text=true&appId=1726723337618733&height=772" width="500" height="772" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
        `);
        // 관심 상품에 추가 된 게시글은 관심 상품 표시하기
        for (var j = 0; j < postArr.length; j++) {
          if (data.postList[i].postUrl == postArr[j]) {
            var iButton = $('#interestButton' + postCount);
            console.log(iButton);
            iButton.empty();
            iButton.append(`
              <h3><span class="label label-primary"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>관심 상품</span></h3>
            `);
            $('#isMarkLike' + postCount).val('mark');
          }
        }
      } else {
        posts.append(`
          <iframe src="https://www.facebook.com/plugins/post.php?href=`+ data.postList[i].postUrl +`&width=500&show_text=true&appId=1726723337618733&height=772" width="500" height="772" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
        `);
      }
      postCount++;
      mainBadge.text(postCount);
    }
    date = getFormatDate(new Date(data.postList[postLength - 1].date));
    isSearch = true;
    loading.fadeOut('slow');
  });

  // 관심 상품에 대한 게시글 나열하기
  socket.on('responseLikePosts', function(data){
    var postLength = data.likeList.length;
    if (postLength === 0) {
      if (postCount === 0) {
        posts.append(`
          <div class="alert alert-danger" role="alert">등록하신 관심 상품이 존재하지 않습니다. 관심 상품을 추가해 보세요!</div>
        `);
      }
      loading.fadeOut('slow');
      return;
    }
    for (var i = 0; i < postLength; i++) {
        posts.append(`
          <h3 id="interestButton`+ postCount +`" onclick="addItem(`+ postCount +`)"><span id="addItem" class="label label-success">관심상품 추가</span></h3>
          <input type="hidden" id="postUrl`+ postCount +`" value="` + data.likeList[i].postUrl + `">
          <input type="hidden" id="isMarkLike`+ postCount +`" value="noMark">
          <iframe src="https://www.facebook.com/plugins/post.php?href=`+ data.likeList[i].postUrl +`&width=500&show_text=true&appId=1726723337618733&height=772" width="500" height="772" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
        `);
        // 관심 상품에 추가 된 게시글은 관심 상품 표시하기

        for (var j = 0; j < postArr.length; j++) {
          if (data.likeList[i].postUrl == postArr[j]) {
            var iButton = $('#interestButton' + postCount);
            console.log(iButton);
            iButton.empty();
            iButton.append(`
              <h3><span class="label label-primary"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>관심 상품</span></h3>
              <input type="hidden" id="isLike`+ postCount +`" value="like">
            `);
            $('#isMarkLike' + postCount).val('mark');
          }
        }
        postCount++;
        console.log(new Date(data.likeList[i].date));
    }
    date = getFormatDate(new Date(data.likeList[postLength - 1].date));
    isLike = true;
    loading.fadeOut('slow');
  });

  // search start
  $('#searchPosts').click(function(){
      searchStart()
  });

  // enter key search start
  $("input[name=searchKeywords]").keypress(function(e) {
    if (e.keyCode == 13){
      searchStart()
    }
  });

  // 관심 상품 버튼 클릭 시
  $('#showLikeItems').click(function(){
    date = '0'; // date 초기화
    postCount = 0; // post 갯수 초기화
    mainMenu.toggleClass("active");
    likeMenu.toggleClass("active");
    mainBadge.hide();
    posts.empty();
    requestLikePosts();
  });

  // 메인 메뉴 클릭 시 새로 게시글 데이터 요청
  mainMenu.click(function(){
    date = '0'; // date 초기화
    postCount = 0; // post 갯수 초기화
    mainMenu.toggleClass("active");
    likeMenu.toggleClass("active");
    mainBadge.show();
    posts.empty();
    requestPosts();
  });
});

// 검색 함수
function searchStart() {
  var text = $('input[name=searchKeywords]').val();
  date = '0'; // date 초기화
  postCount = 0; // post 갯수 초기화
  if (text.length === 0) {
    alert('키워드를 입력하세요.');
    return;
  }
  keywords = text.split(' ');
  posts.empty();
  requestSearchPosts();
}

// 게시글 요청
function requestPosts() {
  isSearch = false;
  isLike = false; // 관심상품 게시글 무한 스크롤 데이터 요청 스탑
  loading.show();
  socket.emit("responsePosts", {date: date, authId: id});
}

// 무한 스크롤에 따른 search 게시글 추가 요청 함수
function requestSearchPosts() {
  isMain = false;
  isLike = false; // 관심상품 게시글 무한 스크롤 데이터 요청 스탑
  loading.show();
  if (keywords.length === 1) {
    socket.emit('requestSearch', { keyword1: keywords[0], date: date });
  } else if (keywords.length === 2) {
    socket.emit('requestSearch', { keyword1: keywords[0], keyword2: keywords[1], date: date });
  } else if (keywords.length === 3) {
    socket.emit('requestSearch', { keyword1: keywords[0], keyword2: keywords[1], keyword3: keywords[2], date: date });
  } else {
    socket.emit('requestSearch', { keyword1: keywords[0], keyword2: keywords[1], keyword3: keywords[2], date: date });
  }
}

// 관심 상품 목록 요청
function requestLikePosts() {
  isMain = false;
  isSearch = false; // search에 대한 무한 스크롤 데이터 요청 스탑
  loading.show();
  socket.emit("requestLikePosts", {date: date, authId: id});
}

// 관심상품 추가
function addItem(num) {
  var isMarkLike = $('#isMarkLike' + num);
  var postUrlId = $('#postUrl' + num);
  var itemUrl = postUrlId.val();
  var iButton = $('#interestButton' + num);
  console.log("here20: " + isMarkLike.val());
  if (isMarkLike.val() === 'mark') {
    socket.emit("requestDeleteLikePost", { authId: id, postUrl: itemUrl });
    iButton.empty();
    iButton.hide();
    iButton.fadeIn('slow');
    iButton.append(`
      <span id="addItem" class="label label-success">관심상품 추가</span>
    `);
    isMarkLike.val('noMark');
    console.log("here10: " + isMarkLike.val());
    postArr.splice(postArr.indexOf(itemUrl), 1);  // 관심상품 저장 배열에서 제거
  } else {
    socket.emit("requestSavePost", { authId: id, postUrl: itemUrl });
    iButton.empty();
    iButton.hide();
    iButton.fadeIn('slow');
    iButton.append(`
      <h3><span class="label label-primary"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>관심 상품</span></h3>
    `);
    isMarkLike.val('mark');
    postArr.push(itemUrl);  // 페이지 첫 리로드했을 때 이 배열에 관심 상품 url들이 채워지는데 socket으로 추가했을 경우 배열이 최신화가 안되어서 직접 push
  }
  likeBadge.text(postArr.length);
}

// 카테고리 하위 메뉴 클릭 시 데이터 가져오기
function moveToCategory(categoryName) {
  var text = $('input[name=searchKeywords]').val();
  date = '0'; // date 초기화
  postCount = 0; // post 갯수 초기화
  isMain = false;
  isLike = false; // 관심상품 게시글 무한 스크롤 데이터 요청 스탑
  keywords = categoryName.split(' ');
  posts.empty();
  requestSearchPosts();
  if (window.innerWidth < 1430) {
    closeNav();
  }
}

// 네비게이션 열기
function openNav() {
    $('#category').css("left", 0);
}

// 네비게이션 닫기
function closeNav() {
    $('#category').css("left", -$('#category').width() - 2 * parseInt($('#category').css('padding-left')));
}

// 상위 메뉴의 아이콘들만 보이게 하기
if (window.innerWidth < 400) {
  $('#mainIcon').empty();
  $('#likeIcon').empty();
  $('#myInfoIcon').empty();
}

// 화면을 작게 해서 카테고리 숨기면 다시 키웠을 때 카테고리 없어지는 부분 해결
$(window).resize(function(){
  if (window.innerWidth > 1430) {
    $('#category').css({
      left: '50%',
      marginLeft: '-700px'
    });
  } else if (window.innerWidth < 1430) {
    $('#category').css({
      left: '-400px',
      marginLeft: '0px'
    });
  }
}).resize();


// 무한 스크롤
$(window).scroll(function() {
    // 스크롤바가 끝에 도달하였을 때
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
      console.log('test')
      if (isLike) {  // 검색어에 대한 무한 스크롤 데이터 가져오기
        requestLikePosts()
      } else if (isSearch) {
        requestSearchPosts();
      } else if (isMain){
        requestPosts(date);
      }
    }
});

// 날짜 포맷 함수 YY-MM-DD XX:XX:XX
function getFormatDate(date){
	var year = date.getFullYear();
	var month = (1 + date.getMonth());
	month = month >= 10 ? month : '0' + month;     // month 두자리로 저장
	var day = date.getDate();
	day = day >= 10 ? day : '0' + day; //day 두자리로 저장
  var splitDate = date.toString().split(' ');
	return  year + '-' + month + '-' + day + ' ' + splitDate[4];
}

/* 외부 소스 사용 (https://codepen.io/Creaticode/pen/ecAmo)
   카테고리 드롭 다운 애니메이션
*/
$(function() {
	var Accordion = function(el, multiple) {
		this.el = el || {};
		this.multiple = multiple || false;

		// Variables privadas
		var links = this.el.find('.link');
		// Evento
		links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
	}

	Accordion.prototype.dropdown = function(e) {
		var $el = e.data.el;
			$this = $(this),
			$next = $this.next();

		$next.slideToggle();
		$this.parent().toggleClass('open');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
		};
	}

	var accordion = new Accordion($('#accordion'), false);
});
