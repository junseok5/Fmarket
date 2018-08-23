// form의 태그 받아오기
var sellerUpload = $("#sellerUpload");

// main 화면 외에는 검색할 수 없음
$("input[name=searchKeywords]").attr('disabled', 'disabled');
$("#likeMenu").toggleClass("active");
$('#mainMenu').toggleClass("active");
$('#hamburger-icon').hide();
$('#showLikeItems').hide();

$(document).ready(function() {
    $('#mainMenu').click(function(){
      location.href = '/';
    });

    $("#myInfoMenu").click(function(){
      location.href = '/myInfo';
    });

    // 판매자 등록 유효성 검사, 제출
    sellerUpload.click(function(){
      var companyName = $('input:text[name="companyName"]');
      var companyUrl = $('input:text[name="companyUrl"]');
      var facebookUrl = $('input:text[name="facebookUrl"]');
      var managerName = $('input:text[name="managerName"]');
      var managerPhoneNum = $('input:text[name="managerPhoneNum"]');
      var sellerAlert = $('#sellerAlert');

      // 폰 번호 패턴
      var phoneChk = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
      // url 패턴
      var urlChk = /^http[s]?\:\/\/facebook.com\//i;

      // 비어있는 값 확인하여 경고 후 리턴
      if (companyName.val() == "") {
        companyName.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 회사 이름을 입력하세요.');
        sellerAlert.fadeIn('slow');
        return;
      } else if (facebookUrl.val() == "") {
        facebookUrl.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> Facebook 페이지 주소를 입력하세요.');
        sellerAlert.fadeIn('slow');
        return;
      } else if (managerName.val() == "") {
        managerName.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 담당자 이름을 입력하세요.');
        sellerAlert.fadeIn('slow');
        return;
      } else if (managerPhoneNum.val() == "") {
        managerPhoneNum.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 담당자 연락처를 입력하세요.');
        sellerAlert.fadeIn('slow');
        return;
      }

      // 유효성 검사
      if (!urlChk.test(facebookUrl.val())) {
        facebookUrl.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 페이지 주소 양식이 맞지 않습니다.');
        sellerAlert.fadeIn('slow');
        return;
      } else if (!phoneChk.test(managerPhoneNum.val())) {
        managerPhoneNum.focus();
        sellerAlert.empty();
        sellerAlert.append('<strong>Warning!</strong> 전화번호 양식이 맞지 않습니다.');
        sellerAlert.fadeIn('slow');
        return
      }

      alert("성공적으로 등록하였습니다.");
      $('#sellerForm').submit();
    });
});
