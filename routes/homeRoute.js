module.exports = function(conn, express){
  var route = express.Router();

  route.get('/', function(req, res){
    if (req.user) {
      res.render('home', {
        id: true,
        authId: req.user.id
      });
    } else {
      res.render('home', {
        id: false,
        authId: ''
      });
    }
  });

  return route;
}
