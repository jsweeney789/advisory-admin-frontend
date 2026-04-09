/**
 * This will be the first dashboard (and set of related pages) we finish in detail even though we've started drafting on the others
 * Order of operations:
 *   *X*1. Implement getAll functionality so that table can display example data
 *      2. Create some example data
 *      3. Implement getClient functionality and work on detailedClientView so we can view one object
 *      4. create some related advisory data and engagements so we can display the engagements related to the single client
 *          - make detailed client view and all its data look nice
 *      *** note this is R of CRUD done
 *   *X*5. Implement addNewClient functionality which means setting up addNewClient page
 *   *X*6. Implement editClient functionality - hopefully we can reuse most of addNewClient page
 *   *X*7. Refactor forms and make everything look nice - this is C and U of CRUD done
 *   *X*8. Implement deleteClient functionality with button in row
 *   *X*9. This requires some kind of pop-up or 2-button decision tree for confirmation - could use toast or modulars or whatever
 *      10. Repeat process for advisory and engagements
 */

const URL = "http://localhost:8080/clients"; // clients api url
let allClients = [];
let selectedClientId;
// load all clients on loading page, should probably organize alphabetically by client last,first
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, fetching content");
    fetch(URL, {
        method: "GET"
    }).then( response => {
        if (!response.ok)
            throw new Error("Could not retrieve data");
        return response.json();
    }).then( clients => {
        clients.forEach((client) => addClientToTable(client));
    }).catch( error => console.error("Error fetching data." + error.stack));

});

const addClientToTable = (newClient) => {
    // add to JS list and to html table -- make sure we properly handle client and advisory objects

    let tr = document.createElement("tr");

    let name = document.createElement("td");
    let email = document.createElement("td");
    let phone = document.createElement("td");
    let tier = document.createElement("td");
    let netWorth = document.createElement("td");
    let annualFeeObligation = document.createElement("td");

    let editBtnTd = document.createElement("td");   // creates <td> tag for edit button
    let deleteBtnTd = document.createElement("td"); // creates <td> tag for delete button

    console.log(newClient);

    name.innerText = newClient.firstName + " " + newClient.lastName;
    email.innerText = newClient.email;
    phone.innerText = newClient.phone;
    tier.innerText = mapTierFromEnumToText(newClient.tier);
    netWorth.innerText = mapNetWorthFromEnumToText(newClient.estNetWorth);
    annualFeeObligation.innerText = "$" + newClient.annualFeeObligation

    editBtnTd.innerHTML = `
    <button class="btn btn-primary p-1" id="EDIT-${newClient.clientId}" onclick="activateEdit(${newClient.clientId})">Edit</button>
    `;
    deleteBtnTd.innerHTML = `
    <button class="btn btn-danger p-1 delete-btn" id="DELETE-${newClient.clientId}" onclick="openModal(${newClient.clientId})"
    data-bs-toggle="modal" data-bs-target="#delete-modal">Delete</button>
    `;
    
    tr.appendChild(name); 
    tr.appendChild(email); 
    tr.appendChild(phone);
    tr.appendChild(tier);
    tr.appendChild(netWorth); 
    tr.appendChild(annualFeeObligation);

    tr.appendChild(editBtnTd);
    tr.appendChild(deleteBtnTd);

    tr.setAttribute("id", "TR-" + newClient.clientId);
    let tableBody = document.getElementById("clients-table-body")
    tableBody.appendChild(tr);
    
    allClients.push({...newClient, element: tr});
    
}

const activateEdit = (clientId) => {
    window.location.href = `../addEditPages/addEditClient.html?id=${clientId}`;
}

const openModal = (clientId) => {
    selectedClientId = clientId;
    const selectedClient = allClients.find(client => client.clientId === clientId);
    const modalBody = document.getElementById("delete-modal-body");
    const fN = selectedClient.firstName; // assigning to a shorter name here makes the inner text in the backticks
    const lN = selectedClient.lastName;  // less long
    const email = selectedClient.email;  // including email because names can match.
    modalBody.innerText = `Are you sure you want to delete the client with the following name and email?

                            ${fN} ${lN} ${email}?`
}

document.getElementById("confirm-delete-btn").addEventListener("click", (eventInfo) => {
    eventInfo.preventDefault();
    deleteClient(selectedClientId);
    // this was not easy to find https://getbootstrap.com/docs/4.0/components/modal/#via-javascript
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
// copying from video I found
const searchInput = document.querySelector("[data-search]");
searchInput.addEventListener("input", (e) => {
    console.log(allClients);
    console.log(e);
    const value = e.target.value.toLowerCase();
    allClients.forEach(client => {
        const fullName = client.firstName + " " + client.lastName;
        const isVisible = client.firstName.toLowerCase().includes(value) || client.lastName.toLowerCase().includes(value) ||
                          client.email.toLowerCase().includes(value) || client.phone.toLowerCase().includes(value) ||
                          client.estNetWorth.toLowerCase().includes(value) || client.tier.toLowerCase().includes(value) ||
                          fullName.toLowerCase().includes(value);
        if (isVisible) {
            client.element.style.display = "";
        } else {
            client.element.style.display = "none";
        }
        
    })
})

const mapNetWorthFromEnumToText = (enumString) => {
    switch(enumString) {
        case "UNDER_500K":       return "<$500k>";
        case "BETWEEN_500K_2M":  return "$500k-$2M";
        case "BETWEEN_2M_10M":   return "$2M-$10M";
        case "OVER_10M":         return "$10M+";
        default:                        return undefined;
    }
}

const mapTierFromEnumToText = (enumString) => {
    switch(enumString) {
        case "STANDARD":          return "Standard";
        case "PREMIUM":           return "Premium";
        case "PRIVATE_BANKING":   return "Private Banking";
        default:                        return undefined;
    }
}