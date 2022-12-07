// ==UserScript==
// @name         OP Admin Panel
// @version      1.0.0
// @description  For when you need just a lil' bit more juice
// @author       Guro
// @match        https://control.stripchat.com/new/photos/moderation
// @icon         https://control.my.club/favicon.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM.xmlHttpRequest
// @grant        GM_webRequest
// @grant        GM_addStyle
// @downloadURL  https://raw.githubusercontent.com/gurobase/modscript/main/op_admin_panel.js

// ==/UserScript==



var adminArray;
if (typeof GM_getValue("agentArray") == "undefined") {
    console.log("Agent array missing. Creating...")
    GM_setValue("agentArray", []);
} else {
    console.log("Agent array loaded. Total amount of agents stored:" + ` ${GM_getValue("agentArray").length}`);
    

}



if (window.location.href == "https://control.stripchat.com/new/photos/moderation") {



  


    



    var photoIDArray = [];
    var diffRecordArray = [];
    var agentIDArray = [];
    var agentArray = [];


    var getReviewerDiv = document.createElement('div');
    getReviewerDiv.id = "getReviewerDiv";
    getReviewerDiv.innerHTML = `<button id="getReviewerButton" class="button is-primary" type=button>Get Reviewers</button>`

    function getReviewers() {
        document.getElementById("getReviewerButton").disabled = true;
        photoIDArray = [];
        console.log("Getting Photo IDs")
        var table = document.getElementsByClassName("table");
        var t = table[0];
        rowArray = t.rows;
        for (var r = 1; r < t.rows.length - 1; r++) {
            let checkbox = t.rows[r].querySelector("td.column-actions > div > div:nth-child(1) > label > input[type=checkbox]");
            let photoID = checkbox.value.split(":")[2];
            photoIDArray.push(photoID);
        }
        console.log(photoIDArray);
        getDiffRecords(photoIDArray);

    }

    function getDiffRecords(photoIDArray) {
        console.log("Getting Record Diffs");
        diffRecordArray = [];
        let diffRecordPromises = photoIDArray.map(photoID => new Promise(resolve => {
            let diffRecordURL = `https://control.stripchat.com/api/admin/diff?order=asc&limit=20&offset=0&recordId=${photoID}&tableName=photos&filters[recordId]=${photoID}&filters[tableName]=photos`;

            GM.xmlHttpRequest({
                method: "GET",
                url: diffRecordURL,
                headers: {
                    "User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
                    "Accept": "text/xml" // If not specified, browser defaults will be used.
                },
                onload: function(response) {
                    var responseXML = null;
                    // Inject responseXML into existing Object (only appropriate for XML content).
                    if (!response.responseXML) {
                        responseXML = new DOMParser()
                            .parseFromString(response.responseText, "text/xml");
                    }
                    var jsonResponse = JSON.parse(response.responseText);
                    let diffRecord = jsonResponse.changes[0].fields.requestId.current;
                    resolve(diffRecord);
                }
            });
        }));

        Promise.all(diffRecordPromises).then(results => {
            console.log(results);
            diffRecordArray = results;
            getAgentIds(diffRecordArray);
        });    
        
    }

    function getAgentIds(diffRecordArray) {
        console.log("Getting Agent IDs");
        agentIDArray = [];

        let agentIdPromises = diffRecordArray.map(diffRecord => new Promise(resolve => {
            let requestURL = `https://control.stripchat.com/api/admin/requests?order=asc&limit=20&offset=0&filters[requestId]=${diffRecord}`;

            GM.xmlHttpRequest({
                method: "GET",
                url: requestURL,
                headers: {
                    "User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
                    "Accept": "text/xml" // If not specified, browser defaults will be used.
                },
                onload: function(response) {
                    var responseXML = null;
                    // Inject responseXML into existing Object (only appropriate for XML content).
                    if (!response.responseXML) {
                        responseXML = new DOMParser()
                            .parseFromString(response.responseText, "text/xml");
                    }
                    var jsonResponse = JSON.parse(response.responseText);

                    if (!jsonResponse.requests[0]) {
                        resolve(0);
                    } else if (jsonResponse.requests[0].method === 'POST'){
                        resolve(1);
                    } else {
                        resolve(jsonResponse.requests[0].params.initiatorId);
                    }
                    
                }
            });
        }));

        Promise.all(agentIdPromises).then(results => {
            console.log(results);
            agentIDArray = results;
            getAgents(agentIDArray);
        });    
        
    }

    function getAgents(agentIdArray) {
        console.log("Getting Agent Usernames");
        let currentAgent;
        
        agentArray = [];
        let agentPromises = agentIdArray.map(agentId => new Promise(resolve => {
            if (agentId == 0 || agentId == 1) {
                resolve(0);
            } else if(GM_getValue("agentArray").find(x => x.id === agentId)) {
                currentAgent = GM_getValue("agentArray").find(x => x.id === agentId);
                resolve({id : currentAgent.id, username : currentAgent.username});
            } else {
                let userURL = `https://control.stripchat.com/api/admin/users?search=${agentId}&order=asc&limit=20&offset=0&blocked=&deleted=&filters[search]=${agentId}&filters[blocked]=&filters[deleted]=`;

                GM.xmlHttpRequest({
                    method: "GET",
                    url: userURL,
                    headers: {
                        "User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
                        "Accept": "text/xml" // If not specified, browser defaults will be used.
                    },
                    onload: function(response) {
                        var responseXML = null;
                        // Inject responseXML into existing Object (only appropriate for XML content).
                        if (!response.responseXML) {
                            responseXML = new DOMParser()
                                .parseFromString(response.responseText, "text/xml");
                        }
                        var jsonResponse = JSON.parse(response.responseText);
                        resolve({id : jsonResponse.users[0].id, username : jsonResponse.users[0].username});
                    }
                });
            }
            
        }));

        Promise.all(agentPromises).then(results => {
            let tempArray = [];
            let currentIndex = 1;
            console.log(results);
            results.forEach(agent => {
                if(GM_getValue("agentArray").find(x => x.id === agent.id)) {
                    
                } else {
                    tempArray = GM_getValue("agentArray");
                    tempArray.push({id : agent.id, username : agent.username});

                    GM_setValue("agentArray", tempArray);
                }

                let agentId;
                let agentUsername;
                if (agent == 0) {
                    agentId = "N/A";
                    agentUsername = "N/A";
                } else {
                    agentId = agent.id;
                    agentUsername = agent.username;
                }
                document.querySelector(`body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > tbody > tr:nth-child(${currentIndex}) > td:nth-child(3)`).innerHTML = `<b>${agentUsername}</b> (${agentId})`
                currentIndex++;
            });
            document.getElementById("getReviewerButton").disabled = false;
        });  
    }


    function waitForWebsite() {

        if (document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > tbody > tr:nth-child(2)")) {

            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.initiatorType === "fetch") {
                    let reviewerList = document.getElementsByClassName("reviewer");
                    for (var i = 0; i < reviewerList.length; i++) {
                        reviewerList[i].innerHTML = "";
                    }
                    console.log('Fetch request detected to', entry.name);
                    insertReviewerTd();
                  }
                }
              });
              
              observer.observe({
                type: "resource", name: "https://control.stripchat.com/api/admin/v2/photos/list"
              });


            let upperDiv = document.querySelector("body > div > div > main > section > div");
            upperDiv.appendChild(getReviewerDiv);
            document.getElementById("getReviewerButton").addEventListener('click', getReviewers);
            insertReviewerTd();
            submitButtons = document.getElementsByClassName("button is-primary");
            paginationButtons = document.getElementsByClassName("pagination-link");
        } else {
            setTimeout(waitForWebsite, 15);
        }
    }

    waitForWebsite();
}


function insertReviewerTd() {
    
    if (!document.getElementById("headReviewTh")) {
        var headPart = document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr");
        var headReviewTh = document.createElement('th');
        headReviewTh.id = "headReviewTh";
        headReviewTh.innerHTML = "Reviewer"
        headPart.insertBefore(headReviewTh, headPart.querySelector("th:nth-child(3)"));
    }
    
    

    var table = document.getElementsByClassName("table");
    var t = table[0];
    rowArray = t.rows;
    for (var r = 1; r < t.rows.length - 1; r++) {
        if (t.rows[r].getElementsByClassName("reviewer").length == 0) {
            var reviewerTd = document.createElement('td');
            reviewerTd.classList.add("reviewer");
            t.rows[r].insertBefore(reviewerTd, t.rows[r].querySelector("td:nth-child(3)"));
        }
        
    }
}

