var QueryModel = function (data) {
    var ret = {};
    ret.subject = data.subject;
    ret.message = data.message;
    ret.advisor = data.advisor;
    ret.requestor = data.requestor;
    ret.requestOn = data.requestOn;
    ret.unreadForRequestor = data.unreadForRequestor;
    ret.unreadForAdvisor = data.unreadForAdvisor;
    ret.reply = data.reply;
    ret.deleteForRequestor = data.deleteForRequestor;
    ret.deleteForAdvisor = data.deleteForAdvisor;
    return ret;

}
module.exports.QueryModel = QueryModel;