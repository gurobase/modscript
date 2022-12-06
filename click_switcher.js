// ==UserScript==
// @name         Click Switcher
// @version      1.5
// @description  Switch post status with ease
// @author       Guro
// @match        https://control.stripchat.com/new/photos/moderation
// @match        https://control.stripchat.com/new/posts/moderation
// @match        https://control.stripchat.com/new/review/video
// @icon         https://control.my.club/favicon.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM.xmlHttpRequest
// @downloadURL  https://raw.githubusercontent.com/gurobase/modscript/main/click_switcher.js

// ==/UserScript==
function insertCss(css) {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    return style;
}

var adminPanelStyle = (`
    html {
        background-color: #FFFDFA;
    }
    body {
        background-color: #FFFDFA;
    }
    .table {
        background-color: #FFFDFA;
    }

    .contentRejected {
        background-color: #ffe4e1 !important;
    }
    
    img {
        border-radius: 5px;
    }

    .rejectAllButton {
        background-color: #E93069 !important;
    }

    .rejectAllButton:hover {
        background-color: #D12C5F !important;
    }

    .rejectAllButton:active {
        background-color: #B72653 !important;
    }

    .element-hidden {
        display:none !important;
    }
`)

insertCss(adminPanelStyle);

var approveAllDiv = document.createElement('div');
var rejectAllDiv = document.createElement('div');

approveAllDiv.id = "approveAllDiv";
rejectAllDiv.id = "rejectAllDiv";


approveAllDiv.innerHTML = `<button id="approveAllButton" class="button is-primary approveAllButton" type="button">Approve all</button>`;
rejectAllDiv.innerHTML = `<button id="rejectAllButton" class="button is-primary rejectAllButton" type="button">Reject all</button>`;


