module.exports = function(conn, express, io){
  var route = express.Router();

  io.sockets.on('connection', function(socket){
      // socket 시작
      socket.emit('connected');

      // 게시글 정보 client에게 전달
      socket.on('responsePosts', function(data){
        if (data.date === '0') {  // 첫 데이터 요청 시
          var sql = 'select postUrl, date from posts order by date desc Limit 5';
          conn.query(sql, function(err, postList){
            if (err) {
              console.log(err);
            } else {
              console.log(postList);
              sql = 'select postUrl from interestPosts where authId = ?';
              conn.query(sql, [data.authId], function(err, ipostList){
                if (err) {
                  console.log(err);
                } else {
                  socket.emit('responsePosts', { postList: postList, ipostList: ipostList });
                }
              });
            }
          });
        } else {  // 스크롤이 끝에 도달하여 추가적인 데이터 요청 시
          var sql = 'select postUrl, date from posts where date < ? order by date desc Limit 5';
          conn.query(sql, [data.date], function(err, postList){
            if (err) {
              console.log(err);
            } else {
              console.log(postList);
              socket.emit('responsePosts', { postList: postList, ipostList: 0 });
            }
          });
        }
      });

      // search한 게시글 전달
      socket.on('requestSearch', function(data){
        if (data.date === '0') {
            if (data.keyword3) {  // keyword 3개
              var sql = "select postUrl,date from posts where title regexp '" + data.keyword1 + "|" + data.keyword2 + "|" + data.keyword3 + "' order by date desc Limit 5;";
              conn.query(sql, function(err, postList){
                if (err) {
                  console.log(err);
                } else {
                  console.log(postList);
                  socket.emit('responseSearch', { postList: postList });
                }
              });
            } else if (data.keyword2) {
              var sql = "select postUrl, date from posts where title regexp '" + data.keyword1 + "|" + data.keyword2 + "' order by date desc Limit 5;";
              conn.query(sql, function(err, postList){
                if (err) {
                  console.log(err);
                } else {
                  console.log(postList);
                  socket.emit('responseSearch', { postList: postList });
                }
              });
            } else {  // keyword 1개
              var sql = "select postUrl, date from posts where title regexp ? order by date desc Limit 5;";
              conn.query(sql, [data.keyword1], function(err, postList){
                if (err){
                  console.log(err);
                } else {
                  console.log(postList);
                  socket.emit('responseSearch', { postList: postList });
                }
              });
            }
        } else {
            if (data.keyword3) {  // keyword 3개
              var sql = "select postUrl,date from posts where title regexp '" + data.keyword1 + "|" + data.keyword2 + "|" + data.keyword3 + "' and date < ? order by date desc Limit 5";
              conn.query(sql, [data.date], function(err, postList){
                if (err) {
                  console.log(err);
                } else {
                  console.log(postList);
                  socket.emit('responseSearch', { postList: postList });
                }
              });
            } else if (data.keyword2) { // keyword 2개
              var sql = "select postUrl, date from posts where title regexp '" + data.keyword1 + "|" + data.keyword2 + "' and date < ? order by date desc Limit 5";
              conn.query(sql, [data.date], function(err, postList){
                if (err) {
                  console.log(err);
                } else {
                  console.log(postList);
                  socket.emit('responseSearch', { postList: postList });
                }
              });
            } else {  // keyword 1개
              var sql = "select postUrl, date from posts where title regexp ? and date < ? order by date desc Limit 5";
              conn.query(sql, [data.keyword1, data.date], function(err, postList){
                if (err){
                  console.log(err);
                } else {
                  console.log(postList);
                  socket.emit('responseSearch', { postList: postList });
                }
              });
            }
        }
      });

      // 관심 상품 추가
      socket.on('requestSavePost', function(data){
        var sql = "insert into interestPosts (authId, postUrl, date) values(?, ?, NOW())";
        conn.query(sql, [data.authId, data.postUrl], function(err){
          if (err) console.log(err);
          else console.log('Success save interest post');
        });
      });

      // 관심 상품 목록 불러들여서 클라이언트에게 전송
      socket.on('requestLikePosts', function(data){
        if (data.date === '0') {
          var sql = "select postUrl, date from interestPosts where authId = ? order by date desc Limit 5";
          conn.query(sql, [data.authId], function(err, likeList){
            if (err) {
              console.log(err);
            } else {
              socket.emit('responseLikePosts', { likeList: likeList });
              console.log('success reads like list');
            }
          });
        } else {
          var sql = "select postUrl, date from interestPosts where authId = ? and date < ? order by date desc Limit 5";
          conn.query(sql, [data.authId, data.date], function(err, likeList){
            if (err) {
              console.log(err);
            } else {
              socket.emit('responseLikePosts', { likeList: likeList });
              console.log('success reads like list');
            }
          });
        }
      });

      socket.on('requestDeleteLikePost', function(data){
        var sql = 'delete from interestPosts where authId = ? and postUrl = ?';
        conn.query(sql, [data.authId, data.postUrl], function(err){
          if (err) console.log(err);
          else console.log('Success delete post of interestPosts!');
        });
      })

  });

  return route;
}
