import { mkdirSync, writeFileSync } from "node:fs";

const username = "goshkaaaa";
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "goshkaaaa-profile",
};
if (process.env.GITHUB_TOKEN)
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
async function request(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok)
    throw new Error(`GitHub returned ${response.status} for ${path}`);
  return response.json();
}

const repositories = [];
for (let page = 1; ; page++) {
  const batch = await request(
    `/users/${username}/repos?per_page=100&page=${page}`,
  );
  repositories.push(...batch);
  if (batch.length < 100) break;
}
const owned = repositories.filter((repository) => !repository.fork);
const stars = owned.reduce(
  (sum, repository) => sum + repository.stargazers_count,
  0,
);
const languages = new Map();
await Promise.all(
  owned
    .filter((repository) => repository.size > 0)
    .map(async (repository) => {
      const data = await request(
        `/repos/${username}/${repository.name}/languages`,
      );
      for (const [name, bytes] of Object.entries(data))
        languages.set(name, (languages.get(name) || 0) + bytes);
    }),
);
const top = [...languages].sort((a, b) => b[1] - a[1]).slice(0, 4);
const total = top.reduce((sum, [, bytes]) => sum + bytes, 0) || 1;
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const palette = ["#f8ce6a", "#7aabe0", "#9ac4a0", "#ca9ac4"];
let offset = 0;
const segments = top
  .map(([name, bytes], index) => {
    const width = (bytes / total) * 490;
    const svg = `<rect x="${590 + offset}" y="98" width="${width}" height="13" fill="${palette[index]}"/><circle cx="${596 + (index % 2) * 245}" cy="${144 + Math.floor(index / 2) * 28}" r="4" fill="${palette[index]}"/><text x="${610 + (index % 2) * 245}" y="${149 + Math.floor(index / 2) * 28}" font-size="12" fill="#bccddd">${escape(name)} ${((bytes / total) * 100).toFixed(1)}%</text>`;
    offset += width;
    return svg;
  })
  .join("");
const updated = new Date().toISOString().slice(0, 10);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="230" viewBox="0 0 1200 230" role="img" aria-labelledby="title"><title id="title">Public GitHub repositories: ${owned.length}. Stars: ${stars}. Source language distribution. Updated ${updated}.</title><rect width="1200" height="230" rx="14" fill="#142130"/><g font-family="Verdana,sans-serif"><text x="40" y="40" font-size="11" letter-spacing="2" fill="#a9bdd2">ON GITHUB</text><text x="40" y="118" font-size="54" fill="#f4f6fa">${owned.length}</text><text x="40" y="148" font-size="12" fill="#bccddd">public repositories</text><text x="275" y="118" font-size="54" fill="#f4f6fa">${stars}</text><text x="275" y="148" font-size="12" fill="#bccddd">stars across my projects</text><path d="M530 65v110" stroke="#334254"/><text x="590" y="77" font-size="11" letter-spacing="2" fill="#a9bdd2">TOP LANGUAGES / BY SOURCE BYTES</text>${segments}<text x="40" y="202" font-size="10" fill="#a9bdd2">Public, non-fork repositories. Four largest languages shown. Updated ${updated} UTC.</text></g></svg>`;
mkdirSync("assets", { recursive: true });
writeFileSync("assets/metrics.svg", svg);
writeFileSync(
  "assets/metrics.json",
  `${JSON.stringify({ updated, repositories: owned.length, stars, languages: Object.fromEntries(top) }, null, 2)}\n`,
);
console.log(`Updated metrics for ${owned.length} public repositories.`);
