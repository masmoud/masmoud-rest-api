import { Router } from "express";

const router = Router();

// List of API versions
const apiVersions = [{ version: "v1", url: "/api/v1" }];

router.get("/", (req, res) => {
  let html = "<h1>Available API Versions</h1><ul>";
  apiVersions.forEach((v) => {
    html += `<li><a href="${v.url}">${v.version}</a></li>`;
  });
  html += "</ul>";

  res.send(html);
});

export default router;