if (window.location.href == "https://control.stripchat.com/new/photos/moderation") {


    

    function rejectedStatusStyle(res) {

        var table = document.getElementsByClassName("table");
        var t = table[0];
        for (var r = 1; r < t.rows.length; r++) {
            if (res == 1 && document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(2) > label > input[type=checkbox]").checked == true) {
                t.rows[r].classList.add("contentRejected");
            } else {
                t.rows[r].classList.remove("contentRejected");
            }
        }
    }

    function waitForWebsite() {
        
        let headDestroyed = false;

        if (document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > tbody > tr:nth-child(2)")) {


            let approveAllField = document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(1)");
            let rejectAllField = document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(2)");

            document.querySelector("body > div > div > main").addEventListener("DOMSubtreeModified", contentChanged, false);

            let bodyMain = document.querySelector("body > div > div > main");

            function contentChanged() {
                if (!bodyMain.querySelector("div > div.table-wrapper.has-mobile-cards > table > thead > tr")) {
                    headDestroyed = true;
                } else if (headDestroyed == true) {
                    approveAllField = document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(1)");
                    rejectAllField = document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(2)");
                    headDestroyed = false;
                    approveAllField.appendChild(approveAllDiv);
                    rejectAllField.appendChild(rejectAllDiv);
                }

            }

            

            approveAllField.appendChild(approveAllDiv);
            rejectAllField.appendChild(rejectAllDiv);


            document.getElementById("approveAllButton").addEventListener("click", item => {
                if (!document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(1) > label > input[type=checkbox]").checked) {
                    document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(1) > label").click();
                    rejectedStatusStyle(0);
                }
            });

            document.getElementById("rejectAllButton").addEventListener("click", item => {
                if (!document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(2) > label > input[type=checkbox]").checked) {
                    document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(2) > label").click();
                    rejectedStatusStyle(1);
                }
                
            });

            let submitButtons = document.getElementsByClassName("button is-primary");
            for (let button of submitButtons) {
                if (!button.classList.contains("approveAllButton") && !button.classList.contains("rejectAllButton")) {
                    button.addEventListener('click', item => {
                        var table = document.getElementsByClassName("table");
                        var t = table[0];
                        for (var r = 1; r < t.rows.length; r++) {
                            t.rows[r].classList.remove("contentRejected");
                        }
                    
                        if (approveAllField.querySelector("label > input[type=checkbox]").checked == true) {
                            approveAllField.click();
                        }
                        if (rejectAllField.querySelector("label > input[type=checkbox]").checked == true) {
                            rejectAllField.click();
                        }
                    });
                }
                
            }

            document.body.addEventListener('click', function(evt) {
                
                if (evt.target.localName == "td") {
                    let checkboxQuery = evt.path[1].querySelector('.column-actions > div');
                    let approveField = checkboxQuery.querySelector('div:nth-child(1) > label');
                    let rejectField = checkboxQuery.querySelector('div:nth-child(2) > label');
                    let approveCheckbox = approveField.querySelector('input[type=checkbox');


                    if (approveCheckbox.checked == true) {
                        evt.path[1].classList.add("contentRejected");
                        rejectField.click();
                    } else {
                        evt.path[1].classList.remove("contentRejected");
                        approveField.click();
                    }
                }
            }, false);


        } else {
            setTimeout(waitForWebsite, 15);
        }
    }

    waitForWebsite();
} else if (window.location.href == "https://control.stripchat.com/new/posts/moderation") {

    function waitForWebsite() {


        function rejectedStatusStyle(res) {

            var table = document.getElementsByClassName("table");
            var t = table[0];
            for (var r = 1; r < t.rows.length; r++) {
                if (res == 1 && document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(2) > label > input[type=checkbox]").checked == true) {
                    t.rows[r].classList.add("contentRejected");
                } else {
                    t.rows[r].classList.remove("contentRejected");
                }
            }
        }
        
        if (document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > tbody tr:nth-child(2)")) {

            let approveAllField = document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(1)");
            let rejectAllField = document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(2)");

            

            approveAllField.appendChild(approveAllDiv);
            rejectAllField.appendChild(rejectAllDiv);

            document.getElementById("approveAllButton").addEventListener("click", item => {
                if (!document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(1) > label > input[type=checkbox]").checked) {
                    document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(1) > label").click();
                    rejectedStatusStyle(0);
                }
            });

            document.getElementById("rejectAllButton").addEventListener("click", item => {
                if (!document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(2) > label > input[type=checkbox]").checked) {
                    document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-last-child(n) > div > span > div > div > div:nth-child(2) > label").click();
                    rejectedStatusStyle(1);
                }
                
            });

            let submitButtons = document.getElementsByClassName("button is-primary");
            for (let button of submitButtons) {
                if (!button.classList.contains("approveAllButton") && !button.classList.contains("rejectAllButton")) {

                    button.addEventListener('click', item => {
                        var table = document.getElementsByClassName("table");
                        var t = table[0];
                        for (var r = 1; r < t.rows.length; r++) {
                            t.rows[r].classList.remove("contentRejected");
                        }

                        if (approveAllField.querySelector("label > input[type=checkbox]").checked == true) {
                            approveAllField.click();
                        }
                        if (rejectAllField.querySelector("label > input[type=checkbox]").checked == true) {
                            rejectAllField.click();
                        }
                    })
                }
            }

            document.body.addEventListener('click', function(evt) {
                if (evt.target.localName == "td" || evt.target.localName == "li" || evt.target.localName == "ul") {
                    let pathArray = evt.path;
                    let trNumber = pathArray.length - 12;
                    let checkboxQuery = evt.path[trNumber].querySelector('.column-actions > div');
                    let approveField = checkboxQuery.querySelector('div:nth-child(1) > label');
                    let rejectField = checkboxQuery.querySelector('div:nth-child(2) > label');
                    let approveCheckbox = approveField.querySelector('input[type=checkbox');
                    if (approveCheckbox.checked == true) {
                        evt.path[trNumber].classList.add("contentRejected");
                        rejectField.click();
                    } else {
                        evt.path[trNumber].classList.remove("contentRejected");
                        approveField.click();
                    }
                }
            }, false);
        } else {
            setTimeout(waitForWebsite, 15);
        }
    }
    waitForWebsite();
} else if (window.location.href == "https://control.stripchat.com/new/review/video") {
    
    function waitForWebsite() {
        if (document.querySelector("body > div > div > main > div.b-table.table-video-review > div.table-wrapper.has-mobile-cards > table > tbody > tr:nth-child(2)")) {

            let level = document.querySelector("body > div > div > main > div.b-table.table-video-review > div:nth-child(4)");
            let levelRight = level.querySelector("div.level-right");
            let submitButton = document.querySelector("body > div > div > main > section > div > button");
            level.insertBefore(submitButton, levelRight);

            let submitButtons = document.getElementsByClassName("button is-primary");
            for (let button of submitButtons) {
                button.addEventListener('click', clearRejectedStyle);
            }
            
            document.body.addEventListener('click', function(evt) {
                if (evt.target.localName == "td") {
                    let approveCheckbox = evt.path[1].querySelector('td:nth-child(6) > div > label > input[type=checkbox]');
                    let approveField = evt.path[1].querySelector('td:nth-child(6) > div > label');
                    let rejectField = evt.path[1].querySelector('td.column-actions > div > label');
                    if (approveCheckbox.checked == true) {
                        evt.path[1].classList.add("contentRejected");
                        rejectField.click();
                    } else {
                        evt.path[1].classList.remove("contentRejected");
                        approveField.click();
                    }
                }
            }, false);
        } else {
            setTimeout(waitForWebsite, 15);
        }
    }
    waitForWebsite();
}


