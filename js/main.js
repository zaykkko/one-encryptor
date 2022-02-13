(function () {
    //https://stackoverflow.com/a/33928558/10942774
    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return window.clipboardData.setData("Text", text);
        } else if (
            document.queryCommandSupported &&
            document.queryCommandSupported("copy")
        ) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy"); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return prompt("Copy to clipboard: Ctrl+C, Enter", text);
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    var cryptDict = {
        a: "ai",
        A: "AI",
        e: "enter",
        E: "ENTER",
        i: "imes",
        I: "IMES",
        o: "ober",
        O: "OBER",
        u: "ufat",
        U: "UFAT"
    };

    function encryptData(text) {
        if (!text) return text;

        var strArr = text.split("");

        for (var i = 0; i < strArr.length; i++) {
            //https://stackoverflow.com/a/1098955/10942774
            if (cryptDict[strArr[i]] !== undefined) {
                strArr[i] = cryptDict[strArr[i]];
            }
        }

        return strArr.join("");
    }

    function decryptData(text) {
        if (!text) return text;

        for (var keyName in cryptDict) {
            if (text.indexOf(cryptDict[keyName]) != -1) {
                text = text.split(cryptDict[keyName]).join(keyName);
            }
        }

        return text;
    }

    var copyAnimHandle,
        encryptBtn = document.querySelector("button[name='encrypt']"),
        decryptBtn = document.querySelector("button[name='decrypt']"),
        textareaInput = document.querySelector("textarea[name='data_input']"),
        resultBox = document.querySelector(".cryptoResultBox"),
        resultBoxText = document.getElementById("crypto-result"),
        copyBtn = document.getElementById("copy-button");

    function cryptionBtnEvent(event) {
        event.preventDefault();

        var data = textareaInput.value,
            eventType = event.target.name,
            result =
                eventType == "decrypt" ? decryptData(data) : encryptData(data);

        console.debug(`Event ${eventType} fired!`);

        if (result) {
            resultBox.classList.remove("cryptoResultJustified");
            resultBoxText.textContent = result;
        } else {
            resultBox.classList.add("cryptoResultJustified");
            resultBoxText.textContent = "";
        }
    }

    decryptBtn.onclick = cryptionBtnEvent;
    encryptBtn.onclick = cryptionBtnEvent;

    copyBtn.onclick = function () {
        if (resultBoxText.textContent) {
            copyBtn.textContent = "¡Copiado!";

            clearTimeout(copyAnimHandle);
            copyAnimHandle = setTimeout(function () {
                copyBtn.textContent = "Copiar";
            }, 2e3);

            copyToClipboard(resultBoxText.textContent);
        }
    };
})();
