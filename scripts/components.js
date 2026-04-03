// source https://medium.com/front-end-weekly/how-to-build-reusable-html-components-without-component-based-frameworks-2f7747f4c5db
class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<nav class="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Advisory Admin</a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="engagementView.html">Home</a> <!-- need to add links to other pages/dashboards -->
        </li>
        <li class="nav-item">
          <a class="nav-link" href="clientView.html">Clients</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="advisoryView.html">Advisories</a>
        </li>
      </ul>
  </div>
</nav>
    `;
  }
}
customElements.define('main-header', Header);

// TODO: note that as we copy/pasted the forms, the sizes of each box and the text of each label are terrible for our site. All of them need fixing

class EngagementForm extends HTMLElement {
  // TODO: this one is the most complicated, as we need to figure out a way to link to already existing advisories and clients OR
  // create new ones to go with the engagement, will do last
    connectedCallback() {
    this.innerHTML = `
<form id="new-engagement-form" action="#">  <!-- forms naturally try to redirect you, so use # action to prevent. Or give it a page to redirect you to -->

  <h3 class="h3 p-1 text-light">New Advisory Service</h3>

  <div class="row mb-3">

      <div class="col-6">

          <div class="mx-1"> <!-- TODO: figure out way to retrieve client or add new one -->
              <label for="new-client-name" class="form-label text-light">Client Name</label>
              <input type="text" class="form-control" id="new-client-name" name="new-client-name" placeholder="John Smith">
          </div>
      </div>
      <div class="col-4">

          <div class="mx-1"> <!-- TODO: figure out way to retrieve advisory or add new one -->
              <label for="new-advisory-name" class="form-label text-light">Advisory Service Name</label>
              <input type="text" class="form-control" id="new-advisory-name" name="new-advisory-name" placeholder="Business Advisory Service">
          </div>
      </div>
      <div class="col-2">

          <div class="mx-1"> 
              <label for="new-start-date" class="form-label text-light">Engagement Start Date</label>
              <input type="text" class="form-control" id="new-start-date" name="new-start-date" placeholder="mm/dd/yyyy">
          </div>
      </div>
  </div>
  <div class="row mb-3">
      <div class="col-2">

          <div class="mx-1">
              <label for="new-engagement-status" class="form-label text-light">Engagement Status</label>
              <select id="new-engagement-status" class="form-select" name="new-engagement-status" aria-label="Engagement Status Form Select">
                  <option selected>Select Status</option>
                  <option value="ACTIVE">Active</option> 
                  <option value="PAUSED">Paused</option>
                  <option value="COMPLETED">Completed</option>
              </select>
          </div>
      </div>
      <div class="col">
          
          <div class="mx-1"> 
              <label for="new-notes" class="form-label text-light">Notes</label>
              <input type="text" class="form-control" id="new-notes" name="new-notes" placeholder="Any extra info here...">
          </div>
      </div>
      
  </div>
  <div class="row">
      <div class="col justify-content-right">
          <button type="submit" class="btn btn-success mx-1">Submit</button>
      </div>
  </div>
</form>
    `;
  }
  
}
class AdvisoryForm extends HTMLElement { // TODO: think about ways to add service type enum if necessary
    connectedCallback() {
    this.innerHTML = `
