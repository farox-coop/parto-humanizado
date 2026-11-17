import { defineConfig, devices } from '@playwright/test';
const port=process.env.TEST_PORT || '4173';
export default defineConfig({testDir:'./tests/e2e',workers:1,timeout:30000,use:{baseURL:`http://127.0.0.1:${port}`},webServer:process.env.TEST_PORT?undefined:{command:`python3 -m http.server ${port} --bind 127.0.0.1 --directory out`,url:`http://127.0.0.1:${port}`,reuseExistingServer:true,timeout:30000},projects:[{name:'chromium',use:{...devices['Desktop Chrome']}},{name:'firefox',use:{...devices['Desktop Firefox']}},{name:'webkit',use:{...devices['Desktop Safari']}}]});
