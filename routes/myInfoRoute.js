module.exports = function(conn, express){
  var route = express.Router();

  route.get('/myInfo', function(req, res){
    if (req.user) { // 로그인 되어 있으면
      var sql = 'select company, companySite,facebookSite, manager, managerPhoneNum from sellerInfo where authId = ?';
      conn.query(sql, [req.user.id], function(err, results){
        if (results.length === 0) { // 판매자가 아니라면
          res.render('myInfo', {
            seller: false,
            displayName: req.user.displayName,
            photos: req.user.photos[0].value,
            profileUrl: req.user.profileUrl
          });
        } else {  // 판매자라면
          res.render('myInfo', {
            seller: true,
            displayName: req.user.displayName,
            photos: req.user.photos[0].value,
            profileUrl: req.user.profileUrl,
            company: results[0].company,
            companySite: results[0].companySite,
            facebookSite: results[0].facebookSite,
            manager: results[0].manager,
            managerPhoneNum: results[0].managerPhoneNum
          });
        }
      });

    } else {  // 비로그인 상태
      res.redirect('/');
    }
  });

  // 게시글 업로드
  route.post('/upload', function(req, res){
    var info = {
      'title': req.body.title,
      'postUrl': req.body.postUrl,
      'category': req.body.category,
      'subCategory': req.body.subCategory
    }
    var sql = 'insert into posts (authId, title, postUrl, category, subCategory, date) values(?, ?, ?, ?, ? , NOW())';
    conn.query(sql, [req.user.id, info.title, info.postUrl, info.category, info.subCategory], function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("success post insert!");
      }
    });

    res.redirect('/myInfo');
  });

  return route;
}