<form id="new-advisory-form" action="#">  <!-- forms naturally try to redirect you, so use # action to prevent. Or give it a page to redirect you to -->

  <h3 class="h3 p-1 text-light">New Advisory Service</h3>

  <div class="row mb-3">

      <div class="col-6">

          <div class="mx-1"> 
              <label for="new-advisory-name" class="form-label text-light">Advisory Service Name</label>
              <input type="text" class="form-control" id="new-advisory-name" name="new-advisory-name" placeholder="Business Advisory Service">
          </div>
      </div>
      <div class="col-4">

          <div class="mx-1">
              <label for="new-service-type" class="form-label text-light">Service Type</label>
              <select id="new-service-type" class="form-select" name="new-service-type" aria-label="Service Type Form Select">
                  <option selected>Select Service</option>
                  <option value="ACTION">Action</option> <!-- TODO: fully fill out and set up the enums for this -->
                  <option value="ROMANCE">Romance</option>
                  <option value="THRILLER">Thriller</option>
                  <option value="SCIENCE_FICTION">Sci-Fi</option>
                  <option value="COMEDY">Comedy</option>
              </select>
          </div>
      </div>
      <div class="col-2">

          <div class="mx-1">
              <label for="new-delivery-format" class="form-label text-light">Delivery Format</label>
              <select id="new-delivery-format" class="form-select" name="new-delivery-format" aria-label="Delivery Format Form Select">
                  <option selected>Select Format</option>
                  <option value="ACTION">Action</option> <!-- TODO: fully fill out and set up the enums for this -->
                  <option value="ROMANCE">Romance</option>
                  <option value="THRILLER">Thriller</option>
                  <option value="SCIENCE_FICTION">Sci-Fi</option>
                  <option value="COMEDY">Comedy</option>
              </select>
          </div>
      </div>
  </div>
  <div class="row mb-3">
      <div class="col">
          
          <div class="mx-1"> 
              <label for="new-active-status" class="form-label text-light">Active?</label> <!-- TODO: make this make sense for booleans -->
              <input type="text" class="form-control" id="new-active-status" name="new-active-status" placeholder="Yes">
          </div>
      </div>
      <div class="col">
          
          <div class="mx-1"> 
              <label for="new-annual-fee" class="form-label text-light">Annual Fee</label>
              <input type="text" class="form-control" id="new-annual-fee" name="new-annual-fee" placeholder="$500">
          </div>
      </div>
      
  </div>
  <div class="row">
      <div class="col justify-content-right">
          <button type="submit" class="btn btn-success mx-1">Submit</button>
      </div>
  </div>
</form>
    `;
  }
}
class ClientForm extends HTMLElement { // TODO: make forms less disgusting and ugly
  connectedCallback() {
    this.innerHTML = `
<form id="new-client-form" action="#">  <!-- forms naturally try to redirect you, so use # action to prevent. Or give it a page to redirect you to -->

  <h3 class="h3 p-1 text-light">New Advisory Service</h3>

  <div class="row mb-3">

      <div class="col-2">

          <div class="mx-1"> 
              <label for="new-client-first" class="form-label text-light">Client First Name</label>
              <input type="text" class="form-control" id="new-client-first" name="new-client-first" placeholder="John">
          </div>
      </div>
      <div class="col-2">

          <div class="mx-1"> 
              <label for="new-client-last" class="form-label text-light">Client Last Name</label>
              <input type="text" class="form-control" id="new-client-last" name="new-client-last" placeholder="Smith">
          </div>
      </div>
      <div class="col-2">

        <div class="mx-1"> 
            <label for="new-client-phone" class="form-label text-light">Client Phone #</label>
            <input type="text" class="form-control" id="new-client-phone" name="new-client-phone" placeholder="1-999-999-9999">
        </div>
          
      </div>

      <div class="col-2">

        <div class="mx-1"> 
            <label for="new-client-email" class="form-label text-light">Client Email</label>
            <input type="text" class="form-control" id="new-client-email" name="new-client-email" placeholder="jsmith@example.com">
        </div>
          
      </div>
  </div>
  <div class="row mb-3">
      <div class="col">
          
          <div class="mx-1">
              <label for="new-client-tier" class="form-label text-light">Client Tier</label>
              <select id="new-client-tier" class="form-select" name="new-client-tier" aria-label="Tier Select">
                  <option selected>Select Tier</option>
                  <option value="STANDARD">Standard</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="PRIVATE_BANKING">Private Banking</option>
              </select>
      </div>
      <div class="col">
          
          <div class="mx-1">
              <label for="new-net-worth" class="form-label text-light">Delivery Format</label>
              <select id="new-net-worth" class="form-select" name="new-net-worth" aria-label="Net Worth Form Select">
                  <option selected>Select Range of Net Worth</option>
                  <option value="STANDARD">Action</option> <!-- TODO: fully fill out and set up the enums for this -->
                  <option value="ROMANCE">Romance</option>
                  <option value="THRILLER">Thriller</option>
                  <option value="SCIENCE_FICTION">Sci-Fi</option>
                  <option value="COMEDY">Comedy</option>
              </select>
      </div>
      
  </div>
  <div class="row">
      <div class="col justify-content-right">
          <button type="submit" class="btn btn-success mx-1">Submit</button>
      </div>
  </div>
</form>
    `;
  }
}

customElements.define('engagement-form', EngagementForm);
customElements.define('advisory-form', AdvisoryForm);
customElements.define('client-form', ClientForm);