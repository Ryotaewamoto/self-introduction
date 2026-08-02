const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);

const formatSingleDate = (value) => {
  const text = String(value).trim();
  const match = text.match(/^(\d{4})(?:[./-](\d{1,2}))?(?:[./-](\d{1,2}))?$/);

  if (!match) return text;

  const [, year, month, day] = match;
  return [
    year,
    month?.padStart(2, "0"),
    day?.padStart(2, "0"),
  ].filter(Boolean).join("/");
};

const formatDate = (value) =>
  String(value)
    .split(/(–|〜|~)/)
    .map((part) => ["–", "〜", "~"].includes(part) ? part : formatSingleDate(part))
    .join("");

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
      <div><dt>Education</dt><dd>${profile.education.map((item) => `${escapeHtml(formatDate(item.period))}　${escapeHtml(item.school)}`).join("<br>")}</dd></div>
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
        <time>${escapeHtml(formatDate(item.date))}</time>
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
          <time>${escapeHtml(formatDate(item.date ?? item.year))}</time>
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
