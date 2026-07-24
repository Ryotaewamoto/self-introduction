const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);

const lists = { cv, publications, talks, works, pdfs, notes };
const type = document.body.dataset.list;
const content = document.querySelector("#content");

if (content && type) {
  const items = lists[type] || [];

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
      const url = type === "pdfs" ? item.file : item.url;
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
