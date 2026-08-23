const API_URL = "https://ai-web3-futuretech-hackathon-2026-gagc.onrender.com/api";

let signupMode = false;

const DB_NAME = "FixMyCityDB";
const STORE_NAME = "complaintImages";


function openImageDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}


async function saveComplaintImage(file) {
    const db = await openImageDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(file, "currentImage");

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}


async function getComplaintImage() {
    const db = await openImageDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readonly"
        );

        const store = transaction.objectStore(STORE_NAME);
        const request = store.get("currentImage");

        request.onsuccess = () => {
            resolve(request.result || null);
        };

        request.onerror = () => reject(request.error);
    });
}


async function removeComplaintImage() {
    const db = await openImageDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete("currentImage");

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}


function toggleAuth() {
    signupMode = !signupMode;

    const title =
        document.getElementById("authTitle");

    const subtitle =
        document.getElementById("authSubtitle");

    const nameField =
        document.getElementById("nameField");

    const switchText =
        document.getElementById("switchText");

    const switchBtn =
        document.getElementById("switchBtn");

    const authSubmitBtn =
        document.getElementById("authSubmitBtn");

    if (
        !title ||
        !subtitle ||
        !nameField ||
        !switchText ||
        !switchBtn
    ) {
        return;
    }

    if (signupMode) {
        title.innerText = "Create Account 🚀";
        subtitle.innerText = "Join FixMyCity today";

        nameField.classList.remove("hidden");

        switchText.innerText =
            "Already have an account?";

        switchBtn.innerText = "Login";

        if (authSubmitBtn) {
            authSubmitBtn.innerText = "Sign Up";
        }
    } else {
        title.innerText = "Welcome Back 👋";
        subtitle.innerText =
            "Login to manage your complaints";

        nameField.classList.add("hidden");

        switchText.innerText =
            "Don't have an account?";

        switchBtn.innerText = "Sign Up";

        if (authSubmitBtn) {
            authSubmitBtn.innerText = "Login";
        }
    }
}


async function loginUser(event) {
    event.preventDefault();

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    if (!emailElement || !passwordElement) {
        return;
    }

    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;

    try {

        if (signupMode) {

            const nameElement =
                document.getElementById("name");

            const name = nameElement
                ? nameElement.value.trim()
                : "";

            if (!name) {
                alert("Please enter your name");
                return;
            }

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Registration failed"
                );
            }

            alert(
                "Account created successfully! 🎉"
            );

            signupMode = false;
            toggleAuth();

            passwordElement.value = "";

            return;
        }


        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Login failed"
            );
        }

        alert("Login successful! 👋");

        window.location.href = "index.html";

    } catch (error) {

        console.error(
            "Auth Error:",
            error
        );

        alert(error.message);
    }
}


