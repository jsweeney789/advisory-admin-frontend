const params = new URLSearchParams(window.location.search);
const engagementURLId = params.get("id");
let allClients = [];
let selectedClient;
let allAdvisories = [];
let selectedAdvisory;
let allEngagements = [];

// in the case of getting to this page from the edit button, autofill the form with previous data
if (engagementURLId) {
    // some page stuff so that user knows we are updating instead of creating new while I can still use the same page
    const header = document.getElementById("form-header");
    header.innerText = "Update Engagement:";
    const submitBtn = document.getElementById("engagement-submit-button");
    submitBtn.classList.remove("btn-success");
    submitBtn.classList.add("btn-primary");

    fetch(`http://localhost:8080/engagements/${engagementURLId}`)
        .then(response => response.json())
        .then(engagement => {
            selectedClient = engagement.client;
            selectedAdvisory = engagement.advisory
            document.getElementById("selected-client-display").value = selectedClient.firstName + " " + selectedClient.lastName;
            document.getElementById("selected-advisory-display").value = selectedAdvisory.name;
            document.getElementById("new-start-date").value = engagement.startDate;
            document.getElementById("new-engagement-status").value = engagement.status;
            document.getElementById("new-notes").value = engagement.notes; 
            header.innerText = "Update Engagement Service for:\n\n" + selectedClient.firstName + " " + selectedClient.lastName + " --- " + engagement.advisory.name;
        });
}

document.addEventListener("DOMContentLoaded", () => {
    // 
    fetch("http://localhost:8080/engagements", {
        method: "GET"
    }).then( response => {
        if (!response.ok)
            throw new Error("Could not retrieve data");
        return response.json();
    }).then( engagements => {
        engagements.forEach((engagement) => allEngagements.push(engagement));
        console.log(allEngagements);
    }).catch( error => console.error("Error fetching data." + error.stack));
    
});

document.getElementById("engagement-form").addEventListener("submit", (eventInfo) => {
    eventInfo.preventDefault();

    if (!selectedClient) {
        console.log(selectedClient);
        alert("Please select a client before submitting.");
        return;
    }
    if (!selectedAdvisory) {
        console.log(selectedAdvisory);
        alert("Please select an advisory service before submitting.");
        return;
    }
    let dupeFlag = false;
    allEngagements.forEach(e => {
        if ((e.client.clientId==selectedClient.clientId && e.advisory.advisoryId==selectedAdvisory.advisoryId) && engagementURLId==null) {
            alert("There is already an engagement between that client and advisory, please edit that one in the dashboard.");
            dupeFlag = true;
            return;
        }
    });
    if (dupeFlag) {return};


    let inputData = new FormData(document.getElementById("engagement-form"));
    console.log(inputData);
    const newEngagement = {
        engagementId: engagementURLId,
        client: selectedClient,     // TODO: this stuff will have to be figured out
        advisory: selectedAdvisory,
        startDate: inputData.get("new-start-date"),
        status: inputData.get("new-engagement-status"),
        notes: inputData.get("new-notes")
    }
    console.log(newEngagement);
    
    saveEngagement(newEngagement);
    
});

const saveEngagement = async (newEngagement) => {
    console.log(newEngagement);
    let requestType = "POST";
    let fetchURL = "http://localhost:8080/engagements"
    if (engagementURLId) {
        requestType = "PUT";
        fetchURL += `/${engagementURLId}`;
    }

    const httpResponse = await fetch(fetchURL, {
        method: requestType,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEngagement)
    });

    if (httpResponse.ok) {
        const engagementJson = await httpResponse.json();
        console.log(engagementJson);
        window.location.href = "../dashboards/engagementsView.html"
    } else {
        console.error("Failed to create engagement.");
    }
    
};

const loadClientModal = () => {
    const clientModalEl = document.getElementById("client-modal");
    const clientModal = bootstrap.Modal.getOrCreateInstance(clientModalEl);

    // check if we've already loaded modal before so we don't continue filling table inside of modal
    if (allClients.length != 0) {
        console.log("Modal has already been loaded.");
        clientModal.show();
        return;
    }
    console.log("Loading clients into modal...");
    
    
    const clientUrl = "http://localhost:8080/clients"
    fetch(clientUrl, {
        method: "GET"
    }).then( response => {
        if (!response.ok)
            throw new Error("Could not retrieve data");
        return response.json();
    }).then( clients => {
        clients.forEach((client) => addClientToTable(client));
    }).catch( error => console.error("Error fetching data." + error.stack));

    clientModal.show();
}

