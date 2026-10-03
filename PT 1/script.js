// ======================================================
// DATA STRUCTURES
// ======================================================

// Normal Queue
let patientQueue = [];

// Priority Queue
let emergencyQueue = [];

// Stack
let recordStack = [];

// History
let history = [];

// Counters
let servedCount = 0;
let patientID = 1;
let emergencyID = 1;
let recordID = 1;


// ======================================================
// NAVIGATION
// ======================================================

function showSection(sectionID, button) {

    const sections = document.querySelectorAll(".section");
    const buttons = document.querySelectorAll(".nav-btn");

    sections.forEach(section => {
        section.classList.remove("active-section");
    });

    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    document.getElementById(sectionID)
        .classList.add("active-section");

    button.classList.add("active");
}


// ======================================================
// NORMAL QUEUE
// ======================================================

function addPatient() {

    const name = document
        .getElementById("patientName")
        .value
        .trim();

    const reason = document
        .getElementById("patientReason")
        .value
        .trim();

    if (name === "" || reason === "") {

        notify("Please complete the patient information.");

        return;
    }

    const patient = {

        id: "P" + String(patientID).padStart(3, "0"),

        name: name,

        reason: reason,

        arrival: new Date().toLocaleTimeString()

    };

    patientID++;

    // QUEUE:
    // Add to the REAR
    patientQueue.push(patient);

    addHistory(
        "QUEUE",
        "ENQUEUE",
        patient.id + " - " + patient.name
    );

    document.getElementById("patientName").value = "";
    document.getElementById("patientReason").value = "";

    displayPatientQueue();

    updateDashboard();

    notify(patient.name + " joined the queue.");
}


function servePatient() {

    if (patientQueue.length === 0) {

        notify("The patient queue is empty.");

        return;
    }

    // QUEUE:
    // Remove from FRONT
    const patient = patientQueue.shift();

    servedCount++;

    addHistory(
        "QUEUE",
        "DEQUEUE",
        patient.id + " - " + patient.name
    );

    displayPatientQueue();

    updateDashboard();

    notify(patient.name + " is now being served.");
}


function viewNextPatient() {

    if (patientQueue.length === 0) {

        notify("No patients are waiting.");

        return;
    }

    // FRONT
    const patient = patientQueue[0];

    notify(
        "Next patient: " +
        patient.name +
        " (" +
        patient.reason +
        ")"
    );
}


// ======================================================
// DISPLAY NORMAL QUEUE
// ======================================================

function displayPatientQueue() {

    const container =
        document.getElementById("patientQueue");

    container.innerHTML = "";

    if (patientQueue.length === 0) {

        container.innerHTML =
            '<p class="empty">No patients waiting.</p>';

        return;
    }

    patientQueue.forEach(patient => {

        const card = document.createElement("div");

        card.className = "patient-card";

        card.innerHTML = `
            <h3>${patient.id}</h3>
            <strong>${patient.name}</strong>
            <p>${patient.reason}</p>
            <p>Arrived: ${patient.arrival}</p>
        `;

        container.appendChild(card);

    });
}


// ======================================================
// PRIORITY QUEUE
// ======================================================

function addEmergencyPatient() {

    const name = document
        .getElementById("emergencyName")
        .value
        .trim();

    const severity =
        parseInt(
            document.getElementById("severity").value
        );

    const reason = document
        .getElementById("emergencyReason")
        .value
        .trim();

    if (name === "" || reason === "") {

        notify("Please complete the emergency information.");

        return;
    }

    const patient = {

        id: "E" +
            String(emergencyID).padStart(3, "0"),

        name: name,

        severity: severity,

        reason: reason,

        arrival: new Date().toLocaleTimeString()

    };

    emergencyID++;

    // Add patient
    emergencyQueue.push(patient);

    // Sort by severity
    // 1 = highest priority
    emergencyQueue.sort(
        (a, b) => a.severity - b.severity
    );

    addHistory(
        "PRIORITY QUEUE",
        "INSERT",
        patient.id + " - " + patient.name
    );

    document.getElementById("emergencyName").value = "";

    document.getElementById("emergencyReason").value = "";

    displayPriorityQueue();

    updateDashboard();

    notify(
        patient.name +
        " added to emergency queue."
    );
}


function serveEmergency() {

    if (emergencyQueue.length === 0) {

        notify("Emergency queue is empty.");

        return;
    }

    // Remove highest priority
    const patient = emergencyQueue.shift();

    servedCount++;

    addHistory(
        "PRIORITY QUEUE",
        "REMOVE",
        patient.id + " - " + patient.name
    );

    displayPriorityQueue();

    updateDashboard();

    notify(
        "Treating " +
        patient.name +
        " (" +
        getSeverityName(patient.severity) +
        ")."
    );
}


// ======================================================
// PRIORITY QUEUE DISPLAY
// ======================================================

