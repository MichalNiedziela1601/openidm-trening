
var params = {'_queryFilter' : 'uid eq "bfleming"'}; var managerObject = openidm.query("system/corporateLDAP/account", params); managerObject.result[0].mail;
