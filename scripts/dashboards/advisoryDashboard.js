// TODO: finish this and all engagements stuff before 5:00 pm Wednesday
// then do the easy stretch goals   

const URL = "http://localhost:8080/advisories"; // advisory api url
let allAdvisories = [];
let selectedAdvisoryId;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, fetching content");
    fetch(URL, {
        method: "GET"
    }).then( response => {
        if (!response.ok)
            throw new Error("Could not retrieve data");
        return response.json();
    }).then( advisories => {
        advisories.forEach((advisory) => addAdvisoryToTable(advisory));
    }).catch( error => console.error("Error fetching data." + error.stack));

});

const addAdvisoryToTable = (newAdvisory) => {
    // add to JS list and to html table -- make sure we properly handle client and advisory objects
    let tr = document.createElement("tr");

    let name = document.createElement("td");
    let type = document.createElement("td");
    let format = document.createElement("td");
    let annualFee = document.createElement("td");
    let active = document.createElement("td");
    let numClients = document.createElement("td");

    let infoBtnTd = document.createElement("td");
    let editBtnTd = document.createElement("td");   // creates <td> tag for edit button
    let deleteBtnTd = document.createElement("td"); // creates <td> tag for delete button

    console.log(newAdvisory);

    name.innerText = newAdvisory.name;
    type.innerText = mapServTypeFromEnumToText(newAdvisory.serviceType);
    format.innerText = mapDelivFormatFromEnumToText(newAdvisory.deliveryFormat);
    annualFee.innerText = newAdvisory.annualFee;
    active.innerText = mapActiveFromBoolToText(newAdvisory.active);
    numClients.innerText = newAdvisory.numClients;
    
    infoBtnTd.innerHTML = `
    <button class="btn btn-secondary p-1" id="INFO-${newAdvisory.advisoryId}" onclick="activateInfo(${newAdvisory.advisoryId})"><i class="bi bi-search"></i></button>`
    editBtnTd.innerHTML = `
    <button class="btn btn-primary p-1" id="EDIT-${newAdvisory.advisoryId}" onclick="activateEdit(${newAdvisory.advisoryId})"><i class="bi bi-pencil-square"></i></button>
    `;
    deleteBtnTd.innerHTML = `
    <button class="btn btn-danger p-1 delete-btn" id="DELETE-${newAdvisory.advisoryId}" onclick="openModal(${newAdvisory.advisoryId})"
    data-bs-toggle="modal" data-bs-target="#delete-modal"><i class="bi bi-trash"></i></button>
    `;
    
    tr.appendChild(infoBtnTd);

    tr.appendChild(name); 
    tr.appendChild(type); 
    tr.appendChild(format);
    tr.appendChild(annualFee);
    tr.appendChild(active); 
    tr.appendChild(numClients);

    tr.appendChild(editBtnTd);
    tr.appendChild(deleteBtnTd);

    tr.setAttribute("id", "TR-" + newAdvisory.advisoryId);
    let tableBody = document.getElementById("advisory-table-body")
    tableBody.appendChild(tr);
    
    allAdvisories.push({...newAdvisory, element: tr});  
    console.log(allAdvisories);
}

const activateInfo = (advisoryId) => {
    window.location.href = `../detailedViews/advisoryDetailedView.html?id=${advisoryId}`;
}

const activateEdit = (advisoryId) => {
    window.location.href = `../addEditPages/addEditAdvisory.html?id=${advisoryId}`;
}

const openModal = (advisoryId) => {
    selectedAdvisoryId = advisoryId;
    const selectedAdvisory = allAdvisories.find(advisory => advisory.advisoryId === advisoryId);
    const modalBody = document.getElementById("delete-modal-body");
    const name = selectedAdvisory.name; // assigning to a shorter name here makes the inner text in the backticks
    const sT = mapServTypeFromEnumToText(selectedAdvisory.serviceType);  // less long

    modalBody.innerText = `Are you sure you want to delete the advisory with the following name and service type?

                            ${name} - ${sT}?`
}

document.getElementById("confirm-delete-btn").addEventListener("click", (eventInfo) => {
    eventInfo.preventDefault();
    deleteAdvisory(selectedAdvisoryId);
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

const deleteAdvisory = (advisoryId) => {
    let tr = document.getElementById(`TR-${advisoryId}`);
    tr.remove();

    fetch(URL+`/${advisoryId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Delete request failed");
        }
    }).catch( error => {console.error("Error fetching data: ", error)})

    // TODO: I have no idea if this splice works properly
    allAdvisories.splice(advisoryId, 1);
}

const searchInput = document.querySelector("[data-search]");
searchInput.addEventListener("input", (e) => {
    console.log(e);
    const value = e.target.value.toLowerCase();
    allAdvisories.forEach(advisory => {
        const isVisible = advisory.name.toLowerCase().includes(value) || advisory.serviceType.toLowerCase().includes(value) ||
                          advisory.deliveryFormat.toLowerCase().includes(value) || advisory.annualFee.toLowerCase().includes(value) ||
                          advisory.active.toLowerCase().includes(value);
        if (isVisible) {
            advisory.element.style.display = "";
        } else {
            advisory.element.style.display = "none";
        }
        
    })
})

function mapServTypeFromEnumToText(enumString) {
    switch(enumString) {
        case "BUDGETING":               return "Budgeting";
        case "CASH_FLOW_ANALYSIS":      return "Cash Flow Analysis";
        case "DEBT_MANAGEMENT":         return "Debt Management";
        case "ESTATE_PLANNING":         return "Estate Planning";
        case "INVESTMENT_MANAGEMENT":   return "Investment Management";
        case "RETIREMENT_PLANNING":     return "Retirement Planning";
        case "RISK_MNGMENT_INSURANCE":  return "Risk Management and Insurance";
        case "TAX_PLANNING":            return "Tax Planning";
        default:                        return undefined;
    }
}

function mapDelivFormatFromEnumToText(enumString) {
    switch(enumString) {
        case "IN_PERSON":   return "In-Person";
        case "HYBRID":      return "Hybrid";
        case "VIRTUAL":     return "Virtual";
        default:            return undefined;
    }
}

function mapActiveFromBoolToText(active) {
    activeBool = Boolean (active);
    if (activeBool) {
        return "Active"
    } else {
        return "Discontinued"
    }
}