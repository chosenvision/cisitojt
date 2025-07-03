// Global variables
let currentUser = null
let requests = []
let editingRequestId = null

// Date formatting functions
function formatDateToMMDDYYYY(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

function formatDateToYYYYMMDD(dateString) {
  if (!dateString) return ""
  // If already in YYYY-MM-DD format, return as is
  if (dateString.includes("-")) return dateString

  // Convert MM/DD/YYYY to YYYY-MM-DD
  const parts = dateString.split("/")
  if (parts.length === 3) {
    const month = parts[0].padStart(2, "0")
    const day = parts[1].padStart(2, "0")
    const year = parts[2]
    return `${year}-${month}-${day}`
  }
  return dateString
}

// Local Storage functions
function saveRequests() {
  localStorage.setItem("transco_requests", JSON.stringify(requests))
}

function loadRequests() {
  const saved = localStorage.getItem("transco_requests")
  if (saved) {
    requests = JSON.parse(saved)
  } else {
    // Initialize with sample data
    requests = [
      {
        id: "1",
        requestor: "SAMPLE REQUESTOR",
        costCenter: "CC-001",
        dateRequest: "01/15/2024",
        timeRequest: "09:30",
        supportDesk: "IT Support",
        dateAcknowledge: "01/15/2024",
        acknowledgedBy: "John Doe",
        dateClosed: "01/16/2024",
        timeClosed: "17:30",
        techSupport: "Tech Team A",
        status: "Resolved",
        remarks: "Hardware issue resolved",
        emailSubject: "Network connectivity issue",
        findings: "Router configuration updated",
        daysToComplete: 1,
      },
      {
        id: "2",
        requestor: "ANOTHER SAMPLE",
        costCenter: "CC-002",
        dateRequest: "01/16/2024",
        timeRequest: "14:15",
        supportDesk: "IS Support",
        dateAcknowledge: "01/16/2024",
        acknowledgedBy: "Jane Smith",
        dateClosed: "",
        timeClosed: "",
        techSupport: "Tech Team B",
        status: "In Progress",
        remarks: "Software installation pending",
        emailSubject: "Software installation request",
        findings: "Pending user approval",
        daysToComplete: 0,
      },
    ]
    saveRequests()
  }
}

function saveUser() {
  if (currentUser) {
    localStorage.setItem("transco_user", JSON.stringify(currentUser))
  }
}

function loadUser() {
  const saved = localStorage.getItem("transco_user")
  if (saved) {
    currentUser = JSON.parse(saved)
    document.getElementById("profileName").textContent = currentUser.name
    document.getElementById("profileEmail").textContent = currentUser.email
    return true
  }
  return false
}

// Page navigation functions
function showLogin() {
  hideAllPages()
  document.getElementById("loginPage").classList.add("active")
  // Clear user data
  currentUser = null
  localStorage.removeItem("transco_user")
}

function showSignup() {
  hideAllPages()
  document.getElementById("signupPage").classList.add("active")
}

function showDashboard() {
  hideAllPages()
  document.getElementById("dashboardPage").classList.add("active")
  loadRequests()
  renderTable()
  updateStats()
}

function hideAllPages() {
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => {
    page.classList.remove("active")
  })
}

// Authentication functions
function login(email, password) {
  // Mock login - in real app, validate credentials
  currentUser = { name: "Sample User", email: email }
  document.getElementById("profileName").textContent = currentUser.name
  document.getElementById("profileEmail").textContent = currentUser.email
  saveUser()
  showDashboard()
}

function logout() {
  showLogin()
}

// Modal functions
function openForgotPasswordModal() {
  document.getElementById("forgotPasswordModal").style.display = "flex"
}

function closeForgotPasswordModal() {
  document.getElementById("forgotPasswordModal").style.display = "none"
}

function toggleProfileModal() {
  const modal = document.getElementById("profileModal")
  modal.style.display = modal.style.display === "flex" ? "none" : "flex"
}

function closeProfileModal() {
  document.getElementById("profileModal").style.display = "none"
}

function togglePrintDropdown() {
  const dropdown = document.getElementById("printDropdown")
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block"
}

