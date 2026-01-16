function isAuthenticated(req, res, next) {
    if (!req.session.doctorId) {
      req.flash("error", "Please log in first");
      return res.redirect("/login");
    } else if (req.session.user) {
      return next();
    }
if (req.session.user === 'doctor') {
      return res.redirect('/register');
    }
    return next();
  }
  
  function isReceptionist(req, res, next) {
    if (req.session.user?.type === 'receptionist') return next();
    req.flash('error', 'Unauthorized access');
    res.redirect('/access');
  }
  function isDoctor(req,res,next){
    if(req.session.user?.type==='doctor')return next();
    req.flash('error', 'Unauthorized access');
    res.redirect('/access');
  }
  
  module.exports = {
    isAuthenticated,
    isReceptionist,
    isDoctor,
  };