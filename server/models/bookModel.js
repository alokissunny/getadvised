var BookModel = function (data) {
    var ret = {};
    ret.start = data.start;
    ret.title = data.title;
    ret.requestor = data.requestor;
    ret.requestorName = data.requestorName;
    ret.advisor = data.advisor;
    ret.advisorName = data.advisorName;
    ret.message = data.message;
    ret.time = data.time;
    return ret;

}
module.exports.BookModel = BookModel;