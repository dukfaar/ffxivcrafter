'use strict';

var mongoose=require('mongoose');
var User = mongoose.model('User');

module.exports = function() {

  return {
    update: function(req,res) {
      User.findByIdAndUpdate(req.user._id,{
        weaverLevel:req.body.weaverLevel,
        culinarianLevel:req.body.culinarianLevel,
        alchimistLevel:req.body.alchimistLevel,
        blacksmithLevel:req.body.blacksmithLevel,
        carpenterLevel:req.body.carpenterLevel,
        armorerLevel:req.body.armorerLevel,
        goldsmithLevel:req.body.goldsmithLevel,
        leatherworkerLevel:req.body.leatherworkerLevel,
        minerLevel:req.body.minerLevel,
        botanistLevel:req.body.botanistLevel
      },function(err,u) {
        if(err) throw err;

        res.send({});
      });
    }
  }
}
