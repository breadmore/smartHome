
module.exports = {
    initDevice: initDevice,
    initGateway: initGateway,
    initPolicy: initPolicy,
    initUser: initUser,
    initWebLog: initWebLog
}


/* Create device table */
function initDevice() {
    return "CREATE TABLE device ( id integer PRIMARY KEY AUTOINCREMENT," +
           "did text,"+
           "psk text,"+
           "oid text,"+
           "eid text,"+
           "sid text,"+
           "type integer,"+
           "conn integer,"+
           "auth integer,"+
           "reg integer,"+
           "gateway_id integer NOT NULL,"+
           "policy_id integer NOT NULL );"    
}


/* Create gateway table */
function initGateway() {
    return "CREATE TABLE gateway ( id integer PRIMARY KEY AUTOINCREMENT," +
           "uuid integer NOT NULL,"+
           "ip_address text NOT NULL,"+
           "type text NOT NULL,"+
           "mac text NOT NULL );"
}


/* Create policy table */
function initPolicy() {
    return "CREATE TABLE policy ( id integer," +
           "\"create\" integer DEFAULT NULL," +
           "\"read\" integer DEFAULT NULL," +
           "\"update\" integer," +
           "\"delete\" integer," +
           "notification integer," +
           "device_id integer NOT NULL );"
}



/* Create user table */
function initUser() {
    return "CREATE TABLE user ( id integer PRIMARY KEY AUTOINCREMENT," +
           "user_id text NOT NULL," +
           "password text NOT NULL," +
           "authority text NOT NULL );"
}


/* Create web_log table */
function initWebLog() {
    return "CREATE TABLE web_log ( id integer PRIMARY KEY AUTOINCREMENT," +
    "device_id integer," +
    "event text," +
    "event_level integer," +
    "\"datetime\" text );"
}



                         