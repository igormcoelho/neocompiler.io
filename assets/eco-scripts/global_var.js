var cSharpFiles = [
    ["./assets/sc_examples/csharp/HelloWorld.cs"],
    [
        ["./assets/sc_examples/csharp/NNS/NameService.cs"],
        ["./assets/sc_examples/csharp/NNS/NameState.cs"],
        ["./assets/sc_examples/csharp/NNS/RecordType.cs"]
    ]
];

var NETWORK_MAGIC = -1;
var GAS_ASSET = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
var NEO_ASSET = "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5";

var USER_EXAMPLES = new Map();

var LOCAL_DEVELOPMENT = false;
if (this.window.location.href.indexOf("localhost") != -1)
    LOCAL_DEVELOPMENT = true;

var default_nodes = ecoNodes;
if (LOCAL_DEVELOPMENT) {
    default_nodes = localHostNodes;
    $("#ecolabnetworkurlselection")[0].selectedIndex = 2;
}

// ECO SERVICES EXPRESS SERVER RPC PATH
var BASE_PATH_ECOSERVICES = getFirstAvailableService("ecoservices", default_nodes);
var BASE_PATH_COMPILERS = getFirstAvailableService("ecocompilers", default_nodes);
var BASE_PATH_CLI = getFirstAvailableService("RPC", default_nodes);
var BASE_PATH_CLI_NODES = getAllAvailableService("RPC", default_nodes);

function getServiceURLByTypeAndNetwork(serviceType, networkService) {
    var serviceUrlToAdd = '';

    //if ((serviceType == "RPC") && (networkService.type == serviceType)) {
    if (networkService.type == serviceType) {
        if (networkService.protocol)
            serviceUrlToAdd = networkService.protocol + "://" + networkService.url;
        if (networkService.port)
            serviceUrlToAdd += ":" + networkService.port;

        return serviceUrlToAdd;
    }

    //if (networkService.type == serviceType) {
    //    serviceUrlToAdd = networkService.url;
    //}

    return serviceUrlToAdd;
}


function getFirstAvailableService(serviceType, networkServicesObj) {
    for (var kn = 0; kn < networkServicesObj.length; kn++) {
        var serviceUrlToAdd = getServiceURLByTypeAndNetwork(serviceType, networkServicesObj[kn]);

        if (serviceUrlToAdd !== '')
            return serviceUrlToAdd;
    }
}

function getAllAvailableService(serviceType, networkServicesObj) {
    var nodesUrl = [];
    for (var kn = 0; kn < networkServicesObj.length; kn++) {
        var serviceUrlToAdd = getServiceURLByTypeAndNetwork(serviceType, networkServicesObj[kn]);

        if (serviceUrlToAdd !== '')
            nodesUrl.push(serviceUrlToAdd);
    }
    return nodesUrl;
}

var code_cs = "";

/* SOCKET */
var socket;
var socketCompilers;

var refreshHeadersNeoCli = 0;

var NUMBER_FAILS_REQUESTS = 0;

var RELAYED_TXS = [];

/* ACE SESSIONS */
var openedSessions = new Map();