const API_URL = "http://127.0.0.1:5000/api";

let signupMode = false;

function toggleAuth() {
    signupMode = !signupMode;

    const title = document.getElementById("authTitle");
    const subtitle = document.getElementById("authSubtitle");
    const nameField = document.getElementById("nameField");
    const switchText = document.getElementById("switchText");
    const switchBtn = document.getElementById("switchBtn");
    const authSubmitBtn = document.getElementById("authSubmitBtn");

    if (signupMode) {
        title.innerText = "Create Account 🚀";
        subtitle.innerText = "Join FixMyCity today";
        nameField.classList.remove("hidden");
        switchText.innerText = "Already have an account?";
        switchBtn.innerText = "Login";

        if (authSubmitBtn) {
            authSubmitBtn.innerText = "Sign Up";
        }
    } else {
        title.innerText = "Welcome Back 👋";
        subtitle.innerText = "Login to manage your complaints";
        nameField.classList.add("hidden");
        switchText.innerText = "Don't have an account?";
        switchBtn.innerText = "Sign Up";

        if (authSubmitBtn) {
            authSubmitBtn.innerText = "Login";
        }
    }
}

async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        if (signupMode) {
            const name = document.getElementById("name").value.trim();

            if (!name) {
                alert("Please enter your name");
                return;
            }

            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            alert("Account created successfully! 🎉");

            signupMode = true;
            toggleAuth();

            document.getElementById("password").value = "";

            return;
        }

        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Login failed"
            );
        }

        alert("Login successful! 👋");

        window.location.href = "index.html";

    } catch (error) {
        console.error("Auth Error:", error);
        alert(error.message);
    }
}

async function getCurrentUser() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return data.data || null;

    } catch (error) {
        console.error("Get user error:", error);
        return null;
    }
}

async function updateAuthUI() {
    const userName = document.getElementById("userName");
    const authButton = document.getElementById("authButton");

    if (!userName || !authButton) {
        return;
    }

    const user = await getCurrentUser();

    if (user) {
        userName.innerText = `Hi, ${user.name}`;

        authButton.innerText = "Logout";
        authButton.href = "#";

        authButton.onclick = async function (event) {
            event.preventDefault();
            await logoutUser();
        };

    } else {
        userName.innerText = "";
        authButton.innerText = "Login / Signup";
        authButton.href = "login.html";
        authButton.onclick = null;
    }
}

async function logoutUser() {
    try {
        const response = await fetch(
            `${API_URL}/auth/logout`,
            {
                method: "POST",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Logout failed"
            );
        }

        window.location.href = "login.html";

    } catch (error) {
        console.error("Logout Error:", error);
        alert(error.message);
    }
}

async function getMyComplaints() {
    try {
        const response = await fetch(
            `${API_URL}/complaints/my`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            window.location.href = "login.html";
            return null;
        }

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load complaints"
            );
        }

        return data.data || [];

    } catch (error) {
        console.error(
            "Get complaints error:",
            error
        );

        alert(error.message);

        return null;
    }
}

