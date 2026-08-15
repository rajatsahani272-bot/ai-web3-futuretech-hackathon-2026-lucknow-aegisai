let signupMode = false;

/* LOGIN / SIGNUP */

function toggleAuth() {

```
signupMode = !signupMode;

const title = document.getElementById("authTitle");
const subtitle = document.getElementById("authSubtitle");
const nameField = document.getElementById("nameField");
const switchText = document.getElementById("switchText");
const switchBtn = document.getElementById("switchBtn");

if (signupMode) {

    title.innerText = "Create Account 🚀";
    subtitle.innerText = "Join FixMyCity today";
    nameField.classList.remove("hidden");

    switchText.innerText = "Already have an account?";
    switchBtn.innerText = "Login";

} else {

    title.innerText = "Welcome Back 👋";
    subtitle.innerText = "Login to manage your complaints";
    nameField.classList.add("hidden");

    switchText.innerText = "Don't have an account?";
    switchBtn.innerText = "Sign Up";
}
```

}

function loginUser(event) {

```
event.preventDefault();

if (signupMode) {
    alert("Account created successfully! 🎉");
} else {
    alert("Login successful! 👋");
}

window.location.href = "index.html";
```

}

/* REPORT ISSUE */

function analyzeComplaint(event) {

```
event.preventDefault();

const title = document.getElementById("issueTitle").value;
const category = document.getElementById("category").value;

localStorage.setItem("issueTitle", title);
localStorage.setItem("category", category);

window.location.href = "analysis.html";
```

}

/* AI ANALYSIS RESULT */

document.addEventListener("DOMContentLoaded", function () {

```
const title = localStorage.getItem("issueTitle");
const category = localStorage.getItem("category");

const resultTitle = document.getElementById("resultTitle");
const resultCategory = document.getElementById("resultCategory");

if (title && resultTitle) {
    resultTitle.innerText = title;
}

if (category && resultCategory) {
    resultCategory.innerText = category;
}
```

});

/* SUBMIT COMPLAINT */

function submitComplaint() {

```
const complaintId =
    "FMC" + Math.floor(10000 + Math.random() * 90000);

localStorage.setItem("complaintId", complaintId);

alert(
    "Complaint submitted successfully! 🎉\n\nComplaint ID: "
    + complaintId
);

window.location.href = "complaints.html";
```

}

/* GET LOCATION */

function getLocation() {

```
if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
}

navigator.geolocation.getCurrentPosition(

    function(position) {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        document.getElementById("location").value =
            latitude + ", " + longitude;
    },

    function() {
        alert("Unable to get your location.");
    }
);
```

}
