/**
 * This will be the first dashboard (and set of related pages) we finish in detail even though we've started drafting on the others
 * Order of operations:
 *   ***1. Implement getAll functionality so that table can display example data
 *      2. Create some example data
 *      3. Implement getClient functionality and work on detailedClientView so we can view one object
 *      4. create some related advisory data and engagements so we can display the engagements related to the single client
 *          - make detailed client view and all its data look nice
 *      *** note this is R of CRUD done
 *      5. Implement addNewClient functionality which means setting up addNewClient page
 *      6. Implement editClient functionality - hopefully we can reuse most of addNewClient page
 *      7. Refactor forms and make everything look nice - this is C and U of CRUD done
 *      8. Implement deleteClient functionality with button in row
 *      9. This requires some kind of pop-up or 2-button decision tree for confirmation - could use toast or modulars or whatever
 *      10. Repeat process for advisory and engagements
 */

const URL = "http://localhost:8080/clients"; // clients url
let allClients = [];
let selectedClientId;

// load all clients on loading page, should probably organize alphabetically by client last,first
document.addEventListener("DOMContentLoaded", () => {
    // 
    fetch(URL, {
        method: "GET"
    }).then( response => {
        if (!response.ok)
            throw new Error("Could not retrieve data");
        return response;
    }).then( clients => {
        clients.forEach((client) => addClientToTable(client));
    }).catch( error => console.error("Error fetching data."));

});

const addClientToTable = (newClient) => {
    // add to JS list and to html table -- make sure we properly handle client and advisory objects

    let tr = document.createElement("tr");

    let name = document.createElement("td");
    let email = document.createElement("td");
    let phone = document.createElement("td");
    let tier = document.createElement("td");
    let netWorth = document.createElement("td");

    name.innerText = newClient.firstName + " " + newClient.lastName;
    email.innerText = newClient.email;
    phone.innerText = newClient.phone;
    tier.innerText = newClient.tier;
    netWorth = newClient.estNetWorth;

    editBtnTd.innerHTML = `
    <button class="btn btn-primary p-1" id="EDIT-${newClient.clientId}" onclick="activateEdit(${newClient.clientId})">Edit</button>
    `;
    deleteBtnTd.innerHTML = `
    <button class="btn btn-danger p-1 delete-btn" id="DELETE-${newClient.clientId}" onclick="activateDeletePopUp(${newClient.clientId})">Delete</button>
    `;

    tr.appendChild(name);
    tr.appendChild(email);
    tr.appendChild(phone);
    tr.appendChild(tier);
    tr.appendChild(netWorth);

    tr.appendChild(editBtnTd);
    tr.appendChild(deleteBtnTd);

    tr.setAttribute("id", "TR-" + newClient.id);
    let tableBody = document.getElementById("clients-table-body")
    tableBody.appendChild(tr);

    allClients.push({...newClient, element: tr});
}

const activeEdit = (clientId) => {
    window.location.href = `/../addEditPages/addEditClient.html/${clientId}`;
}


const activateDeletePopUp = (clientId) => {
    selectedClientId = clientId;
    new bootstrap.Modal(document.getElementById("delete-modal"));
}

document.getElementById("confirm-delete-btn").addEventListener("click", (eventInfo) => {
    eventInfo.preventDefault();
    deleteClient(selectedClientId);
})

const deleteClient = (clientId) => {
    let tr = document.getElementById(`TR-${clientId}`);
    tr.remove();

    fetch(URL+`/${clientId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Delete request failed");
        }
    }).catch( error => {console.error("Error fetching data: ", error)})

    allClients.splice(clientId, 1);
}