function showPrintOptions() {
  document.getElementById("printOptionsModal").style.display = "flex"
  document.getElementById("printDropdown").style.display = "none"
}

function closePrintOptionsModal() {
  document.getElementById("printOptionsModal").style.display = "none"
}

function printReport(type, orientation = "portrait") {
  let filteredData = requests

  // Filter by type if specified
  if (type !== "all") {
    filteredData = requests.filter((request) => request.supportDesk === type)
  }

  // Enhanced print styles with better formatting and legends
  const orientationStyles =
    orientation === "landscape"
      ? "@page { size: A4 landscape; margin: 0.5in; }"
      : "@page { size: A4 portrait; margin: 0.5in; }"

  // Create print content with enhanced design and legends
  let printContent = `
        <html>
        <head>
            <title>TransCo - ${type === "all" ? "All" : type} Support Requests</title>
            <style>
                ${orientationStyles}
                body { 
                    font-family: Arial, sans-serif; 
                    font-size: 10px;
                    margin: 0;
                    color: #333;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 20px; 
                    border-bottom: 2px solid #3b82f6;
                    padding-bottom: 10px;
                }
                .header h1 { 
                    font-size: 18px;
                    color: #3b82f6;
                    margin: 0;
                }
                .header p {
                    font-size: 12px;
                    color: #666;
                    margin: 5px 0;
                }
                .legends {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    font-size: 8px;
                }
                .legend-section {
                    flex: 1;
                    margin-right: 20px;
                }
                .legend-title {
                    font-weight: bold;
                    color: #374151;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                }
                .legend-item {
                    display: flex;
                    align-items: center;
                    margin: 2px 0;
                }
                .legend-color {
                    width: 12px;
                    height: 12px;
                    margin-right: 5px;
                    border-radius: 2px;
                }
                .support-it { background: #dbeafe; }
                .support-is { background: #d1fae5; }
                .status-open { background: #dbeafe; }
                .status-progress { background: #fef3c7; }
                .status-resolved { background: #d1fae5; }
                .status-closed { background: #fce4ec; }
                .days-normal { background: #d1fae5; }
                .days-warning { background: #fef3c7; }
                .days-critical { background: #fee2e2; }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    font-size: 7px;
                    margin-top: 10px;
                }
                th, td { 
                    border: 1px solid #d1d5db; 
                    padding: 4px 2px; 
                    text-align: left; 
                    word-wrap: break-word;
                    vertical-align: top;
                }
                th { 
                    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                    font-weight: bold;
                    color: #374151;
                    font-size: 8px;
                }
                .row-number {
                    background: #f9fafb;
                    font-weight: bold;
                    text-align: center;
                    width: 30px;
                }
                .badge { 
                    padding: 2px 6px; 
                    border-radius: 4px; 
                    font-size: 6px; 
                    font-weight: bold;
                    text-align: center;
                    display: inline-block;
                    min-width: 40px;
                }
                .it-support { 
                    background: #dbeafe; 
                    color: #1d4ed8; 
                    border: 1px solid #93c5fd;
                }
                .is-support { 
                    background: #d1fae5; 
                    color: #047857; 
                    border: 1px solid #6ee7b7;
                }
                .status-resolved { 
                    background: #d1fae5; 
                    color: #047857; 
                    border: 1px solid #6ee7b7;
                }
                .status-in-progress { 
                    background: #fef3c7; 
                    color: #d97706; 
                    border: 1px solid #fcd34d;
                }
                .status-open { 
                    background: #dbeafe; 
                    color: #1d4ed8; 
                    border: 1px solid #93c5fd;
                }
                .status-closed { 
                    background: #fce4ec; 
                    color: #be185d; 
                    border: 1px solid #f9a8d4;
                }
                .days-normal { 
                    background: #d1fae5; 
                    color: #047857; 
                    border: 1px solid #6ee7b7;
                }
                .days-warning { 
                    background: #fef3c7; 
                    color: #d97706; 
                    border: 1px solid #fcd34d;
                }
                .days-critical { 
                    background: #fee2e2; 
                    color: #dc2626; 
                    border: 1px solid #fca5a5;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 8px;
                    color: #6b7280;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 10px;
                }
                tr:nth-child(even) {
                    background: #f9fafb;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>TransCo - ${type === "all" ? "All" : type} Support Requests</h1>
                <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                <p>Total Records: ${filteredData.length} | Orientation: ${orientation.charAt(0).toUpperCase() + orientation.slice(1)}</p>
            </div>
            
            <div class="legends">
                <div class="legend-section">
                    <div class="legend-title">Support Desk Types</div>
                    <div class="legend-item">
                        <div class="legend-color support-it"></div>
                        <span>IT Support</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color support-is"></div>
                        <span>IS Support</span>
                    </div>
                </div>
                
                <div class="legend-section">
                    <div class="legend-title">Request Status</div>
                    <div class="legend-item">
                        <div class="legend-color status-open"></div>
                        <span>Open</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color status-progress"></div>
                        <span>In Progress</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color status-resolved"></div>
                        <span>Resolved</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color status-closed"></div>
                        <span>Closed</span>
                    </div>
                </div>
                
                <div class="legend-section">
                    <div class="legend-title">Completion Time</div>
                    <div class="legend-item">
                        <div class="legend-color days-normal"></div>
                        <span>1-3 Days (Normal)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color days-warning"></div>
                        <span>4-7 Days (Warning)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color days-critical"></div>
                        <span>8+ Days (Critical)</span>
                    </div>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th class="row-number">#</th>
                        <th>Requestor</th>
                        <th>Cost Center</th>
                        <th>Date Request</th>
                        <th>Time Request</th>
                        <th>Support Desk</th>
                        <th>Date Acknowledge</th>
                        <th>Acknowledged By</th>
                        <th>Date Closed</th>
                        <th>Time Closed</th>
                        <th>Tech Support</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th>Email Subject</th>
                        <th>Findings</th>
                        <th>Days to Complete</th>
                    </tr>
                </thead>
                <tbody>
    `

  filteredData.forEach((request, index) => {
    const daysText =
      request.daysToComplete > 0 ? `${request.daysToComplete} day${request.daysToComplete !== 1 ? "s" : ""}` : "-"
    const daysClass =
      request.daysToComplete === 0
        ? "days-normal"
        : request.daysToComplete <= 3
          ? "days-normal"
          : request.daysToComplete <= 7
            ? "days-warning"
            : "days-critical"

    printContent += `
            <tr>
                <td class="row-number">${index + 1}</td>
                <td>${request.requestor}</td>
                <td>${request.costCenter || "-"}</td>
                <td>${request.dateRequest}</td>
                <td>${request.timeRequest}</td>
                <td><span class="badge ${request.supportDesk.toLowerCase().replace(" ", "-")}">${request.supportDesk}</span></td>
                <td>${request.dateAcknowledge || "-"}</td>
                <td>${request.acknowledgedBy || "-"}</td>
                <td>${request.dateClosed || "-"}</td>
                <td>${request.timeClosed || "-"}</td>
                <td>${request.techSupport || "-"}</td>
                <td><span class="badge status-${request.status.toLowerCase().replace(" ", "-")}">${request.status}</span></td>
                <td>${request.remarks || "-"}</td>
                <td>${request.emailSubject || "-"}</td>
                <td>${request.findings || "-"}</td>
                <td><span class="badge ${daysClass}">${daysText}</span></td>
            </tr>
        `
  })

  printContent += `
                </tbody>
            </table>
            
            <div class="footer">
                <p>TransCo IT/IS Support Request Management System | Report generated automatically</p>
                <p>This report contains ${filteredData.length} records | Page orientation: ${orientation}</p>
            </div>
        </body>
        </html>
    `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  document.getElementById("printDropdown").style.display = "none"
}

