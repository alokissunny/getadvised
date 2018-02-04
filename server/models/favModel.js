var FavModel = function (data) {
    var ret = {};
    ret.username = data.username;
    ret.fav = data.fav;
    ret.favCat = data.favCat;
    
    return ret;

}
module.exports.FavModel = FavModel;