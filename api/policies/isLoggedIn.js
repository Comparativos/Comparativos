module.exports = function(req, res, next){
  if(req.user){
    return next()
  } else {
    if (req.isSocket){
      // You're a socket.  Do cool socket stuff.
      return res.forbidden('You are not permitted to perform this action.')
    }
    else {
      // Just another HTTP request.
      return res.redirect('/login')
    }
  }
}