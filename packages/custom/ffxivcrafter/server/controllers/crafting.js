'use strict';

var mongoose=require('mongoose');

var Recipe = mongoose.model('Recipe');
var Item = mongoose.model('Item');

function buildCraftingTree(item,amount,callback) {
  var returnValue={
    item: item,
    amount: amount,
    inputs: []
  };

  Recipe.find({'outputs.item':item})
  .populate({
    path:'outputs.item'
  })
  .populate({
    path:'inputs.item'
  })
  .exec(function(err,result) {
    if(err) throw err;

    if(result.length===0) {
      //item can not be crafted
      callback(returnValue);
      return;
    }

    var len=result[0].inputs.length;
    var countdown=len;

    if(countdown===0) {
      //item has no inputs? why?
      callback(returnValue);
      return;
    }

    for(var i=0;i<len;i++) {
      var input=result[0].inputs[i];

      buildCraftingTree(input.item,input.amount*amount,function(tree) {
        returnValue.inputs.push(tree);

        countdown--;
        if(countdown===0) {
          callback(returnValue);
        }
      });
    }
  });
}

function buildMaterialList(tree,list) {
  if(tree.inputs.length===0) {
    if(!list[tree.item._id]) list[tree.item._id]={item:tree.item,amount:0};
    list[tree.item._id].amount+=tree.amount;
  } else {
    for(var i=0;i<tree.inputs.length;i++) {
      var input=tree.inputs[i];

      buildMaterialList(input,list);
    }
  }
}

function getMaterialPrice(list) {
  var result=0;
  Object.keys(list).forEach(function(listKey,key,_array) {
    var material=list[listKey];
    material.price=material.item.price*material.amount;
    result+=material.price;
  });

  return result;
}

/*$http.get('/api/recipe/by_output/'+value.item._id)
.then(function(response) {
  if(response.data.length>0) {
   processRecipe(response.data[0],1);
 } else {
   if(!$scope.craftingMaterials[value.item._id]) {
     $scope.craftingMaterials[value.item._id]={item:value.item,amount:0};
   }

   $scope.craftingMaterials[value.item._id].amount+=value.amount*multiplier;
 }
});*/

module.exports = function() {
  return {
    craftItem:function(req,res) {
      Item.findById(req.params.id,function(err,targetItem) {
        if(err) throw err;

        var result = {};

        buildCraftingTree(targetItem,1,function(tree) {
          result.tree=tree;
          result.materialList={};

          buildMaterialList(result.tree,result.materialList);
          result.materialPrice=getMaterialPrice(result.materialList);
          res.send(result);
        });
      });
    }
  }
}
