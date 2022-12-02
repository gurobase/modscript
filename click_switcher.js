// ==UserScript==
// @name         Click Switcher
// @version      1.3
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

var hiddenStyle = (`

.element-hidden {
    display:none;
    !important
}

.element-visible {
    display: table-row;
}
`)
insertCss(hiddenStyle);


if (window.location.href == "https://control.stripchat.com/new/photos/moderation") {


    /*
    VERY CLUNKY AND EXPERIMENTAL CV FIXER
    */

    // var fixCV = document.createElement("div");
    // fixCV.id = "fixCVDiv";
    // fixCV.innerHTML = '<br><button id="fixCVButton" type="button">Fix CV</button><button id="unfixCVButton" type="button">Unfix CV</button>'

    // function fixCVAction() {
    //     let childNodes = document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > tbody").children;
    //     for (const childNode of childNodes) {
            
    //         if (childNode.querySelector(".status-cv") != null) {
    //             let checkboxQuery = childNode.querySelector('.column-actions > div');
    //             let approveField = checkboxQuery.querySelector('div:nth-child(1) > label');
    //             let rejectField = checkboxQuery.querySelector('div:nth-child(2) > label');
    //             let rejectCheckbox = rejectField.querySelector('input[type=checkbox');
    //             let approveCheckbox = approveField.querySelector('input[type=checkbox');
    //             rejectCheckbox.checked = false;
    //             approveCheckbox.checked = false;
    //             if (checkboxQuery.querySelector('div:nth-child(1)').classList.contains("has-addons")) {
    //                 approveCheckbox.checked = true;
    //                 rejectCheckbox.checked = false;
    //             } else if (checkboxQuery.querySelector('div:nth-child(2)').classList.contains("has-addons")) {
    //                 approveCheckbox.checked = false;
    //                 rejectCheckbox.checked = true;
    //             }
    //             childNode.classList.add("element-hidden");
    //         }
    //     }
    // }
    // function unfixCVAction() {
    //     let childNodes = document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > tbody").children;
    //     for (const childNode of childNodes) {
    //         var classArray = [];
    //             childNode.classList.forEach(element => {
    //                 classArray.push(element);
    //             });
    //         if (classArray.includes("element-hidden")) {
    //             childNode.classList.remove("element-hidden");
    //         }
    //     }
    // }



    function waitForWebsite() {

        if (document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > tbody > tr:nth-child(2)")) {
            //document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > thead > tr > th:nth-child(5) > div").appendChild(fixCV);
            //document.getElementById("fixCVButton").addEventListener("click", fixCVAction);
            //document.getElementById("unfixCVButton").addEventListener("click", unfixCVAction);
            
            
            document.body.addEventListener('click', function(evt) {
                
                if (evt.target.localName == "td") {
                    let checkboxQuery = evt.path[1].querySelector('.column-actions > div');
                    let approveField = checkboxQuery.querySelector('div:nth-child(1) > label');
                    let rejectField = checkboxQuery.querySelector('div:nth-child(2) > label');
                    let approveCheckbox = approveField.querySelector('input[type=checkbox');

                    
                    if (approveCheckbox.checked == true) {
                        rejectField.click();
                    } else {
                        approveField.click()
                    }
                }
            } , false);

            
        } else {
            setTimeout(waitForWebsite, 15)
        }
    }

    waitForWebsite();
} else if (window.location.href == "https://control.stripchat.com/new/posts/moderation") {
    function waitForWebsite() {
        if (document.querySelector("body > div > div > main > div > div.table-wrapper.has-mobile-cards > table > tbody tr:nth-child(2)")) {
            document.body.addEventListener('click', function(evt) {
                if (evt.target.localName == "td" || evt.target.localName == "li" || evt.target.localName == "ul") {
                    let pathArray = evt.path;
                    let trNumber = pathArray.length - 12;
                    let checkboxQuery = evt.path[trNumber].querySelector('.column-actions > div');
                    let approveField = checkboxQuery.querySelector('div:nth-child(1) > label');
                    let rejectField = checkboxQuery.querySelector('div:nth-child(2) > label');
                    let approveCheckbox = approveField.querySelector('input[type=checkbox');
                    if (approveCheckbox.checked == true) {
                        rejectField.click();
                    } else {
                        approveField.click();
                    }
                }
            }, false);
        } else {
            setTimeout(waitForWebsite, 15)
        }
    }
    waitForWebsite();
} else if (window.location.href == "https://control.stripchat.com/new/review/video") {
    function waitForWebsite() {
        if (document.querySelector("body > div > div > main > div.b-table.table-video-review > div.table-wrapper.has-mobile-cards > table > tbody > tr:nth-child(2)")) {
            document.body.addEventListener('click', function(evt) {
                if (evt.target.localName == "td") {
                    let approveCheckbox = evt.path[1].querySelector('td:nth-child(6) > div > label > input[type=checkbox]');
                    let approveField = evt.path[1].querySelector('td:nth-child(6) > div > label')
                    let rejectField = evt.path[1].querySelector('td.column-actions > div > label')
                    if (approveCheckbox.checked == true) {
                        rejectField.click();
                    } else {
                        approveField.click();
                    }
                }
            }, false);
        } else {
            setTimeout(waitForWebsite, 15)
        }
    }
    waitForWebsite();
}