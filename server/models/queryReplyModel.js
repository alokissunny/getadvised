var ReplyModel = function (data) {
    var ret = {};
    ret.message = data.message;
    ret.repliedBy = data.repliedBy;
    ret.repliedOn = data.repliedOn;

    return ret;

}
module.exports.ReplyModel = ReplyModel;