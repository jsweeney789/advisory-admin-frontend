// source https://medium.com/front-end-weekly/how-to-build-reusable-html-components-without-component-based-frameworks-2f7747f4c5db
class Header extends HTMLElement {
  connectedCallback() { // TODO: THIS IS FUCKING BROKEN
    this.innerHTML = `
<nav class="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/pages/dashboards/engagementsView.html">Advisory Admin</a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="/pages/dashboards/engagementsView.html">Engagements</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/dashboards/clientView.html">Clients</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/dashboards/advisoryView.html">Advisories</a>
        </li>
      </ul>
  </div>
</nav>
    `;
  }
}
customElements.define('main-header', Header);



