const params = new URLSearchParams(window.location.search);
const clientId = params.get("id");

// in the case of getting to this page from the edit button, autofill the form with previous data
if (clientId) {
    // some page stuff so that user knows we are updating instead of creating new while I can still use the same page
    const header = document.getElementById("form-header");
    header.innerText = "Update Client";
    const submitBtn = document.getElementById("client-submit-button");
    submitBtn.classList.remove("btn-success");
    submitBtn.classList.add("btn-primary");

    fetch(`/api/clients/${clientId}`)
        .then(response => response.json())
        .then(client => {
            document.getElementById("new-client-first").value = client.firstName;
            document.getElementById("new-client-last").value = client.lastName;
            document.getElementById("new-client-email").value = client.email;
            document.getElementById("new-client-phone").value = client.phone;
            document.getElementById("new-client-tier").value = client.tier;
            document.getElementById("new-net-worth").value = client.estNetWorth;
        });
}

document.getElementById("client-form").addEventListener("submit", (eventInfo) => {
    eventInfo.preventDefault();

    let inputData = new FormData(document.getElementById("client-form"));
    const newClient = {
        firstName: inputData.get("new-client-first"),
        lastName: inputData.get("new-client-last"),
        email: inputData.get("new-client-email"),
        phone: inputData.get("new-client-phone"),
        tier: inputData.get("new-client-tier"),
        estNetWorth: inputData.get("new-net-worth"),
    }
    console.log(newClient);  
    
    saveClient(newClient);
    
});

const saveClient = async (newClient) => {
    let requestType = "POST";
    let fetchURL = "http://localhost:8080/clients"
    if (clientId) {
        requestType = "PUT";
        fetchURL += `/${clientId}`;
    }

    const httpResponse = await fetch(fetchURL, {
        method: requestType,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newClient)
    });

    if (httpResponse.ok) {
        const clientJson = await httpResponse.json();
        console.log(clientJson);
        window.location.href = "../dashboards/clientView.html"
    } else {
        console.error("Failed to create client.");
    }
    
    
};
