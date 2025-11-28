import { test, expect, FrameLocator } from '@playwright/test';
process.loadEnvFile('.env');

const data = {
  url: process.env.ROUTER_URL,
  username: process.env.ROUTER_USERNAME,
  password: process.env.ROUTER_PASSWORD
};

const deviceType = "line"; // ['wifi', 'line']
const filters = {
  name: 'poco',
  status: 'offline'
};

const selectors = {
  wifi: {
    devSelector: "#wifinumspan",
    devContent: "Wi-Fi devices",
    devIconSelector: "#wifidevIcon"
  },
  line: {
    devSelector: "#linenumspan",
    devContent: "Wired devices",
    devIconSelector: "#linedevIcon"
  }
}

test.describe.configure({ mode: 'serial' });

test.describe('Get device by filters', () => {

  const devSelector = selectors[deviceType].devSelector;
  const devContent = selectors[deviceType].devContent;
  const devIconSelector = selectors[deviceType].devIconSelector;
  let iframeMenu: FrameLocator;

  test.beforeEach('Login to router web page', async ({ page }) => {
    if (data.url === undefined || !data.username || data.password === undefined) {
      throw new Error(`Some properties of data are empty or undefined.\n${JSON.stringify(data, null, 2)}`);
    };
    await page.goto(data.url);
    await expect(page.locator('#welcomtext')).toContainText('Welcome to Huawei web page for network configuration');

    await page.locator('#txt_Username').click();
    await page.locator('#txt_Username').fill(data.username);
    await page.locator('#txt_Password').click();
    await page.locator('#txt_Password').fill(data.password);
    await page.getByRole('button', { name: 'Log In' }).click();
    iframeMenu = page.frameLocator('#menuIframe');
    await expect(iframeMenu.locator('#InterNetStatusText')).toContainText('normal', { timeout: 10_000 });
  });

  test(`Get the number of ${deviceType} devices`, async () => {
    await expect(iframeMenu.locator(devSelector)).toContainText(devContent);
    const numDevicesMatch = (await iframeMenu.locator(devSelector).innerText()).match(/(?<=\()\d+(?=\))/);
    const numDevices = parseInt(numDevicesMatch?.[0] ?? '0');
    console.log('Number of devices: ' + numDevices);
  });

  test(`Extract the MAC and IP address of the ${deviceType} device found by filters`, async () => {
    await expect(iframeMenu.locator(devSelector)).toContainText(devContent);
    const numDevicesMatch = (await iframeMenu.locator(devSelector).innerText()).match(/(?<=\()\d+(?=\))/);
    const numDevices = parseInt(numDevicesMatch?.[0] ?? '0');

    await iframeMenu.locator(devIconSelector).click();
    const iframeDevices = iframeMenu.frameLocator('#ContectdevmngtPageSrc');
    await expect(iframeDevices.locator('label[id="devicetitle"]')).toContainText(devContent, { timeout: 20_000 });

    const deviceList = iframeDevices.locator('.DevTableList');
    await expect(deviceList).toHaveCount(numDevices);
    console.log(`Searching for ${deviceType} device with the filters: ${JSON.stringify(filters)}`);
    const device = deviceList.filter({ hasText: filters.name }).filter({ hasText: filters.status });
    console.log('Devices found: ' + await device.count());
    if (await device.count() > 0) {
      const deviceText = await device.locator('td').nth(2).innerText();
      const [deviceMac, deviceIP] = deviceText.split('\n');
      console.log(`MAC: ${deviceMac}\nIP: ${deviceIP}`);
    } else {
      console.log('No devices with the specified filter were found');
    }
  });
});