function openAddModal() {
  editingRequestId = null
  document.getElementById("modalTitle").textContent = "Add New Request"
  document.getElementById("requestForm").reset()

  // Set current date and time
  const now = new Date()
  const dateStr =
    now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0")
  const timeStr = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0")

  document.getElementById("dateRequest").value = dateStr
  document.getElementById("timeRequest").value = timeStr

  document.getElementById("requestModal").style.display = "flex"
}

function closeRequestModal() {
  document.getElementById("requestModal").style.display = "none"
  editingRequestId = null
}

function editRequest(button) {
  const row = button.closest("tr")
  const requestId = row.dataset.requestId
  const request = requests.find((r) => r.id === requestId)

  if (!request) return

  editingRequestId = requestId
  document.getElementById("modalTitle").textContent = "Edit Request"

  // Populate form with request data
  document.getElementById("requestor").value = request.requestor
  document.getElementById("costCenter").value = request.costCenter || ""
  document.getElementById("dateRequest").value = formatDateToMMDDYYYY(request.dateRequest)
  document.getElementById("timeRequest").value = request.timeRequest
  document.getElementById("supportDesk").value = request.supportDesk
  document.getElementById("dateAcknowledge").value = formatDateToMMDDYYYY(request.dateAcknowledge)
  document.getElementById("acknowledgedBy").value = request.acknowledgedBy || ""
  document.getElementById("dateClosed").value = formatDateToYYYYMMDD(request.dateClosed)
  document.getElementById("timeClosed").value = request.timeClosed || ""
  document.getElementById("techSupport").value = request.techSupport || ""
  document.getElementById("status").value = request.status
  document.getElementById("remarks").value = request.remarks || ""
  document.getElementById("emailSubject").value = request.emailSubject || ""
  document.getElementById("findings").value = request.findings || ""

  document.getElementById("requestModal").style.display = "flex"
}