async function getComplaintById(id) {
    try {
        const response = await fetch(
            `${API_URL}/complaints/${id}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            window.location.href = "login.html";
            return null;
        }

        if (!response.ok) {
            throw new Error(
                data.message || "Complaint not found"
            );
        }

        return data.data || null;

    } catch (error) {
        console.error(
            "Get complaint error:",
            error
        );

        alert(error.message);

        return null;
    }
}

async function requireAuth() {
    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    return user;
}

async function protectPage() {
    const protectedPages = [
        "report.html",
        "analysis.html",
        "complaints.html",
        "details.html"
    ];

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (protectedPages.includes(currentPage)) {
        return await requireAuth();
    }

    return null;
}

function analyzeComplaint(event) {
    event.preventDefault();

    const title =
        document.getElementById("issueTitle").value.trim();

    const category =
        document.getElementById("category").value;

    const description =
        document.getElementById("description").value.trim();

    const location =
        document.getElementById("location").value.trim();

    if (!title) {
        alert("Please enter issue title");
        return;
    }

    if (!category) {
        alert("Please select a category");
        return;
    }

    if (!description) {
        alert("Please enter description");
        return;
    }

    if (!location) {
        alert("Please enter location");
        return;
    }

    localStorage.setItem("issueTitle", title);
    localStorage.setItem("category", category);
    localStorage.setItem("description", description);
    localStorage.setItem("location", location);

    window.location.href = "analysis.html";
}

async function submitComplaint() {
    const title =
        localStorage.getItem("issueTitle");

    const category =
        localStorage.getItem("category");

    const description =
        localStorage.getItem("description");

    const location =
        localStorage.getItem("location");

    if (
        !title ||
        !category ||
        !description ||
        !location
    ) {
        alert("Complaint information is missing");
        return;
    }

    const coordinates =
        location.match(
            /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/
        );

    if (!coordinates) {
        alert(
            "Please use Get Location or enter location as latitude, longitude"
        );
        return;
    }

    const latitude =
        Number(coordinates[1]);

    const longitude =
        Number(coordinates[2]);

    try {
        const response = await fetch(
            `${API_URL}/complaints`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    location: {
                        latitude,
                        longitude
                    }
                })
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Complaint submission failed"
            );
        }

        const complaint =
            data.data || data.complaint;

        if (complaint && complaint._id) {
            localStorage.setItem(
                "complaintId",
                complaint._id
            );
        }

        localStorage.removeItem("issueTitle");
        localStorage.removeItem("category");
        localStorage.removeItem("description");
        localStorage.removeItem("location");

        alert(
            "Complaint submitted successfully! 🎉"
        );

        window.location.href = "complaints.html";

    } catch (error) {
        console.error(
            "Submit complaint error:",
            error
        );

        alert(error.message);
    }
}

function getLocation() {
    if (!navigator.geolocation) {
        alert(
            "Geolocation is not supported by your browser."
        );
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const locationInput =
                document.getElementById("location");

            if (locationInput) {
                locationInput.value =
                    `${latitude}, ${longitude}`;
            }
        },
        function () {
            alert(
                "Unable to get your location."
            );
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

async function loadAnalysisData() {
    const title =
        localStorage.getItem("issueTitle");

    const category =
        localStorage.getItem("category");

    const description =
        localStorage.getItem("description");

    const resultTitle =
        document.getElementById("resultTitle");

    const resultCategory =
        document.getElementById("resultCategory");

    const resultDescription =
        document.getElementById("resultDescription");

    if (title && resultTitle) {
        resultTitle.innerText = title;
    }

    if (category && resultCategory) {
        resultCategory.innerText = category;
    }

    if (description && resultDescription) {
        resultDescription.innerText =
            description;
    }
}

async function loadComplaintDetails() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    const id = params.get("id");

    if (!id) {
        alert("Complaint ID missing");
        window.location.href =
            "complaints.html";
        return;
    }

    const complaint =
        await getComplaintById(id);

    if (!complaint) {
        return;
    }

    const titleElement =
        document.getElementById(
            "complaintTitle"
        );

    const categoryElement =
        document.getElementById(
            "complaintCategory"
        );

    const statusElement =
        document.getElementById(
            "complaintStatus"
        );

    const locationElement =
        document.getElementById(
            "complaintLocation"
        );

    const descriptionElement =
        document.getElementById(
            "complaintDescription"
        );

    if (titleElement) {
        titleElement.innerText =
            complaint.title || "";
    }

    if (categoryElement) {
        categoryElement.innerText =
            complaint.category || "";
    }

    if (statusElement) {
        statusElement.innerText =
            complaint.status || "pending";
    }

    if (locationElement) {
        const latitude =
            complaint.location?.latitude;

        const longitude =
            complaint.location?.longitude;

        if (
            latitude !== undefined &&
            longitude !== undefined
        ) {
            locationElement.innerText =
                `${latitude}, ${longitude}`;
        }
    }

    if (descriptionElement) {
        descriptionElement.innerText =
            complaint.description || "";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await updateAuthUI();

        const protectedUser =
            await protectPage();

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

        const protectedPages = [
            "report.html",
            "analysis.html",
            "complaints.html",
            "details.html"
        ];

        if (
            protectedPages.includes(
                currentPage
            ) &&
            !protectedUser
        ) {
            return;
        }

        if (
            currentPage ===
            "analysis.html"
        ) {
            await loadAnalysisData();
        }

        if (
            currentPage ===
            "details.html"
        ) {
            await loadComplaintDetails();
        }
    }
);