import { test as setup } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  await page.evaluate(() => {
    localStorage.setItem("access_token", "mock-access-token");
    localStorage.setItem("refresh_token", "mock-refresh-token");
  });

  await page.goto("/prompts");
  await page.context().storageState({ path: authFile });
});
