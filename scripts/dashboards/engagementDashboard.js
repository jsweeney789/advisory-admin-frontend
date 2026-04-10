const URL = "http://localhost:8080/engagements"; // engagements url
let allEngagements = [];
let selectedEngagement;

// search bar logic
const searchInput = document.querySelector("[data-search]");
searchInput.addEventListener("input", (e) => {
    console.log(e);
    const value = e.target.value.toLowerCase();
    allEngagements.forEach(engagement => {

        const client = engagement.client;
        const fullName = client.firstName + " " + client.lastName;
        const clientVisible = client.firstName.toLowerCase().includes(value) || client.lastName.toLowerCase().includes(value) ||
                          client.email.toLowerCase().includes(value) || client.phone.toLowerCase().includes(value) ||
                          client.estNetWorth.toLowerCase().includes(value) || client.tier.toLowerCase().includes(value) ||
                          fullName.toLowerCase().includes(value);

        const advisory = engagement.advisory;
        const advisoryVisible = advisory.name.toLowerCase().includes(value) || advisory.serviceType.toLowerCase().includes(value) ||
                                advisory.deliveryFormat.toLowerCase().includes(value) || advisory.annualFee.toString().includes(value);

        const engagementVisible = engagement.startDate.includes(value) || engagement.status.includes(value) || engagement.notes.includes(value);
        const isVisible = ((clientVisible || advisoryVisible) || engagementVisible);

        if (isVisible) {
            engagement.element.style.display = "";
        } else {
            engagement.element.style.display = "none";
        }
        
    })
})

// load all engagements on loading page, should probably organize it via advisory service
document.addEventListener("DOMContentLoaded", () => {
    // 
    fetch(URL, {
        method: "GET"
    }).then( response => {
        if (!response.ok)
            throw new Error("Could not retrieve data");
        return response.json();
    }).then( engagements => {
        engagements.forEach((engagement) => addEngagementToTable(engagement));
    }).catch( error => console.error("Error fetching data." + error.stack));

});

const addEngagementToTable = (newEngagement) => {
    // add to JS list and to html table -- make sure we properly handle client and advisory objects

    let tr = document.createElement("tr"); // TODO: set up some kind of engagement name system, probably client-advisory by default and can be renamed

    let advisoryName = document.createElement("td");
    let clientName = document.createElement("td");
    let startDate = document.createElement("td");
    let status = document.createElement("td");
    let notes = document.createElement("td");

    let editBtnTd = document.createElement("td");  
    let deleteBtnTd = document.createElement("td");

    advisoryName.innerText = newEngagement.advisory.name;
    clientName.innerText = newEngagement.client.firstName + " " + newEngagement.client.lastName;
    startDate.innerText = newEngagement.startDate;
    status.innerText = newEngagement.status;


    if (newEngagement.notes == null || newEngagement.notes == undefined || newEngagement.notes == "") 
        {newEngagement.notes = "No notes on engagement."}
    notes.innerText = newEngagement.notes;

    // I think it's worth copying the edit/delete buttons from class. Edit will be a form and delete will bring up a toast pop-up to delete the row
    editBtnTd.innerHTML = `<button class="btn btn-primary p-1" id="EDIT-${newEngagement.engagementId}" onclick="activateEdit(${newEngagement.engagementId})"><i class="bi bi-pencil-square"></i></button>`;
    deleteBtnTd.innerHTML = `<button class="btn btn-danger p-1" id="EDIT-${newEngagement.engagementId}" onclick="openModal(${newEngagement.engagementId})"
    data-bs-toggle="modal" data-bs-target="#delete-modal"><i class="bi bi-trash"></button>`;

    tr.appendChild(advisoryName);
    tr.appendChild(clientName);
    tr.appendChild(startDate);
    tr.appendChild(status);
    tr.appendChild(notes);

    tr.appendChild(editBtnTd);
    tr.appendChild(deleteBtnTd);

    tr.setAttribute("id", "TR-" + newEngagement.engagementId);
    let tableBody = document.getElementById("engagements-table-body")
    tableBody.appendChild(tr);

    allEngagements.push({...newEngagement, element: tr});
}

const activateEdit = (engagementId) => {
    window.location.href = `../addEditPages/addEditEngagement.html?id=${engagementId}`;
}

const openModal = (engagementId) => {
    selectedEngagement = allEngagements.find(engagement => engagement.engagementId === engagementId);
    console.log(selectedEngagement);
    const modalBody = document.getElementById("delete-modal-body");
    const fN = selectedEngagement.client.firstName; // assigning to a shorter name here makes the inner text in the backticks
    const lN = selectedEngagement.client.lastName;  // less long
    const advServ = selectedEngagement.advisory.name;  // including email because names can match.
    modalBody.innerText = `Are you sure you want to delete the engagement with the following client and service?

                            ${fN} ${lN} - ${advServ}?`
}

document.getElementById("confirm-delete-btn").addEventListener("click", (eventInfo) => {
    eventInfo.preventDefault();
    deleteEngagement(selectedEngagement.engagementId);
    const modalEl = document.getElementById("delete-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
});

document.getElementById("cancel-delete-btn").addEventListener("click", (eventInfo) => {
    eventInfo.preventDefault();
    const modalEl = document.getElementById("delete-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
});

const deleteEngagement = (engagementId) => {
    console.log(engagementId);
    let tr = document.getElementById(`TR-${engagementId}`);
    tr.remove();

    fetch(URL+`/${engagementId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Delete request failed");
        }
    }).catch( error => {console.error("Error fetching data: ", error)})

    allEngagements.splice(engagementId, 1);
}