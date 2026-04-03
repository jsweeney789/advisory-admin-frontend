const URL = "http://localhost:8080/engagements"; // engagements url
let allEngagements = [];
let selectedEngagement;

// load all engagements on loading page, should probably organize it via advisory service
document.addEventListener("DOMContentLoaded", () => {
    // 
    fetch(URL, {
        method: "GET"
    }).then( response => {
        if (!response.ok)
            throw new Error("Could not retrieve data");
        return response;
    }).then( engagements => {
        engagements.forEach((engagement) => addEngagementToTable(engagement));
    }).catch( error => console.error("Error fetching data."));

});

const addEngagementToTable = (newEngagement) => {
    // add to JS list and to html table -- make sure we properly handle client and advisory objects

    let tr = document.createElement("tr"); // TODO: set up some kind of engagement name system, probably client-advisory by default and can be renamed

    let advisoryName = document.createElement("td");
    let clientName = document.createElement("td");
    let startDate = document.createElement("td");
    let status = document.createElement("td");
    let notes = document.createElement("td");

    advisoryName.innerText = newEngagement.advisory.advisoryName;
    clientName.innerText = newEngagement.client.firstName + " " + newEngagement.client.lastName;
    startDate.innerText = newEngagement.startDate;
    status.innerText = newEngagement.status;
    notes.innerText = newEngagement.notes;

    // I think it's worth copying the edit/delete buttons from class. Edit will be a form and delete will bring up a toast pop-up to delete the row
    editBtnTd.innerHTML = `<button class="btn btn-primary p-1" id="EDIT-${newMovie.id}" onclick="activateEditForm(${newMovie.id})">Edit</button>`;
    deleteBtnTd.innerHTML = `<button class="btn btn-danger p-1" id="EDIT-${newMovie.id}" onclick="activateDeletePopUp(${newMovie.id})">Delete</button>`;

    tr.appendChild(advisoryName);
    tr.appendChild(clientName);
    tr.appendChild(startDate);
    tr.appendChild(status);
    tr.appendChild(notes);

    tr.appendChild(editBtnTd);
    tr.appendChild(deleteBtnTd);
    let tableBody = document.getElementById("engagements-table-body")
    tableBody.appendChild(tr);

    allEngagements.push(newEngagement);
}