const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const createApp = require("../src/app");

const request = async (app, method, path, body) => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return { status: response.status, data };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

describe("health endpoint", () => {
  it("returns API status", async () => {
    const app = createApp();
    const result = await request(app, "GET", "/api/v1/health");

    assert.equal(result.status, 200);
    assert.equal(result.data.success, true);
    assert.equal(result.data.message, "API is running");
  });
});
