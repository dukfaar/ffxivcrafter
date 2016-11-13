'use strict'

var mongoose=require('mongoose')
var User = mongoose.model('User')

module.exports = function() {

  return {
    update: function(req,res) {
      User.findByIdAndUpdate(req.user._id,{
        weaverLevel: req.body.weaverLevel,
        weaverSpecialist: req.body.weaverSpecialist,
        weaverMaster: req.body.weaverMaster,
        culinarianLevel: req.body.culinarianLevel,
        culinarianSpecialist: req.body.culinarianSpecialist,
        culinarianMaster: req.body.culinarianMaster,
        alchimistLevel: req.body.alchimistLevel,
        alchimistSpecialist: req.body.alchimistSpecialist,
        alchimistMaster: req.body.alchimistMaster,
        blacksmithLevel: req.body.blacksmithLevel,
        blacksmithSpecialist: req.bodyblacksmithSpecialist,
        blacksmithMaster: req.body.blacksmithMaster,
        carpenterLevel: req.body.carpenterLevel,
        carpenterSpecialist: req.body.carpenterSpecialist,
        carpenterMaster: req.body.carpenterMaster,
        armorerLevel: req.body.armorerLevel,
        armorerSpecialist: req.body.armorerSpecialist,
        armorerMaster: req.body.armorerMaster,
        goldsmithLevel: req.body.goldsmithLevel,
        goldsmithSpecialist: req.body.goldsmithSpecialist,
        goldsmithMaster: req.body.goldsmithMaster,
        leatherworkerLevel: req.body.leatherworkerLevel,
        leatherworkerSpecialist: req.body.leatherworkerSpecialist,
        leatherworkerMaster: req.body.leatherworkerMaster,
        minerLevel: req.body.minerLevel,
        minerFolklore: req.body.minerFolklore,
        botanistLevel: req.body.botanistLevel,
        botanistFolklore: req.body.botanistFolklore
      }, function (err,u) {
        if(err) throw err;

        res.send({})
      })
    }
  }
}
