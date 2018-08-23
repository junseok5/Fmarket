module.exports = function(conn, express){
  var route = express.Router();

  route.get('/seller', function(req, res){
    if (req.user) {
      var sql = 'select authId from sellerInfo where authId = ?';
      conn.query(sql, [req.user.id], function(err, result){
        if (err) {
          console.log(err);
        } else {
          if (result.length !== 0) {
            res.redirect('/');
          } else {
            res.render('seller', {
              id: true
            });
          }
        }
      });
    } else {
      res.redirect('/');
    }
  });

  // seller 등록 form 제출 받아서 저장
  route.post('/seller-regist', function(req, res){
    var info = {
      'companyName': req.body.companyName,
      'companyUrl': req.body.companyUrl,
      'facebookUrl': req.body.facebookUrl,
      'managerName': req.body.managerName,
      'managerPhoneNum': req.body.managerPhoneNum
    }
    var sql = 'insert into sellerInfo (authId, company, companySite, facebookSite, manager, managerPhoneNum, date) values(?, ?, ?, ?, ? ,?, NOW())';
    conn.query(sql, [req.user.id, info.companyName, info.companyUrl, info.facebookUrl, info.managerName, info.managerPhoneNum], function(err, results){
      if (err) {
        console.log(err);
      } else {
        console.log("success seller insert!");
      }
    });

    res.redirect('/myInfo');
  });

  return route;
}
