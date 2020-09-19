import React from "react";

const AssignRoute = () => {

    let copy = function() {
        /* Get the text field */
        var copyText = document.getElementById("linkinput");

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
        alert("Link has been copied to your clipboard");
    }

    return (
        <div class="tankuang">

            <h3 class="title">Assign street name</h3>
            <form>
                <div class="field">
                    <div class="control">
                        <input class="input" type="text" placeholder="Group Name" name="username" autofocus />

                    </div>
                    <p class="help">Using volunteer database</p>
                </div>

                <div class="field">
                    <div class="control" id="input">
                        <input class="input" type="text" placeholder="password12345" id="linkinput" />
                    </div>
                    <button class="button is-info" onclick="copy()">COPY</button>
                    <p class="help">Using a link that anyone can access</p>
                </div>

                <div class="field">
                    <div class="control">
                        <input class="input" type="text" placeholder="1234567890" name="tel" />
                    </div>
                    <p class="help">Using phone numbers</p>
                </div>

                <div class="field">
                    <div class="control">
                        <input class="input" type="email" placeholder="example@example.com" name="email" />
                    </div>
                    <p class="help">Using emails</p>
                </div>

                <div class="bottom">
                    <div class="control">
                        <button class="button is-info is-inverted" onclick="hidder()">CANCEL</button>
                        <button class="button is-info" onclick="assign()">ASSIGN</button>
                    </div>
                </div>

            </form>
        </div>

    );

};

export default AssignRoute;