function displayPriorityQueue() {

    const container =
        document.getElementById("priorityQueue");

    container.innerHTML = "";

    if (emergencyQueue.length === 0) {

        container.innerHTML =
            '<p class="empty">No emergency patients.</p>';

        return;
    }

    emergencyQueue.forEach((patient, index) => {

        const card =
            document.createElement("div");

        card.className =
            "priority-card " +
            getSeverityClass(patient.severity);

        card.innerHTML = `

            <div class="priority-number">
                ${index + 1}
            </div>

            <div>

                <h3>
                    ${patient.id} — ${patient.name}
                </h3>

                <p>
                    ${getSeverityName(patient.severity)}
                    • ${patient.reason}
                </p>

            </div>
        `;

        container.appendChild(card);

    });
}


// ======================================================
// STACK
// ======================================================

function addRecord() {

    const patient = document
        .getElementById("recordPatient")
        .value
        .trim();

    const type = document
        .getElementById("recordType")
        .value
        .trim();

    if (patient === "" || type === "") {

        notify("Please complete the record information.");

        return;
    }

    const record = {

        id: "R" +
            String(recordID).padStart(3, "0"),

        patient: patient,

        type: type,

        created: new Date().toLocaleTimeString()

    };

    recordID++;

    // STACK:
    // Add to TOP
    recordStack.push(record);

    addHistory(
        "STACK",
        "PUSH",
        record.id + " - " + record.patient
    );

    document.getElementById("recordPatient").value = "";

    document.getElementById("recordType").value = "";

    displayRecordStack();

    updateDashboard();

    notify(
        "Record added to the stack."
    );
}


function processRecord() {

    if (recordStack.length === 0) {

        notify("Record stack is empty.");

        return;
    }

    // STACK:
    // Remove TOP
    const record = recordStack.pop();

    addHistory(
        "STACK",
        "POP",
        record.id + " - " + record.patient
    );

    displayRecordStack();

    updateDashboard();

    notify(
        record.id +
        " for " +
        record.patient +
        " processed."
    );
}


function peekRecord() {

    if (recordStack.length === 0) {

        notify("Record stack is empty.");

        return;
    }

    // PEEK:
    // Look at TOP without removing
    const record =
        recordStack[recordStack.length - 1];

    notify(
        "Top record: " +
        record.id +
        " — " +
        record.patient
    );
}


// ======================================================
// DISPLAY STACK
// ======================================================

function displayRecordStack() {

    const container =
        document.getElementById("recordStack");

    container.innerHTML = "";

    if (recordStack.length === 0) {

        container.innerHTML =
            '<p class="empty">No records.</p>';

        return;
    }

    // Reverse display so TOP appears first
    for (
        let i = recordStack.length - 1;
        i >= 0;
        i--
    ) {

        const record = recordStack[i];

        const card =
            document.createElement("div");

        card.className = "record-card";

        card.innerHTML = `

            <h3>${record.id}</h3>

            <strong>
                ${record.patient}
            </strong>

            <p>
                ${record.type}
            </p>

            <p>
                Added: ${record.created}
            </p>

        `;

        container.appendChild(card);
    }
}


// ======================================================
// HISTORY
// ======================================================

function addHistory(
    structure,
    operation,
    value
) {

    history.unshift({

        structure: structure,

        operation: operation,

        value: value,

        time: new Date().toLocaleTimeString()

    });

    displayHistory();
}


function displayHistory() {

    const table =
        document.getElementById("historyTable");

    table.innerHTML = "";

    history.forEach((item, index) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${item.structure}</td>

            <td>${item.operation}</td>

            <td>${item.value}</td>

            <td>${item.time}</td>

        `;

        table.appendChild(row);

    });
}


// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard() {

    document.getElementById("queueCount")
        .textContent = patientQueue.length;

    document.getElementById("priorityCount")
        .textContent = emergencyQueue.length;

    document.getElementById("stackCount")
        .textContent = recordStack.length;

    document.getElementById("servedCount")
        .textContent = servedCount;
}


// ======================================================
// SEVERITY
// ======================================================

function getSeverityName(level) {

    if (level === 1) {
        return "CRITICAL";
    }

    if (level === 2) {
        return "URGENT";
    }

    if (level === 3) {
        return "MODERATE";
    }

    return "MINOR";
}


function getSeverityClass(level) {

    if (level === 1) {
        return "critical";
    }

    if (level === 2) {
        return "urgent";
    }

    if (level === 3) {
        return "moderate";
    }

    return "minor";
}


// ======================================================
// NOTIFICATION
// ======================================================

function notify(message) {

    const notification =
        document.getElementById("notification");

    notification.textContent = message;

    notification.classList.add("show");

    setTimeout(() => {

        notification.classList.remove("show");

    }, 2500);
}


// ======================================================
// RESET
// ======================================================

function resetSystem() {

    const confirmReset =
        confirm(
            "Are you sure you want to reset the entire system?"
        );

    if (!confirmReset) {
        return;
    }

    patientQueue = [];

    emergencyQueue = [];

    recordStack = [];

    history = [];

    servedCount = 0;

    patientID = 1;

    emergencyID = 1;

    recordID = 1;

    displayPatientQueue();

    displayPriorityQueue();

    displayRecordStack();

    displayHistory();

    updateDashboard();

    notify("System has been reset.");
}


// ======================================================
// INITIALIZE
// ======================================================

displayPatientQueue();

displayPriorityQueue();

displayRecordStack();

displayHistory();

updateDashboard();