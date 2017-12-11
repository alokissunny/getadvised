var QueryModel = function (data) {
    var ret = {};
    ret.subject = data.subject;
    ret.message = data.message;
    ret.advisor = data.advisor;
    ret.requestDate = data.requestDate;

    return ret;

}
module.exports.QueryModel = QueryModel;