function viewRequest(button) {
  const row = button.closest("tr")
  const requestId = row.dataset.requestId
  const request = requests.find((r) => r.id === requestId)

  if (!request) return

  const daysText =
    request.daysToComplete > 0 ? `${request.daysToComplete} day${request.daysToComplete !== 1 ? "s" : ""}` : "-"

  const content = `
        <div class="view-content">
            <div class="view-section">
                <h3>
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    Request Information
                </h3>
                <div class="view-grid">
                    <div class="view-item">
                        <label>Requestor:</label>
                        <span>${request.requestor}</span>
                    </div>
                    <div class="view-item">
                        <label>Cost Center:</label>
                        <span>${request.costCenter || "-"}</span>
                    </div>
                    <div class="view-item">
                        <label>Date Request:</label>
                        <span>${request.dateRequest}</span>
                    </div>
                    <div class="view-item">
                        <label>Time Request:</label>
                        <span>${request.timeRequest}</span>
                    </div>
                    <div class="view-item">
                        <label>Support Desk:</label>
                        <span>${request.supportDesk}</span>
                    </div>
                    <div class="view-item">
                        <label>Status:</label>
                        <span>${request.status}</span>
                    </div>
                    <div class="view-item">
                        <label>Email Subject:</label>
                        <span>${request.emailSubject || "-"}</span>
                    </div>
                    <div class="view-item">
                        <label>Days to Complete:</label>
                        <span>${daysText}</span>
                    </div>
                </div>
                <div class="view-item" style="margin-top: 1rem;">
                    <label>Findings:</label>
                    <div class="remarks-content">${request.findings || "-"}</div>
                </div>
            </div>
            <div class="view-section">
                <h3>
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Administrative Details
                </h3>
                <div class="view-grid">
                    <div class="view-item">
                        <label>Date Acknowledged:</label>
                        <span>${request.dateAcknowledge || "-"}</span>
                    </div>
                    <div class="view-item">
                        <label>Acknowledged By:</label>
                        <span>${request.acknowledgedBy || "-"}</span>
                    </div>
                    <div class="view-item">
                        <label>Date Closed:</label>
                        <span>${request.dateClosed || "-"}</span>
                    </div>
                    <div class="view-item">
                        <label>Time Closed:</label>
                        <span>${request.timeClosed || "-"}</span>
                    </div>
                    <div class="view-item">
                        <label>Tech Support:</label>
                        <span>${request.techSupport || "-"}</span>
                    </div>
                </div>
            </div>
            <div class="view-section">
                <h3>Remarks</h3>
                <div class="remarks-content">${request.remarks || "No remarks provided."}</div>
            </div>
        </div>
    `

  document.getElementById("viewModalBody").innerHTML = content
  document.getElementById("viewModal").style.display = "flex"
}

