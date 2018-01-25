var CommentModel = function(data) {
    var ret = {};
    ret.cid = data.cid;
    ret.cname = data.cname;
    ret.time = data.time ;
    ret.photo = data.photo;
    ret.comment = data.comment;
    ret.advisorId = data.advisorId;
    return ret;

}
module.exports.CommentModel = CommentModel;