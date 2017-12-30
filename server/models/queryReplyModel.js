var ReplyModel = function (data) {
    var ret = {};
    ret.message = data.message;
    ret.repliedBy = data.repliedBy;
    ret.repliedOn = data.repliedOn;
    ret.reply = data.reply;
    ret.lastUpdatedFrom = data.lastUpdatedFrom;
    return ret;

}
module.exports.ReplyModel = ReplyModel;