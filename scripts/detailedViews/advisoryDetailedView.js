const params = new URLSearchParams(window.location.search);
const advisoryUrlId = params.get("id");

// some page stuff so that user knows we are updating instead of creating new while I can still use the same page
const header = document.getElementById("page-header");

fetch(`http://localhost:8080/advisories/${advisoryUrlId}`)
    .then(response => response.json())
    .then(advisory => {
        console.log(advisory);
        document.getElementById("name-holder").innerText = advisory.name;
        document.getElementById("service-type-holder").innerText = mapServTypeFromEnumToText(advisory.serviceType);
        document.getElementById("format-holder").innerText = mapDelivFormatFromEnumToText(advisory.deliveryFormat);
        document.getElementById("fee-holder").innerText = advisory.annualFee;
        document.getElementById("status-holder").innerText = mapActiveFromBoolToText(advisory.active);
        document.getElementById("client-count-holder").innerText = advisory.numClients+" clients";
        header.innerText = "Info on Advisory: " + advisory.name + " --- " + mapServTypeFromEnumToText(advisory.serviceType);
});

document.addEventListener("DOMContentLoaded", () => {
    // 
    fetch(`http://localhost:8080/advisories/${advisoryUrlId}/engagements`, {
        method: "GET"
    }).then( response => {
        if (!response.ok)
            throw new Error("Could not retrieve data");
        return response.json();
    }).then( engagements => {
        engagements.forEach((engagement) => addEngagementToTable(engagement));
    }).catch( error => console.error("Error fetching data." + error.stack));

});

const addEngagementToTable = (engagement) => {
    console.log(engagement);

    let tr = document.createElement("tr");

    let name = document.createElement("td");
    let email = document.createElement("td");
    let phone = document.createElement("td");
    let tier = document.createElement("td");

    name.innerText = engagement.clientFirst + " " + engagement.clientLast;
    email.innerText = engagement.clientEmail;
    phone.innerText = engagement.clientPhone;
    tier.innerText = mapTierFromEnumToText(engagement.clientTier);

    tr.appendChild(name); 
    tr.appendChild(email); 
    tr.appendChild(phone);
    tr.appendChild(tier);

    tr.setAttribute("id", "TR-" + engagement.engagementId);
    let tableBody = document.getElementById("advisory-client-table-body");
    tableBody.appendChild(tr);
}


function mapNetWorthFromEnumToText(enumString) {
    switch(enumString) {
        case "UNDER_500K":       return "<$500k>";
        case "BETWEEN_500K_2M":  return "$500k-$2M";
        case "BETWEEN_2M_10M":   return "$2M-$10M";
        case "OVER_10M":         return "$10M+";
        default:                        return undefined;
    }
}

function mapTierFromEnumToText(enumString) {
    switch(enumString) {
        case "STANDARD":          return "Standard";
        case "PREMIUM":           return "Premium";
        case "PRIVATE_BANKING":   return "Private Banking";
        default:                        return undefined;
    }
}

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