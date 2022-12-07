// ==UserScript==
// @name         Shift Report Dumper
// @version      1.4.0
// @description  Dump yours shift reports with ease.
// @author       Guro
// @match        https://control.stripchat.com/report/supportAdmin
// @match        https://control.stripchat.com/spamAlerts
// @icon         https://control.my.club/favicon.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM.xmlHttpRequest
// @downloadURL  https://raw.githubusercontent.com/gurobase/modscript/main/shift_report_dumper.js

// ==/UserScript==
if (!GM_getValue("spamDone")) {
    GM_setValue("spamDone", 0)
}

if (!GM_getValue("lastSpam")) {
    GM_setValue("lastSpam", Date.now())
}

if (!GM_getValue("shiftReportType")) {
    GM_setValue("shiftReportType", 0);
}

function insertCss(css) {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    return style;
}

if (window.location.href == "https://control.stripchat.com/report/supportAdmin") {
    var customStyle = (`

	#textArea {
		background-image: linear-gradient(to right top, #a0b6d6, #8fc6db, #8fd3d1, #a8dcbf, #d0e0af);
		border-radius: 4px;
		padding: 7px;
		margin-top: 10px;
	}

	#saveUserButton, #fetchReportButton, #fetchShiftReportButton, #copyToClipboardButton {
		-webkit-transition: background-color 0.5s; /* For Safari 3.0 to 6.0 */
		transition: background-color 0.5s; /* For modern browsers */
		background-color: #00d1b2;
		border-width: 0px;
		border-radius: 4px;
		cursor: pointer;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		padding-bottom: calc(0.375em - 1px);
		padding-left: 0.75em;
		padding-right: 0.75em;
		padding-top: calc(0.375em - 1px);
		text-align: center;
		white-space: nowrap;
		color: #fff;
		margin-right: 5px;
	}

	#clearSpamCountButton {
		-webkit-transition: background-color 0.5s; /* For Safari 3.0 to 6.0 */
		transition: background-color 0.5s; /* For modern browsers */
		background-color:  #df636c;
		border-width: 0px;
		border-radius: 4px;
		cursor: pointer;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		padding-bottom: calc(0.375em - 1px);
		padding-left: 0.75em;
		padding-right: 0.75em;
		padding-top: calc(0.375em - 1px);
		text-align: center;
		white-space: nowrap;
		color: #fff;
		margin-right: 5px;
	}

	#clearSpamCountButton:hover {
		background-color:  #ad444c ;
	}

	#clearSpamCountButton:active {
		background-color:  #df636c ;
	}


	#saveUserButton:hover, #fetchShiftReportButton:hover, #fetchReportButton:hover {
		background-color: #00AD94;
	}

	#saveUserButton:active, #fetchShiftReportButton:active, #fetchReportButton:active {
		background-color: #64CEBF;
	}

	#copyToClipboardButton {
		border-width: 1px;
		margin-left: 5px;
		border-color: rgba(255, 255, 255, .3);
		animation: gradient 0.5s ease forwards;
		background: linear-gradient(-45deg, #ee7752BF, #e73c7eBF, #23a6d5BF, #23d5abBF);
		background-size: 400% 400%;
		!important;
	}

	#copyToClipboardButton:hover {

		animation: gradientHover 0.5s ease forwards;
		!important;
	}

	#copyToClipboardButton:active {

		animation: gradient 2s ease forwards;
		!important;

	}

	@keyframes gradientHover {
		0% {
			background-position: 1% 50%;
		}
		100% {
			background-position: 100% 50%;
		}
	}

	@keyframes gradient {
		0% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 1% 50%;
		}
	}

	#reportText {
		padding-bottom: calc(0.375em - 1px);
		padding-left: 0.75em;
		padding-right: 0.75em;
		padding-top: calc(0.375em - 1px);
		margin-top: 5px;
		margin-left: 5px;
		margin-right: 5px;
		margin-bottom: 5px;
		background-color: rgba(213, 242, 225, 0.5);

		background: rgb(219,228,241);
	background: linear-gradient(51deg, rgba(219,228,241,1) 0%, rgba(205,229,238,1) 25%, rgba(215,240,239,1) 50%, rgba(220,241,229,1) 75%, rgba(234,241,221,1) 100%);

		border-radius: 4px;
		!important
	}

	#myClubAdminSelect, shiftReportTypeSelect {
		margin-top: 0px;
		margin-bottom: 5px;
        width: 25%;
	}
	#myClubField, #reportTypeField{
		margin-top: 10px;
		line-height: 10px;
		margin-bottom: 4px;
	}

	#myClubDiv {
		line-height: 10px;
		margin-top: 10px;
		margin-bottom: 10px;
		!important;
	}

	#guro {
		position: absolute;
		bottom: -8px;
		right: 10px;
		font-size: 10px;
		font-weight: bold;
		!important;
	}

    #spamCheckboxDiv {
        margin-top: 10px;
        marging-bottom: 10px;
        margin-left: 5px;
    }

    #spamCheckbox {
        margin-right: 3px;
    }
	`)

    //Create elements
    var dumpNode = document.createElement('div');
    var guroUrl = "https://trafficstars.slack.com/team/U03HWAKN603";
    dumpNode.innerHTML = `<button id="saveUserButton" type="button">Save User<button id="fetchReportButton" type="button">Dump Queue</button></button><button id="fetchShiftReportButton" type="button">Dump Shift Report</button><button id="clearSpamCountButton" type="button">Clear Spam Count</button><br><div id="textArea"><div id="reportText"></div><button id="copyToClipboardButton" type="button">Copy to clipboard</button><a href=${guroUrl} id="guro" target="_blank">Guro</a></div>`;
    dumpNode.setAttribute('id', 'dumpContainer');

    var myClubAdminSelectList = document.createElement("div");
    myClubAdminSelectList.id = "myClubDiv";
    myClubAdminSelectList.innerHTML = '<div id="myClubField">MyClub username</div><select id="myClubAdminSelect" type="select" class="form-control"></select><div id="reportTypeField">Report type</div><select id="shiftReportTypeSelect" type="select" class="form-control"></select><div id="spamCheckboxDiv"><input type="checkbox" id="spamCheckbox"><label>Spam</label></div>';


    var toolBarElement;
    var textSpace;
    var reportText;

    //Stripchat vars
    var stripchatSelectElement;
    var stripchatAllAdmins;
    var stripchatSelectedAdminIndex;
    var stripchatSavedAdminId;

    //MyClub vars
    var myclubSelectElement;
    var myclubSavedAdminId;
    var myclubSavedAdminUsername;


    var shiftReportTypes = [
        "Content",
        "Documents"
    ]

    //Zendesk vars
    var zendeskURL = `https://stripchat.zendesk.com/api/v2/views/1900021820273/execute.json?per_page=1&page=1&include=via_id&exclude=sla_next_breach_at,last_comment`;
    //Might want to get an actual API OAuth token
    var zendeskCredentials = "bW9kZXJhdGlvbkB3aXNlYml0cy5jb206TW9kZXJQYXNzMTIzMCE=";



    //Wait for the toolbar to initialize and create buttons/listeners
    function waitForToolBar() {
        if (document.getElementById("toolbar")) {
            stripchatSelectElement = document.querySelector("#filter-support-admin");
            stripchatAllAdmins = Array.from(stripchatSelectElement.options).map(e => e.value);
            if (stripchatAllAdmins.length > 1) {

                insertCss(customStyle);
                toolBarElement = document.getElementById("toolbar");
                fetchMyClubUsernames();
                toolBarElement.appendChild(dumpNode);
                //Button listeners
                document.getElementById("saveUserButton").addEventListener("click", saveUserAction);
                document.getElementById("fetchShiftReportButton").addEventListener("click", fetchShiftReportAction);
                document.getElementById("fetchReportButton").addEventListener("click", fetchReportAction);
                document.getElementById("copyToClipboardButton").addEventListener("click", copyToClipboardAction);
                document.getElementById("clearSpamCountButton").addEventListener("click", clearSpamCountAction);
                textSpace = document.getElementById("reportText");
                let shiftReportType = document.querySelector("#shiftReportTypeSelect");
                for (var i = 0; i < shiftReportTypes.length; i++) {
                    var option = document.createElement("option");
                    option.value = i;
                    option.text = shiftReportTypes[i];
                    shiftReportType.appendChild(option);
                }
                //Check if a profile is saved
                if (typeof GM_getValue("adminId") != "undefined") {
                    stripchatSavedAdminId = GM_getValue("adminId");
                    stripchatSelectedAdminIndex = stripchatAllAdmins.indexOf(stripchatSavedAdminId) + 1;
                    stripchatSelectElement.value = document.querySelector("#filter-support-admin > option:nth-child(" + stripchatSelectedAdminIndex + ")").value;
                    shiftReportType.value = GM_getValue("shiftReportType");
                    var selectedAdmin = document.querySelector("#filter-support-admin > option:nth-child(" + stripchatSelectedAdminIndex + ")");
                    textSpace.innerHTML = `Profile loaded: ${selectedAdmin.innerHTML} (${GM_getValue("adminId")}). MyClub username: ${GM_getValue("myClubUserName")} (${GM_getValue("myClubUserId")}).`
                } else {
                    textSpace.innerHTML = "User not saved. Make sure to save your Stripchat and MyClub usernames by using the dropdown menus"
                }

            } else {
                //Bruh
                setTimeout(waitForToolBar, 15);
            }
        } else {
            //Bruh
            setTimeout(waitForToolBar, 15);
        }
    }

    function clearSpamCountAction() {
        if (!GM_getValue("spamDone")) {

        } else {
            GM_setValue("spamDone", 0);
            textSpace.innerHTML = "Spam count reset"
        }
    }

    function copyToClipboardAction() {
        const listener = function(ev) {
            ev.preventDefault();
            ev.clipboardData.setData('text/html', textSpace.innerHTML);
            ev.clipboardData.setData('text/plain', textSpace.innerHTML);
        };
        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);
    }

    function fetchShiftReportAction() {
        var shift;
        var today = new Date().getHours();
        //Bruh else if, I'm not YandereDev, I s2g
        if (today < 9 && today >= 5) {
            shift = "Night Shift"
        } else if (today < 24 && today >= 21) {
            shift = "Afternoon Shift"
        } else if (today < 17 && today >= 14) {
            shift = "Morning Shift"
        } else {
            shift = ""
        }

        var admin = stripchatSelectElement.value;
        var myClubAdmin = myclubSelectElement.value;

        //Date formatting
        var startDate = document.querySelector("#date-from").value;
        var dateArray = startDate.split("-");
        var dateFormatted = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
        var endDate = document.querySelector("#date-to").value;

        var stripchatUrl = `https://control.stripchat.com/api/admin/report/supportAdmin?search=${admin}&order=asc&limit=20&offset=0&startDate=${startDate}&endDate=${endDate}&filters[startDate]=${startDate}&filters[endDate]=${endDate}&filters[search]=${admin}&_=1658163244693`
        var myClubUrl = `https://control.my.club/api/admin/report/supportAdmin?search=${myClubAdmin}&order=asc&limit=20&offset=0&startDate=${startDate}&endDate=${endDate}&filters[startDate]=${startDate}&filters[endDate]=${endDate}&filters[search]=${myClubAdmin}&_=1658245153073`

        //Stripchat shift report dump

        fetch(stripchatUrl).then(function(response) {
            return response.json();
        }).then(function(data) {
            var spamReport = GM_getValue("spamDone");
            var documentsReport = data.report[0]["data"]["total"];
            var photosReport = data.report[1]["data"]["total"];
            var panelPhotosReport = data.report[2]["data"]["total"];
            var timelinePostsReport = data.report[3]["data"]["total"];
            var albumVideosReport = data.report[5]["data"]["total"];
            var streamSpecificsReport = data.report[6]["data"]["total"];
            var coversReport = data.report[7]["data"]["total"];
            var avatarsReport = data.report[8]["data"]["total"];
            var backgroundsReport = data.report[9]["data"]["total"];
            var broadcastsReport = data.report[10]["data"]["total"];

            //MyClub shift report dump.
            GM.xmlHttpRequest({
                method: "GET",
                url: myClubUrl,
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
                    var myClubPhotosReport = jsonResponse.report[1]["data"]["total"];
                    var myClubAvatarsReport = jsonResponse.report[4]["data"]["total"];
                    var myClubBackgroundReport = jsonResponse.report[5]["data"]["total"];
                    var myClubDocumentsReport = jsonResponse.report[0]["data"]["total"];
                    let shiftReportType = document.querySelector("#shiftReportTypeSelect");
                    let spamIncluded;
                    if (document.querySelector("#spamCheckbox").checked) {
                        spamIncluded = "<br>" + "Spam: " + spamReport + "<br>"
                    } else {
                        spamIncluded = "<br>"
                    }
                    if (shiftReportType.value == 0) {
                        reportText = dateFormatted + " - " + shift +
                            spamIncluded +
                            "Timeline posts: " + timelinePostsReport +
                            "<br>" +
                            "Photos:" +
                            "<ul>" +
                            "<li>" + "Users & Models: " + photosReport + "</li>" +
                            "<li>" + "Panel photos: " + panelPhotosReport + "</li>" +
                            "<li>" + "Covers: " + coversReport + "</li>" +
                            "<li>" + "Avatars: " + avatarsReport + "</li>" +
                            "<li>" + "Background: " + backgroundsReport + "</li>" +
                            "</ul>" +
                            "Videos:" +
                            "<ul>" +
                            "<li>" + "Videos: " + albumVideosReport + "</li>" +
                            "<li>" + "Stream specifics: " + streamSpecificsReport + "</li>" +
                            "</ul>" +
                            "MyClub:" +
                            "<ul>" +
                            "<li>" + "Photos: " + myClubPhotosReport + "</li>" +
                            "<li>" + "Avatars: " + myClubAvatarsReport + "</li>" +
                            "<li>" + "Background: " + myClubBackgroundReport + "</li>" +
                            "</ul>"
                    } else if (shiftReportType.value == 1) {
                        reportText = dateFormatted + " - " + shift +
                            spamIncluded +
                            "Documents:" +
                            "<ul>" +
                            "<li>" + "Stripchat: " + documentsReport + "</li>" +
                            "<li>" + "MyClub: " + myClubDocumentsReport + "</li>" +
                            "</ul>"
                    }

                    textSpace.innerHTML = reportText;
                }
            });
        });
    }

    function saveUserAction() {
        var selectElement = document.querySelector("#filter-support-admin").value;
        var myClubSelectElement = document.querySelector("#myClubAdminSelect").value;
        GM_setValue("adminId", selectElement);
        GM_setValue("myClubUserId", myClubSelectElement);
        var allAdmins = Array.from(document.querySelector("#filter-support-admin").options).map(e => e.value);
        var selectedAdminIndex = allAdmins.indexOf(GM_getValue("adminId")) + 1;
        var selectedAdminId = document.querySelector("#filter-support-admin > option:nth-child(" + selectedAdminIndex + ")");

        var allMyClubAdmins = Array.from(document.querySelector("#myClubAdminSelect").options).map(e => e.value);
        var selectedMyClubAdminIndex = allMyClubAdmins.indexOf(GM_getValue("myClubUserId")) + 1;
        let myClubUsername = document.querySelector("#myClubAdminSelect > option:nth-child(" + selectedMyClubAdminIndex + ")").text
        GM_setValue("myClubUserName", myClubUsername);
        GM_setValue("shiftReportType", document.querySelector("#shiftReportTypeSelect").value);

        textSpace.innerHTML = (`Profile saved: ${selectedAdminId.innerHTML} (${GM_getValue("adminId")}). MyClub username: ${GM_getValue("myClubUserName")} (${GM_getValue("myClubUserId")})`);
    }

    var reportObject = [
        dump = {
            modelPhoto: "WAITING",
            userPhoto: "WAITING",
            userAvatar: "WAITING",
            avatar: "WAITING",
            studioAvatar: "WAITING",
            broadcasterPreview: "WAITING",
            introUser: "WAITING",
            introModel: "WAITING",
            introStudio: "WAITING",
            panelPhoto: "WAITING",
            timelinePosts: "WAITING",
            videos: "WAITING",
            streamSpecifics: "WAITING",
            docsModels: "WAITING",
            docsStudio: "WAITING",
            docsUsers: "WAITING",
            zendesk: "WAITING",
            spamGrey: "WAITING",
            spamGuests: "WAITING",
            spamPaying: "WAITING"

        }

    ]

    function postReport(object) {
        reportText =
            "<code>Photos</code>" +
            "<ul>" +
            "<li>" + "Model: " + object[0].modelPhoto + "</li>" +
            "<li>" + "User: " + object[0].userPhoto + "</li>" +
            "<li>" + "User Avatar: " + object[0].userAvatar + "</li>" +
            "<li>" + "Model Avatar: " + object[0].avatar + "</li>" +
            "<li>" + "Studio Avatar: " + object[0].studioAvatar + "</li>" +
            "<li>" + "Cover: " + object[0].broadcasterPreview + "</li>" +
            "<li>" + "Background User: " + object[0].introUser + "</li>" +
            "<li>" + "Background Model: " + object[0].introModel + "</li>" +
            "<li>" + "Background Studio: " + object[0].introStudio + "</li>" +
            "<li>" + "Panel Photos: " + object[0].panelPhoto + "</li>" +
            "<li>" + "Timeline Posts: " + object[0].timelinePosts + "</li>" +
            "</ul>" +
            "<code>Videos</code>" +
            "<ul>" +
            "<li>" + "Videos: " + object[0].videos + "</li>" +
            "<li>" + "Stream Specifics: " + object[0].streamSpecifics + "</li>" +
            "</ul>" +
            "<code>Documents</code>" +
            "<ul>" +
            "<li>" + "Models: " + object[0].docsModels + "</li>" +
            "<li>" + "Studio: " + object[0].docsStudio + "</li>" +
            "<li>" + "Users: " + object[0].docsUsers + "</li>" +
            "</ul>" +
            "<code>Zendesk</code>" +
            "<ul>" +
            "<li>" + "Moderation Team tickets: " + object[0].zendesk + "</li>" +
            "</ul>" +
            "<code>Spam</code>" +
            "<ul>" +
            "<li>" + "Users without tokens: " + object[0].spamGrey + "</li>" +
            "<li>" + "Guest: " + object[0].spamGuests + "</li>" +
            "<li>" + "Paying users: " + object[0].spamPaying + "</li>" +
            "</ul>"
        textSpace.innerHTML = reportText;
    }

    function fetchReportAction() {
        reportObject = [
            dump = {
                modelPhoto: "WAITING",
                userPhoto: "WAITING",
                userAvatar: "WAITING",
                avatar: "WAITING",
                studioAvatar: "WAITING",
                broadcasterPreview: "WAITING",
                introUser: "WAITING",
                introModel: "WAITING",
                introStudio: "WAITING",
                panelPhoto: "WAITING",
                timelinePosts: "WAITING",
                videos: "WAITING",
                streamSpecifics: "WAITING",
                docsModels: "WAITING",
                docsStudio: "WAITING",
                docsUsers: "WAITING",
                zendesk: "WAITING",
                spamGrey: "WAITING",
                spamGuests: "WAITING",
                spamPaying: "WAITING"
            }
        ]

        GM.xmlHttpRequest({
            method: "GET",
            url: zendeskURL,
            headers: {
                'Authorization': `Basic ${zendeskCredentials}`,
                "User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
                "Accept": "application/json", // If not specified, browser defaults will be used.
                'Content-Type': 'application/json',

            },
            onload: function(response) {
                var responseXML = null;
                // Inject responseXML into existing Object (only appropriate for XML content).
                if (!response.responseXML) {
                    responseXML = new DOMParser()
                        .parseFromString(response.responseText, "text/xml");
                }
                reportObject[0]["zendesk"] = JSON.parse(response.responseText).count;
            }
        });



        //Nah, but

        let fetchURLTL = "https://control.stripchat.com/api/admin/v2/posts/list?page=1&perPage=50&sortField=createdAt&sortOrder=desc&filterUser=&filterCategory=&filterStatus=notReviewed&filterCvStatus="
        fetch(fetchURLTL).then(function(response) {
            return response.json();
        }).then(function(data) {
            reportObject[0]["timelinePosts"] = data["total"];
            postReport(reportObject);
        });

        let fetchURLDocsModel = "https://control.stripchat.com/api/admin/review/models?order=asc&limit=20&offset=0&filters[isReUploaded]=0&filters[moderationStatus]=shouldBeModerated&_=1658173950662"
        fetch(fetchURLDocsModel).then(function(response) {
            return response.json();
        }).then(function(data) {
            reportObject[0]["docsModels"] = data["total"];
            postReport(reportObject);
        });

        let fetchURLDocsStudio = "https://control.stripchat.com/api/admin/review/studios?offset=0&limit=20&filters[moderationStatus]=shouldBeModerated&filters[showDeleted]=&filters[dateFrom]=&filters[dateTo]=&filters[country]=&filters[searchQuery]="
        fetch(fetchURLDocsStudio).then(function(response) {
            return response.json();
        }).then(function(data) {
            reportObject[0]["docsStudio"] = data["total"];
            postReport(reportObject);
        });

        let fetchURLDocsUsers = "https://control.stripchat.com/api/admin/review/users?offset=0&limit=20&filters[moderationStatus]=shouldBeModerated&filters[showDeleted]=&filters[dateFrom]=&filters[dateTo]=&filters[country]=&filters[searchQuery]="
        fetch(fetchURLDocsUsers).then(function(response) {
            return response.json();
        }).then(function(data) {
            reportObject[0]["docsUsers"] = data["total"];
            postReport(reportObject);
        });


        let fetchURLVideos = "https://control.stripchat.com/api/admin/v2/review/videos/models?direction=desc&filterCategory=published&filterStatus=notReviewed&filterUserSearch=&filterVideoTitle=&filterStreamSpecifics=0&limit=20&offset=0&sort=createdAt"
        fetch(fetchURLVideos).then(function(response) {
            return response.json();
        }).then(function(data) {
            reportObject[0]["videos"] = data["meta"].count;
            postReport(reportObject);
        });

        let fetchURLStreamSpecifics = "https://control.stripchat.com/api/admin/v2/review/videos/models?direction=desc&filterCategory=&filterStatus=notReviewed&filterUserSearch=&filterVideoTitle=&filterDateFrom=2021-10-13T00:00:00&filterStreamSpecifics=1&limit=20&offset=0&sort=createdAt"
        fetch(fetchURLStreamSpecifics).then(function(response) {
            return response.json();
        }).then(function(data) {
            reportObject[0]["streamSpecifics"] = data["meta"].count;
            postReport(reportObject);
        });

        let fetchURLSpamGrey = "https://control.stripchat.com/api/admin/spamAlerts?search=&order=asc&limit=100&offset=0&filters[role]=greys";
        fetch(fetchURLSpamGrey).then(function(response) {
            return response.json();
        }).then(function(data) {
            reportObject[0]["spamGrey"] = data["total"];
            postReport(reportObject);
        });

        let fetchURLGuest = "https://control.stripchat.com/api/admin/spamAlerts?search=&order=asc&limit=100&offset=0&filters[role]=guests";
        fetch(fetchURLGuest).then(function(response) {
            return response.json();
        }).then(function(data) {
            reportObject[0]["spamGuests"] = data["total"];
            postReport(reportObject);
        });

        let fetchURLPaying = "https://control.stripchat.com/api/admin/spamAlerts?search=&order=asc&limit=100&offset=0&filters[role]=paying";
        fetch(fetchURLPaying).then(function(response) {
            return response.json();
        }).then(function(data) {
            reportObject[0]["spamPaying"] = data["total"];
            postReport(reportObject);
        });


        var requestArray = ["modelPhoto", "userPhoto", "userAvatar", "avatar", "studioAvatar", "broadcasterPreview", "introUser", "introModel", "introStudio", "panelPhoto"]
        requestArray.forEach(element =>

            postRequest(element));
    }

    function postRequest(category) {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var dd = String(tomorrow.getDate()).padStart(2, '0');
        var mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        var yyyy = tomorrow.getFullYear();
        tomorrow = yyyy + '-' + mm + '-' + dd + "T00:00:00";
        let fetchURL = "https://control.stripchat.com/api/admin/v2/photos/list";
        var xhr = new XMLHttpRequest();
        xhr.open("POST", fetchURL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            filterCategory: category,
            filterCvStatus: "",
            filterDateFrom: "2021-10-13T00:00:00",
            filterDateTo: tomorrow,
            filterStatus: "notReviewed",
            filterUser: "",
            page: 1,
            perPage: 1,
            sortField: "createdAt",
            sortOrder: "desc"
        }));
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                reportObject[0][category] = JSON.parse(xhr.response)["total"];
                postReport(reportObject);
            } else if (xhr.status !== 200) {
                reportObject[0][category] = "💀";
                postReport(reportObject);
                console.log("💀");
            }
        };
    }

    function fetchMyClubUsernames() {
        var myClubAdminArray = [];
        toolBarElement.appendChild(myClubAdminSelectList);
        myclubSelectElement = document.querySelector("#myClubAdminSelect");
        let myclubFetchURL = "https://control.my.club/api/admin/report/supportAdmin?search=146397&order=asc&limit=20&offset=0&startDate=2022-07-18&endDate=2022-07-19&filters[startDate]=2022-07-18&filters[endDate]=2022-07-19&filters[search]=146397&_=1658209351253"
        GM.xmlHttpRequest({
            method: "GET",
            url: myclubFetchURL,
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
                var adminObject = jsonResponse.supportAdmins;

                for (const [key, value] of Object.entries(adminObject)) {
                    myClubAdminArray.push(value);
                }

                for (var i = 0; i < myClubAdminArray.length; i++) {
                    var option = document.createElement("option");
                    option.value = myClubAdminArray[i]["id"];
                    option.text = myClubAdminArray[i]["username"];
                    myclubSelectElement.appendChild(option);
                }

                var allAdmins = Array.from(document.querySelector("#myClubAdminSelect").options).map(e => e.value);
                var selectElement = document.querySelector("#myClubAdminSelect");
                var selectedAdminIndex = allAdmins.indexOf(GM_getValue("myClubUserId")) + 1;
                if (typeof GM_getValue("adminId") != "undefined") {
                    selectElement.value = document.querySelector("#myClubAdminSelect > option:nth-child(" + selectedAdminIndex + ")").value;
                } else {}
            }
        });
    }



    waitForToolBar();
    console.log("https://www.youtube.com/watch?v=-XJIbwWLw0M")
} else if (window.location.href == "https://control.stripchat.com/spamAlerts" || window.location.href == "https://control.stripchat.com/spamAlerts#") {

    if (Date.now() - GM_getValue("lastSpam") > 28800000) {
        GM_setValue("spamDone", 0)
    }

    const interval = setInterval(function() {
        if (GM_getValue("spamDone") !== 0) {
            if (Date.now() - GM_getValue("lastSpam") > 28800000) {
                GM_setValue("spamDone", 0);
            }
        }
    }, 300000);

    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send;
    var postRequest = false;

    function openReplacement(method, url, async, user, password) {

        if (method == "POST") {
            postRequest = true;
        } else {
            postRequest = false;
        }
        this._url = url;
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        if (postRequest == true && data !== null) {
            let spamArray = data.split("&")
            let spamCountOld = GM_getValue("spamDone");
            let spamCountNew = spamCountOld + spamArray.length;
            GM_setValue("spamDone", spamCountNew)
            GM_setValue("lastSpam", Date.now())
        } else {

        }

        if (this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;
        //this.onloadend = onLoadEndReplacement;
        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {
        //YOUR CODE FOR READYSTATECHANGE

        if (this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }
    async function onLoadEndReplacement() {}
    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;

    var sentHeaders = {}
    var originalXMLHttpRequest_setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        sentHeaders[header] = value;
        originalXMLHttpRequest_setRequestHeader.call(this, header, value);
    }
}