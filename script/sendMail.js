var params = new Object();
params.from = "openidm@example.com";
params.to="forgerock@openidm.example.com";
params.subject="IDM test mail from script";
params.type="text/plain";
params.body = "Hallo World";
openidm.action("external/email","send", params);