function closeViewModal() {
  document.getElementById("viewModal").style.display = "none"
}

function deleteRequest(button) {
  if (confirm("Are you sure you want to delete this request?")) {
    const row = button.closest("tr")
    const requestId = row.dataset.requestId
    requests = requests.filter((r) => r.id !== requestId)
    saveRequests()
    renderTable()
    updateStats()
  }
}

// Enhanced Filter functions
function toggleFilters() {
  const filterSection = document.getElementById("filterSection")
  filterSection.style.display = filterSection.style.display === "none" ? "block" : "none"
}

function applyFilters() {
  renderTable()
}

function clearFilters() {
  document.getElementById("filterRequestor").value = ""
  document.getElementById("filterStatus").value = ""
  document.getElementById("filterSupport").value = ""
  document.getElementById("filterDateFrom").value = ""
  document.getElementById("filterDateTo").value = ""
  renderTable()
}

// Utility functions
function refreshTable() {
  loadRequests()
  renderTable()
  updateStats()
  alert("Data refreshed!")
}

function exportData() {
  const requestorFilter = document.getElementById("filterRequestor").value.toLowerCase()
  const statusFilter = document.getElementById("filterStatus").value
  const supportFilter = document.getElementById("filterSupport").value
  const dateFromFilter = document.getElementById("filterDateFrom").value
  const dateToFilter = document.getElementById("filterDateTo").value

  const filteredRequests = requests.filter((request) => {
    if (requestorFilter && !request.requestor.toLowerCase().includes(requestorFilter)) return false
    if (statusFilter && request.status !== statusFilter) return false
    if (supportFilter && request.supportDesk !== supportFilter) return false
    if (dateFromFilter && formatDateToMMDDYYYY(request.dateRequest) < dateFromFilter) return false
    if (dateToFilter && formatDateToMMDDYYYY(request.dateRequest) > dateToFilter) return false
    return true
  })

  // Enhanced CSV content with better formatting and BOM for Excel compatibility
  const BOM = "\uFEFF" // Byte Order Mark for proper Excel encoding
  let csvContent =
    BOM +
    [
      [
        "No.",
        "Requestor",
        "Cost Center",
        "Date Request",
        "Time Request",
        "Support Desk",
        "Date Acknowledge",
        "Acknowledged By",
        "Date Closed",
        "Time Closed",
        "Tech Support",
        "Status",
        "Remarks",
        "Email Subject",
        "Findings",
        "Days to Complete",
      ]
        .map((field) => `"${field}"`)
        .join(","),
    ].join("")

  filteredRequests.forEach((request, index) => {
    const daysText =
      request.daysToComplete > 0 ? `${request.daysToComplete} day${request.daysToComplete !== 1 ? "s" : ""}` : "-"
    csvContent +=
      "\n" +
      [
        index + 1,
        `"${request.requestor.replace(/"/g, '""')}"`,
        `"${(request.costCenter || "").replace(/"/g, '""')}"`,
        `"${request.dateRequest}"`,
        `"${request.timeRequest}"`,
        `"${request.supportDesk}"`,
        `"${(request.dateAcknowledge || "").replace(/"/g, '""')}"`,
        `"${(request.acknowledgedBy || "").replace(/"/g, '""')}"`,
        `"${(request.dateClosed || "").replace(/"/g, '""')}"`,
        `"${(request.timeClosed || "").replace(/"/g, '""')}"`,
        `"${(request.techSupport || "").replace(/"/g, '""')}"`,
        `"${request.status}"`,
        `"${(request.remarks || "").replace(/"/g, '""')}"`,
        `"${(request.emailSubject || "").replace(/"/g, '""')}"`,
        `"${(request.findings || "").replace(/"/g, '""')}"`,
        `"${daysText}"`,
      ].join(",")
  })

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `transco-support-requests-${new Date().toISOString().split("T")[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

function calculateBusinessDays(acknowledgeDate, closedDate, acknowledgeTime, closedTime) {
  if (!acknowledgeDate || !closedDate) return 0

  const start = new Date(formatDateToYYYYMMDD(acknowledgeDate) + "T" + (acknowledgeTime || "09:00"))
  const end = new Date(formatDateToYYYYMMDD(closedDate) + "T" + (closedTime || "17:00"))

  let businessDays = 0
  const currentDate = new Date(start)

  while (currentDate <= end) {
    // Check if it's a weekday (Monday = 1, Friday = 5)
    if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
      businessDays++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return Math.max(businessDays, 1)
}

function renderTable() {
  const requestorFilter = document.getElementById("filterRequestor").value.toLowerCase()
  const statusFilter = document.getElementById("filterStatus").value
  const supportFilter = document.getElementById("filterSupport").value
  const dateFromFilter = document.getElementById("filterDateFrom").value
  const dateToFilter = document.getElementById("filterDateTo").value

  const filteredRequests = requests.filter((request) => {
    if (requestorFilter && !request.requestor.toLowerCase().includes(requestorFilter)) return false
    if (statusFilter && request.status !== statusFilter) return false
    if (supportFilter && request.supportDesk !== supportFilter) return false
    if (dateFromFilter && formatDateToYYYYMMDD(request.dateRequest) < dateFromFilter) return false
    if (dateToFilter && formatDateToYYYYMMDD(request.dateRequest) > dateToFilter) return false
    return true
  })

  const tableBody = document.getElementById("tableBody")
  tableBody.innerHTML = ""

  filteredRequests.forEach((request) => {
    const row = document.createElement("tr")
    row.dataset.requestId = request.id

    const daysText =
      request.daysToComplete > 0 ? `${request.daysToComplete} day${request.daysToComplete !== 1 ? "s" : ""}` : "-"
    const daysClass = request.daysToComplete === 0 ? "pending" : request.daysToComplete > 3 ? "overdue" : ""

    row.innerHTML = `
            <td>${request.requestor}</td>
            <td>${request.costCenter || "-"}</td>
            <td>${request.dateRequest}</td>
            <td>${request.timeRequest}</td>
            <td><span class="badge ${request.supportDesk.toLowerCase().replace(" ", "-")}">${request.supportDesk}</span></td>
            <td>${request.dateAcknowledge || "-"}</td>
            <td>${request.acknowledgedBy || "-"}</td>
            <td>${request.dateClosed || "-"}</td>
            <td>${request.timeClosed || "-"}</td>
            <td>${request.techSupport || "-"}</td>
            <td><span class="status-badge ${request.status.toLowerCase().replace(" ", "-")}">${request.status}</span></td>
            <td>${request.remarks || "-"}</td>
            <td>${request.emailSubject || "-"}</td>
            <td>${request.findings || "-"}</td>
            <td><span class="days-badge ${daysClass}">${daysText}</span></td>
            <td class="no-print">
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editRequest(this)" title="Edit">
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="btn-view" onclick="viewRequest(this)" title="View">
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </button>
                    <button class="btn-delete" onclick="deleteRequest(this)" title="Delete">
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `

    tableBody.appendChild(row)
  })

  // Update pagination info
  document.getElementById("showingStart").textContent = filteredRequests.length > 0 ? "1" : "0"
  document.getElementById("showingEnd").textContent = filteredRequests.length.toString()
  document.getElementById("totalEntries").textContent = filteredRequests.length.toString()
}

function updateStats() {
  const total = requests.length
  const pending = requests.filter((r) => r.status === "Open").length
  const completed = requests.filter((r) => r.status === "Resolved" || r.status === "Closed").length
  const inProgress = requests.filter((r) => r.status === "In Progress").length

  document.getElementById("totalRequests").textContent = total
  document.getElementById("pendingRequests").textContent = pending
  document.getElementById("completedRequests").textContent = completed
  document.getElementById("inProgressRequests").textContent = inProgress
}

// Navigation functions
function showAbout() {
  alert(
    "About TransCo - IT/IS Support Request Management System\n\nVersion 2.0\nDeveloped for efficient support request tracking and management.",
  )
}

function showContacts() {
  alert(
    "Contact Information:\n\nEmail: customerservice@transco.ph\nPhone: +63 (02) 7 902-1500\nAddress: J2WQ+2W6, Power Center, Agham Road, Corner Quezon Avenue, Diliman, Quezon City, 1101",
  )
}


// Form submission handlers
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (!email || !password) {
    alert("Please fill in all fields.")
    return
  }

  login(email, password)
})

document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const fullName = document.getElementById("fullName").value
  const email = document.getElementById("signupEmail").value
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  if (password !== confirmPassword) {
    alert("Passwords do not match.")
    return
  }

  // Mock signup
  currentUser = { name: fullName, email: email }
  document.getElementById("profileName").textContent = currentUser.name
  document.getElementById("profileEmail").textContent = currentUser.email
  saveUser()
  showDashboard()
})

document.getElementById("forgotPasswordForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const email = document.getElementById("forgotEmail").value

  if (!email) {
    alert("Please enter your email address.")
    return
  }

  closeForgotPasswordModal()
  alert("Password reset link sent to your email!")
})

// Print options form handler
document.getElementById("printOptionsForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const printType = document.getElementById("printType").value
  const printOrientation = document.getElementById("printOrientation").value

  printReport(printType, printOrientation)
  closePrintOptionsModal()
})

// Form submission handler for request form
document.getElementById("requestForm").addEventListener("submit", function (e) {
  e.preventDefault()

  const formData = new FormData(this)

  // Basic validation
  const requiredFields = ["requestor", "dateRequest", "timeRequest", "supportDesk"]
  let isValid = true

  requiredFields.forEach((field) => {
    const input = document.getElementById(field)
    if (!input.value.trim()) {
      input.style.borderColor = "#ef4444"
      isValid = false
    } else {
      input.style.borderColor = "#d1d5db"
    }
  })

  if (!isValid) {
    alert("Please fill in all required fields.")
    return
  }

  // Calculate business days using acknowledge and closed dates
  const businessDays = calculateBusinessDays(
    formData.get("dateAcknowledge"),
    formData.get("dateClosed"),
    formData.get("timeRequest"),
    formData.get("timeClosed"),
  )

  const requestData = {
    id: editingRequestId || Date.now().toString(),
    requestor: formData.get("requestor"),
    costCenter: formData.get("costCenter") || "",
    dateRequest: formatDateToMMDDYYYY(formData.get("dateRequest")),
    timeRequest: formData.get("timeRequest"),
    supportDesk: formData.get("supportDesk"),
    dateAcknowledge: formData.get("dateAcknowledge") ? formatDateToMMDDYYYY(formData.get("dateAcknowledge")) : "",
    acknowledgedBy: formData.get("acknowledgedBy") || "",
    dateClosed: formData.get("dateClosed") ? formatDateToMMDDYYYY(formData.get("dateClosed")) : "",
    timeClosed: formData.get("timeClosed") || "",
    techSupport: formData.get("techSupport") || "",
    status: formData.get("status") || "Open",
    remarks: formData.get("remarks") || "",
    emailSubject: formData.get("emailSubject") || "",
    findings: formData.get("findings") || "",
    daysToComplete: businessDays,
  }

  if (editingRequestId) {
    // Update existing request
    const index = requests.findIndex((r) => r.id === editingRequestId)
    if (index !== -1) {
      requests[index] = requestData
    }
  } else {
    // Add new request
    requests.push(requestData)
  }

  saveRequests()
  renderTable()
  updateStats()
  closeRequestModal()

  alert(editingRequestId ? "Request updated successfully!" : "Request submitted successfully!")
})

// Close modals when clicking outside
window.onclick = (event) => {
  const modals = ["requestModal", "profileModal", "viewModal", "forgotPasswordModal", "printOptionsModal"]
  modals.forEach((modalId) => {
    const modal = document.getElementById(modalId)
    if (event.target == modal) {
      modal.style.display = "none"
    }
  })

  // Close print dropdown
  const printDropdown = document.getElementById("printDropdown")
  if (!event.target.matches(".print-btn") && !event.target.closest(".print-dropdown")) {
    printDropdown.style.display = "none"
  }
}

// Initialize application - Fixed landing page bug
document.addEventListener("DOMContentLoaded", () => {
  // Always start with login page, don't auto-login
  showLogin()

  // Load requests for when user does login
  loadRequests()
})
