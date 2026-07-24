const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);

const type = document.body.dataset.list;
const content = document.querySelector("#content");
const items = window.pageItems || [];

if (type === "profile") {
  const profile = window.profileData;
  document.querySelector("#profile-content").innerHTML = `
    <dl class="profile-list">
      <div><dt>Name</dt><dd>${escapeHtml(profile.name)}（${escapeHtml(profile.nameJa)}）</dd></div>
      <div><dt>Affiliation</dt><dd>${escapeHtml(profile.affiliation)}</dd></div>
      <div><dt>Degrees</dt><dd>${profile.degrees.map(escapeHtml).join("<br>")}</dd></div>
      <div><dt>Education</dt><dd>${profile.education.map((item) => `${escapeHtml(item.period)}　${escapeHtml(item.school)}`).join("<br>")}</dd></div>
    </dl>
    <p class="links">
      <a href="https://github.com/Ryotaewamoto">GitHub</a>
      <a href="${escapeHtml(profile.researchmap)}">researchmap</a>
    </p>
  `;
} else if (content) {
  if (type === "notes") {
    content.innerHTML = items.map((item) => `
      <article>
        <time>${escapeHtml(item.date)}</time>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("") || '<p class="empty">準備中</p>';
  } else {
    content.innerHTML = items.map((item) => {
      const url = type === "study" ? item.file : item.url;
      const title = url
        ? `<a href="${escapeHtml(url)}">${escapeHtml(item.title)}</a>`
        : escapeHtml(item.title);
      return `
        <article>
          <time>${escapeHtml(item.year)}</time>
          <div>
            <h2>${title}</h2>
            ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
          </div>
        </article>
      `;
    }).join("") || '<p class="empty">準備中</p>';
  }
}

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelector(".year").textContent = new Date().getFullYear();