async function getCurrentUser() {

    try {

        const response = await fetch(
            `${API_URL}/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            return null;
        }

        const data =
            await response.json();

        return data.data || null;

    } catch (error) {

        console.error(
            "Get user error:",
            error
        );

        return null;
    }
}


async function updateAuthUI() {

    const userName =
        document.getElementById("userName");

    const authButton =
        document.getElementById("authButton") ||
        document.getElementById("authBtn");

    if (!authButton) {
        return;
    }

    const user =
        await getCurrentUser();

    if (user) {

        if (userName) {
            userName.innerText =
                `Hi, ${user.name}`;
        }

        authButton.innerText = "Logout";
        authButton.href = "#";

        authButton.onclick =
            async function (event) {

                event.preventDefault();

                await logoutUser();
            };

    } else {

        if (userName) {
            userName.innerText = "";
        }

        authButton.innerText = "Login";
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

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Logout failed"
            );
        }

        window.location.href =
            "login.html";

    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );

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

        const data =
            await response.json();

        if (response.status === 401) {

            window.location.href =
                "login.html";

            return null;
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load complaints"
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

        const data =
            await response.json();

        if (response.status === 401) {

            window.location.href =
                "login.html";

            return null;
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Complaint not found"
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

    const user =
        await getCurrentUser();

    if (!user) {

        window.location.href =
            "login.html";

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

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    if (
        protectedPages.includes(
            currentPage
        )
    ) {
        return await requireAuth();
    }

    return null;
}


async function analyzeComplaint(event) {

    event.preventDefault();

    const title =
        document
            .getElementById("issueTitle")
            .value
            .trim();

    const category =
        document
            .getElementById("category")
            .value;

    const description =
        document
            .getElementById("description")
            .value
            .trim();

    const location =
        document
            .getElementById("location")
            .value
            .trim();

    const imageInput =
        document.getElementById(
            "issueImage"
        );

    const image =
        imageInput?.files?.[0] || null;


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


    const latitude =
        localStorage.getItem("latitude");

    const longitude =
        localStorage.getItem("longitude");


    if (!latitude || !longitude) {

        alert(
            "Please click Get Location before continuing."
        );

        return;
    }


    if (image) {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (
            !allowedTypes.includes(
                image.type
            )
        ) {

            alert(
                "Only JPG, PNG or WEBP images are allowed."
            );

            return;
        }


        if (
            image.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Image size must be less than 5MB."
            );

            return;
        }


        try {

            await saveComplaintImage(
                image
            );

        } catch (error) {

            console.error(
                "Image storage error:",
                error
            );

            alert(
                "Unable to save image."
            );

            return;
        }

    } else {

        await removeComplaintImage();
    }


    localStorage.setItem(
        "issueTitle",
        title
    );

    localStorage.setItem(
        "category",
        category
    );

    localStorage.setItem(
        "description",
        description
    );

    localStorage.setItem(
        "location",
        location
    );


    window.location.href =
        "analysis.html";
}


async function submitComplaint() {

    const title =
        localStorage.getItem(
            "issueTitle"
        );

    const category =
        localStorage.getItem(
            "category"
        );

    const description =
        localStorage.getItem(
            "description"
        );

    const location =
        localStorage.getItem(
            "location"
        );


    if (
        !title ||
        !category ||
        !description ||
        !location
    ) {

        alert(
            "Complaint information is missing"
        );

        return;
    }


    const latitude =
        Number(
            localStorage.getItem(
                "latitude"
            )
        );

    const longitude =
        Number(
            localStorage.getItem(
                "longitude"
            )
        );


    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        alert(
            "Please click Get Location before submitting."
        );

        return;
    }


    let image = null;


    try {

        image =
            await getComplaintImage();

    } catch (error) {

        console.error(
            "Image retrieval error:",
            error
        );
    }


    try {

        const formData =
            new FormData();


        formData.append(
            "title",
            title
        );


        formData.append(
            "description",
            description
        );


        formData.append(
            "category",
            category
        );


        formData.append(
            "location",
            JSON.stringify({
                latitude,
                longitude
            })
        );


        if (image) {

            formData.append(
                "image",
                image
            );
        }


        const response =
            await fetch(
                `${API_URL}/complaints`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (response.status === 401) {

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Complaint submission failed"
            );
        }


        const complaint =
            data.data ||
            data.complaint;


        if (
            complaint &&
            complaint._id
        ) {

            localStorage.setItem(
                "complaintId",
                complaint._id
            );
        }


        localStorage.removeItem(
            "issueTitle"
        );

        localStorage.removeItem(
            "category"
        );

        localStorage.removeItem(
            "description"
        );

        localStorage.removeItem(
            "location"
        );

        localStorage.removeItem(
            "latitude"
        );

        localStorage.removeItem(
            "longitude"
        );


        await removeComplaintImage();


        alert(
            "Complaint submitted successfully! 🎉"
        );


        window.location.href =
            "complaints.html";


    } catch (error) {

        console.error(
            "Submit complaint error:",
            error
        );

        alert(error.message);
    }
}


async function getLocation() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    const locationInput =
        document.getElementById(
            "location"
        );


    if (locationInput) {

        locationInput.value =
            "Getting location...";
    }


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            localStorage.setItem(
                "latitude",
                latitude
            );

            localStorage.setItem(
                "longitude",
                longitude
            );


            try {

                const response =
                    await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        {
                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to find location name"
                    );
                }


                const data =
                    await response.json();


                const address =
                    data.display_name ||
                    "Location found";


                if (locationInput) {

                    locationInput.value =
                        address;
                }


            } catch (error) {

                console.error(
                    "Reverse geocoding error:",
                    error
                );


                if (locationInput) {

                    locationInput.value =
                        `${latitude}, ${longitude}`;
                }
            }
        },


        function (error) {

            console.error(
                "Geolocation error:",
                error
            );


            if (locationInput) {

                locationInput.value = "";
            }


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                alert(
                    "Location permission denied. Please allow location access."
                );

            } else {

                alert(
                    "Unable to get your location."
                );
            }
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
        localStorage.getItem(
            "issueTitle"
        );

    const category =
        localStorage.getItem(
            "category"
        );

    const description =
        localStorage.getItem(
            "description"
        );


    const resultTitle =
        document.getElementById(
            "resultTitle"
        );

    const resultCategory =
        document.getElementById(
            "resultCategory"
        );

    const resultDescription =
        document.getElementById(
            "resultDescription"
        );


    if (
        title &&
        resultTitle
    ) {

        resultTitle.innerText =
            title;
    }


    if (
        category &&
        resultCategory
    ) {

        resultCategory.innerText =
            category;
    }


    if (
        description &&
        resultDescription
    ) {

        resultDescription.innerText =
            description;
    }
}


async function loadComplaintDetails() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    if (!id) {

        alert(
            "Complaint ID missing"
        );

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
            complaint.status ||
            "pending";
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