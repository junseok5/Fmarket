// form의 태그 받아오기
var postSubmit = $("#postSubmit");
var path = window.location.pathname;

$("input[name=searchKeywords]").attr('disabled', 'disabled');
$("#likeMenu").toggleClass("active");
$("#myInfoMenu").toggleClass("active");
$('#mainMenu').toggleClass("active");
$('#hamburger-icon').hide();
$('#showLikeItems').hide();

$(document).ready(function() {

    $('#mainMenu').click(function(){
      location.href = '/';
    });

    // 업로드 버튼 클릭 시 유효성 검사
    postSubmit.click(function(){
      var title = $("input[name=title]");
      var postUrl = $("input[name=postUrl]");
      var category = $("input[name=category]");
      var subCategory = $("input[name=subCategory]");
      var sellerAlert = $('#sellerAlert');
      // url 패턴
      // var urlChk = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w_\.-]*)*\/?$/;
      var urlChk = /^http[s]?\:\/\//i;

      if (title.val() == "") {
        title.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 제목을 입력하세요.');
        sellerAlert.fadeIn('slow');
        return;
      } else if (postUrl.val() == "") {
        postUrl.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 게시글 URL을 입력하세요.');
        sellerAlert.fadeIn('slow');
        return;
      } else if (category.val() == "") {
        category.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 카테고리를 선택하세요.');
        sellerAlert.fadeIn('slow');
        return;
      } else if (subCategory.val() == "") {
        subCategory.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 하위 카테고리를 선택하세요.');
        sellerAlert.fadeIn('slow');
        return;
      }

      if (!urlChk.test(postUrl.val())) {
        postUrl.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 게시글 URL 양식이 맞지 않습니다.');
        sellerAlert.fadeIn('slow');
        return;
      }
      alert("성공적으로 게시물을 업로드하였습니다.");
      $('#postForm').submit();
    });
});

// category 선택 시 sub category 보이기
function showSubCategory() {
  var category = $("input[name=category]");
  var showSubCategory = $("#showSubCategory");
  if (category.val() === "BEST") {
    showSubCategory.empty();
    showSubCategory.append(`
    <input list="subCategory" name= "subCategory" placeholder="Sub category">
    <datalist id= "subCategory">
        <option value= "커플룩">커플룩</option>
        <option value= "반팔셔츠">반팔셔츠</option>
        <option value= "남친룩">남친룩</option>
    </datalist><br />
    `);
    showSubCategory.fadeIn('slow');
  } else if (category.val() === "OUTER") {
    showSubCategory.empty();
    showSubCategory.append(`
      <input list="subCategory" name= "subCategory" placeholder="Sub category">
      <datalist id= "subCategory">
          <option value= "자켓/점퍼">자켓/점퍼</option>
          <option value= "패딩/봄버">패딩/봄버</option>
          <option value= "코트">코트</option>
      </datalist><br />
    `);
    showSubCategory.fadeIn('slow');
  } else if (category.val() === "TOP") {
    showSubCategory.empty();
    showSubCategory.append(`
      <input list="subCategory" name="subCategory" placeholder="Sub category">
      <datalist id= "subCategory">
          <option value= "반팔/7부티">반팔/7부티</option>
          <option value= "스트라이프/프린팅티">스트라이프/프린팅티</option>
          <option value= "루즈/오버핏">루즈/오버핏</option>
          <option value= "긴팔티/맨투맨">긴팔티/맨투맨</option>
          <option value= "니트티">니트티</option>
      </datalist><br />
    `);
    showSubCategory.fadeIn('slow');
  } else if (category.val() === "SHIRTS") {
    showSubCategory.empty();
    showSubCategory.append(`
      <input list="subCategory" name="subCategory" placeholder="Sub category">
      <datalist id= "subCategory">
          <option value= "기본셔츠">기본셔츠</option>
          <option value= "차이나셔츠">차이나셔츠</option>
          <option value= "체크/패턴/데님셔츠">체크/패턴/데님셔츠</option>
      </datalist>
    `);
    showSubCategory.fadeIn('slow');
  } else if (category.val() === "PANTS") {
    showSubCategory.empty();
    showSubCategory.append(`
      <input list="subCategory" name="subCategory" placeholder="Sub category">
      <datalist id= "subCategory">
          <option value= "런던 슬랙스">런던 슬랙스</option>
          <option value= "슬랙스">슬랙스</option>
          <option value= "청바지">청바지</option>
          <option value= "면바지">면바지</option>
          <option value= "반바지">반바지</option>
          <option value= "밴딩 팬츠">밴딩 팬츠</option>
          <option value= "트레이닝">트레이닝</option>
      </datalist>
    `);
    showSubCategory.fadeIn('slow');
  }
}

function logout(){
  localStorage.removeItem('autoLogin', false);
  location.href = '/logout';
}
