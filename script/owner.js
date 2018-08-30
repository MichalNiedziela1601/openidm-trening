if (source !== "unassigned") {
  var ownerQry = openidm.query("managed/user", {
    "_queryFilter": "userName eq '" + source + "'"
  });
  if (ownerQry.result.length === 1) {
    ({ _ref : "managed/user/" + ownerQry.result[0]._id});
  }
}
