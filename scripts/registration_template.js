/**Generates the HTML template for the registration page.*/
function registrationTemplate() {
    return `
    <div class="sectionOne">
    <div class="mainLogin registerMain">
        <img class="signUpArrow" onclick="window.location.href = 'login.html';" src="../assets/svg/arrow-left-line.svg"
            alt="">
        <div class="signUpCtn">
            <h1 class="signUpHeaderH1">Sign up</h1>
            <div class="signUpLine"></div>
        </div>
        <form onsubmit="signUp(event);" class="loginForm">
            <div class="signUpInput"><input style="color: rgb(0, 0, 0);" class="signUpInput2" type="name" id="name"
                    placeholder="Name" required>
            </div>
            <div class="signUpInput"><input class="signUpInput2" type="email" id="email" placeholder="Email" required>
            </div>
            <div class="signUpInput"><input class="signUpInput2" type="password" id="password" placeholder="Password"
                    required></div>
            <div class="signUpInput"><input class="signUpInput2" type="password" id="confirmPassword"
                    placeholder="Confirm Password" required></div>
            <div class="checkboxMain">
                <input type="checkbox" id="checkbox" class="checkboxBox" onchange="toggleSignUpButton();">
                <label for="checkbox" class="checkboxInput">I accept the <a class="privacyLink"
                        href="../html/privacy.html">Privacy Policy</label>
            </div>
            <div class="signUpButtonMain">
                <button type="submit" class="signUpButton" disabled>Sign up</button>
            </div>
            <div id="signUpError" class="errorMessage"></div>
        </form>
    </div>
</div>
    `
}

/**Generates the HTML template for a successful registration message.*/
function signUpSuccess() {
    return `
    <div class="signUpSuccessClass" id="signUpSuccessID">
        <p class="signUpSuccessP">Du bist jetzt erfolgreich registriert.</p>
    </div>
    `
}