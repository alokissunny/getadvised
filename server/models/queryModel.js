var QueryModel = function (data) {
    var ret = {};
    ret.subject = data.subject;
    ret.message = data.message;
    ret.advisor = data.advisor;
    ret.requestor = data.requestor;
    ret.requestOn = data.requestOn;

    return ret;

}
module.exports.QueryModel = QueryModel;