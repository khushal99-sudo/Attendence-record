const correctPassword = "admin123"; // Change this password

// 🔷 Login System
function checkLogin() {
    let password = document.getElementById("password").value;
    if (password === correctPassword) {
        localStorage.setItem("isLoggedIn", "true");
        document.getElementById("login-container").style.display = "none";
        document.getElementById("main-container").style.display = "block";
    } else {
        document.getElementById("error-msg").innerText = "Incorrect Password!";
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    document.getElementById("main-container").style.display = "none";
    document.getElementById("login-container").style.display = "block";
}

// Restore Login State
if (localStorage.getItem("isLoggedIn") === "true") {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("main-container").style.display = "block";
}

// Load Data
document.getElementById("current-date").innerText = new Date().toLocaleDateString();

const students = ["Mehfooz", "Pushkar kr.", "Khushi","Khushal garg","Sheetal","Harsh kr.","Sameer kr.","Aayush kr.","Vipin","Riya kumari","Asmita kr.","Madhu","Deepali","Anuj Tomar","Sahil","Md. Anas","Isha Devi","Suraj kr sh.","Kuldeep","Pooja kumari","Vinay Yadav","Sandeep","Vishal kr.","Anjali","Suraj","Aditya","Khushboo","Rahul","Krish","Gaurav","Menka","Muskan sh.","Anita","Yogita","Suraj kr.","Vishal","Khushi Gupta","Khushi","Aarti","Poonam","Sachin"];
const attendanceData = JSON.parse(localStorage.getItem("attendance")) || {};
const attendanceHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || {};
const applicationHistory = JSON.parse(localStorage.getItem("applicationHistory")) || {};

// 🔷 Load Attendance Table
function loadAttendance() {
    let tableBody = document.getElementById("attendance-body");
    tableBody.innerHTML = "";
    students.forEach((name) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${name}</td>
            <td>
                <button onclick="markAttendance('${name}', 'P')" class="present">P</button>
                <button onclick="markAttendance('${name}', 'A')" class="absent">A</button>
            </td>
            <td id="${name}-status">${attendanceData[name] || ""}</td>
        `;
        tableBody.appendChild(row);
    });
}

// 🔷 Mark Attendance & Save History
function markAttendance(name, status) {
    let today = new Date().toLocaleDateString();

    // Save attendance for today
    attendanceData[name] = status;
    localStorage.setItem("attendance", JSON.stringify(attendanceData));
    document.getElementById(`${name}-status`).innerText = status;

    // Save to history
    if (!attendanceHistory[today]) {
        attendanceHistory[today] = {};
    }
    attendanceHistory[today][name] = status;
    localStorage.setItem("attendanceHistory", JSON.stringify(attendanceHistory));

    // **Update Application Section** (Sirf Absent Students)
    updateApplications();
}

// 🔷 Update Application Table (Sirf Absent Students)
function updateApplications() {
    let tableBody = document.getElementById("application-body");
    tableBody.innerHTML = "";

    students.forEach((name) => {
        if (attendanceData[name] === "A") { // Sirf Absent students
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${name}</td>
                <td>Application for leave</td>
                <td>
                    <button onclick="submitApplication('${name}')">✅</button>
                    <button onclick="rejectApplication('${name}')">❌</button>
                </td>
            `;
            tableBody.appendChild(row);
        }
    });
}

// 🔷 Submit Application
function submitApplication(name) {
    let today = new Date().toLocaleDateString();
    
    if (!applicationHistory[today]) {
        applicationHistory[today] = {};
    }
    applicationHistory[today][name] = "Submitted";
    localStorage.setItem("applicationHistory", JSON.stringify(applicationHistory));

    updateApplications();
}

// 🔷 Reject Application
function rejectApplication(name) {
    let today = new Date().toLocaleDateString();
    
    if (!applicationHistory[today]) {
        applicationHistory[today] = {};
    }
    applicationHistory[today][name] = "Not submitted";
    localStorage.setItem("applicationHistory", JSON.stringify(applicationHistory));

    updateApplications();
}

// 🔷 View Attendance History
function viewAttendanceHistory() {
    let historyTable = document.getElementById("attendance-history-table");
    historyTable.innerHTML = "<tr><th>Date</th><th>Name</th><th>Status</th></tr>";

    for (let date in attendanceHistory) {
        for (let student in attendanceHistory[date]) {
            let row = `<tr><td>${date}</td><td>${student}</td><td>${attendanceHistory[date][student]}</td></tr>`;
            historyTable.innerHTML += row;
        }
    }
    document.getElementById("attendance-history-modal").style.display = "block";
}

// 🔷 Close Attendance History
function closeAttendanceHistory() {
    document.getElementById("attendance-history-modal").style.display = "none";
}

// 🔷 View Application History
function viewApplicationHistory() {
    let historyTable = document.getElementById("application-history-table");
    historyTable.innerHTML = "<tr><th>Date</th><th>Name</th><th>Status</th></tr>";

    for (let date in applicationHistory) {
        for (let student in applicationHistory[date]) {
            let row = `<tr><td>${date}</td><td>${student}</td><td>${applicationHistory[date][student]}</td></tr>`;
            historyTable.innerHTML += row;
        }
    }
    document.getElementById("application-history-modal").style.display = "block";
}

// 🔷 Close Application History
function closeApplicationHistory() {
    document.getElementById("application-history-modal").style.display = "none";
}

// **Page Load Functions**
window.onload = function() {
    loadAttendance();
    updateApplications(); // Ensure Applications table updates correctly
};
