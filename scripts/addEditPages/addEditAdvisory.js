const params = new URLSearchParams(window.location.search);
const advisoryURLId = params.get("id");

// in the case of getting to this page from the edit button, autofill the form with previous data
if (advisoryURLId) {
    // some page stuff so that user knows we are updating instead of creating new while I can still use the same page
    const header = document.getElementById("form-header");
    header.innerText = "Update Advisory:";
    const submitBtn = document.getElementById("advisory-submit-button");
    submitBtn.classList.remove("btn-success");
    submitBtn.classList.add("btn-primary");

    fetch(`http://localhost:8080/advisories/${advisoryURLId}`)
        .then(response => response.json())
        .then(advisory => {
            document.getElementById("new-advisory-name").value = advisory.name;
            document.getElementById("new-service-type").value = advisory.serviceType;
            document.getElementById("new-delivery-format").value = advisory.deliveryFormat;
            document.getElementById("new-annual-fee").value = advisory.annualFee;
            document.getElementById("isActive-checkbox").checked = advisory.isActive;
            header.innerText = "Update Advisory Service: " + advisory.name;
        });
}

document.getElementById("advisory-form").addEventListener("submit", (eventInfo) => {
    eventInfo.preventDefault();

    // I ruined everything by adding a checkbox so I'm just explicitly checking it here, formdata didn't work when I tried for some reason
    let checked = document.getElementById("isActive-checkbox").checked;

    let inputData = new FormData(document.getElementById("advisory-form"));
    console.log(inputData);
    const newAdvisory = {
        advisoryId: advisoryURLId,
        name: inputData.get("new-advisory-name"),
        serviceType: inputData.get("new-service-type"),
        deliveryFormat: inputData.get("new-delivery-format"),
        annualFee: inputData.get("new-annual-fee"),
        active: checked
    }
    console.log(newAdvisory);
    
    saveAdvisory(newAdvisory);
    
});

const saveAdvisory = async (newAdvisory) => {
    console.log(newAdvisory);
    let requestType = "POST";
    let fetchURL = "http://localhost:8080/advisories"
    if (advisoryURLId) {
        requestType = "PUT";
        fetchURL += `/${advisoryURLId}`;
    }

    const httpResponse = await fetch(fetchURL, {
        method: requestType,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newAdvisory)
    });

    if (httpResponse.ok) {
        const advisoryJson = await httpResponse.json();
        console.log(advisoryJson);
        window.location.href = "../dashboards/advisoryView.html"
    } else {
        console.error("Failed to create advisory service.");
    }
    
    
};