const loadAdvisoryModal = () => {
    const advisoryModalEl = document.getElementById("advisory-modal");
    const advisoryModal = bootstrap.Modal.getOrCreateInstance(advisoryModalEl);

    // check if we've already loaded modal before so we don't continue filling table inside of modal
    if (allAdvisories.length != 0) {
        console.log("Modal has already been loaded.");
        advisoryModal.show();
        return;
    }
    console.log("Loading advisories into modal...");


    const advisoryUrl = "http://localhost:8080/advisories"
    fetch(advisoryUrl, {
        method: "GET"
    }).then( response => {
        if (!response.ok)
            throw new Error("Could not retrieve data");
        return response.json();
    }).then( advisories => {
        advisories.forEach((advisory) => addAdvisoryToTable(advisory));
    }).catch( error => console.error("Error fetching data." + error.stack));

    advisoryModal.show();
}

// listen... it's late and I don't have time to learn to reuse these functions on a different table
const addAdvisoryToTable = (newAdvisory) => {
    if (!newAdvisory.active) {
        return; // do not list inactive advisories
    }


    let tr = document.createElement("tr");

    let name = document.createElement("td");
    let type = document.createElement("td");
    // let format = document.createElement("td");
    // let annualFee = document.createElement("td");
    // let active = document.createElement("td");
    let selectBtn = document.createElement("td")

    console.log(newAdvisory);

    name.innerText = newAdvisory.name;
    type.innerText = mapServTypeFromEnumToText(newAdvisory.serviceType);
    // format.innerText = mapDelivFormatFromEnumToText(newAdvisory.deliveryFormat);
    // annualFee.innerText = newAdvisory.annualFee;
    // active.innerText = mapActiveFromBoolToText(newAdvisory.active);
    selectBtn.innerHTML = `
    <button class="btn btn-primary p-1" id="SELECT-${newAdvisory.advisoryId}" onclick="selectAdvisory(${newAdvisory.advisoryId})">Select</button>
    `;


    tr.appendChild(name); 
    tr.appendChild(type); 
    // tr.appendChild(format);
    // tr.appendChild(annualFee);
    // tr.appendChild(active); 
    tr.appendChild(selectBtn);



    tr.setAttribute("id", "TR-" + newAdvisory.advisoryId);
    let tableBody = document.getElementById("advisory-select-table")
    tableBody.appendChild(tr);
    
    allAdvisories.push({...newAdvisory, element: tr});  
    console.log(allAdvisories);
}

const addClientToTable = (newClient) => {
    // add to JS list and to html table -- make sure we properly handle client and advisory objects

    let tr = document.createElement("tr");

    let name = document.createElement("td");
    let email = document.createElement("td");
    let phone = document.createElement("td");
    // let tier = document.createElement("td"); // these aren't great identifiers, I think I'll remove them for now
    // let netWorth = document.createElement("td");
    let selectBtn = document.createElement("td");

    console.log(newClient);

    name.innerText = newClient.firstName + " " + newClient.lastName;
    email.innerText = newClient.email;
    phone.innerText = newClient.phone;
    // tier.innerText = newClient.tier;
    // netWorth.innerText = newClient.estNetWorth;
    selectBtn.innerHTML = `
    <button class="btn btn-primary p-1" id="SELECT-${newClient.clientId}" onclick="selectClient(${newClient.clientId})">Select</button>
    `;
    
    tr.appendChild(name); 
    tr.appendChild(email); 
    tr.appendChild(phone);
    // tr.appendChild(tier);
    // tr.appendChild(netWorth);
    tr.appendChild(selectBtn);

    tr.setAttribute("id", "TR-" + newClient.clientId);
    let tableBody = document.getElementById("client-select-table")
    tableBody.appendChild(tr);
    
    allClients.push({...newClient, element: tr});
    
}

const selectClient = (clientId) => {
    selectedClient = allClients.find(client => client.clientId === clientId);
    const clientTextField = document.getElementById("selected-client-display");
    clientTextField.value = selectedClient.firstName + " " + selectedClient.lastName;

    const modalEl = document.getElementById("client-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

}

const selectAdvisory = (advisoryId) => {
    selectedAdvisory = allAdvisories.find(advisory => advisory.advisoryId === advisoryId);
    const advisoryTextField = document.getElementById("selected-advisory-display");
    advisoryTextField.value = selectedAdvisory.name;

    const modalEl = document.getElementById("advisory-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

}

document.getElementById("cancel-client-btn").addEventListener("click", (eventInfo) => {
    eventInfo.preventDefault();
    const modalEl = document.getElementById("client-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
});
document.getElementById("cancel-advisory-btn").addEventListener("click", (eventInfo) => {
    eventInfo.preventDefault();
    const modalEl = document.getElementById("advisory-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
});

const mapServTypeFromEnumToText = (enumString) => {
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