const params = new URLSearchParams(window.location.search);
const clientURLId = params.get("id");

// some page stuff so that user knows we are updating instead of creating new while I can still use the same page
const header = document.getElementById("page-header");

fetch(`http://localhost:8080/clients/${clientURLId}`)
    .then(response => response.json())
    .then(client => {
        console.log(client);
        document.getElementById("name-holder").innerText = client.firstName + " " + client.lastName;
        document.getElementById("tier-holder").innerText = mapTierFromEnumToText(client.tier);
        document.getElementById("email-holder").innerText = client.email;
        document.getElementById("phone-holder").innerText = client.phone;
        document.getElementById("networth-holder").innerText = mapNetWorthFromEnumToText(client.estNetWorth);
        document.getElementById("obligation-holder").innerText = client.annualFeeObligation;
        document.getElementById("service-count-holder").innerText = client.serviceCount;
        header.innerText = "Info on Client: " + client.firstName + " " + client.lastName;
});

document.addEventListener("DOMContentLoaded", () => {
    // 
    fetch(`http://localhost:8080/clients/${clientURLId}/engagements`, {
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
    // add to JS list and to html table -- make sure we properly handle client and advisory objects
    console.log("made it here");
    console.log(engagement);
    let tr = document.createElement("tr");

    let advisoryName = document.createElement("td");
    let startDate = document.createElement("td");
    let status = document.createElement("td");
    let annualFee = document.createElement("td");

    advisoryName.innerText = engagement.advisoryName;
    startDate.innerText = engagement.startDate;
    status.innerText = engagement.status;
    annualFee.innerText = "$"+engagement.annualFee;

    tr.appendChild(advisoryName);
    tr.appendChild(startDate);
    tr.appendChild(status);
    tr.appendChild(annualFee);


    tr.setAttribute("id", "TR-" + engagement.engagementId);
    let tableBody = document.getElementById("client-engagement-table-body")
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
