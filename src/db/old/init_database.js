
module.exports = {
    initDevice: initDevice,
    initGateway: initGateway,
    initPolicy: initPolicy,
    initUser: initUser,
    initSensorLog: initSensorLog
}


/* Create device table */
function initDevice() {
    return "CREATE TABLE device ( id integer PRIMARY KEY AUTOINCREMENT," +
           "name text,"+
           "did text,"+
           "psk text,"+
           "oid text,"+
           "eid text,"+
           "sid text,"+
           "type integer,"+
           "connect integer,"+
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
           "server integer NOT NULL," + // 0 = false, 1 = true
           "device integer NOT NULL," + // 0 = false, 1 = true
           "\"create\" integer DEFAULT NULL," +
           "\"read\" integer DEFAULT NULL," +
           "\"update\" integer," +
           "\"delete\" integer," +
           "\"notificate\" integer );" 
}



/* Create user table */
function initUser() {
    return "CREATE TABLE user ( id integer PRIMARY KEY AUTOINCREMENT," +
           "user_id text NOT NULL," +
           "name text NOT NULL," +
           "password text NOT NULL," +
           "authority text NOT NULL );"
}


/* Create web_log table */
function initSensorLog() {
    return "CREATE TABLE sensor_log ( id integer PRIMARY KEY AUTOINCREMENT," +
    "device_id integer," +
    "state text," +
    "\"timestamp\" integer," +
    "room_state integer NOT NULL );" // 1 = 재실(in), 2 = 외출(out)
}



                         