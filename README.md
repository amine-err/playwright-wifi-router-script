# playwright-wifi-router-script

## What is this ?
This is an example playwright script for a small task that I needed.

It is a small script that logs in to my router and recovers the number of devices connected, and also recovers the MAC and IP address of a given device by its name.

## How to run the script

- clone this repo.
- run `npm install` in the cloned repo directory.
- duplicate the file `.env.example` and rename it to `.env`, then fill the `ROUTER_URL`, `ROUTER_USERNAME` and `ROUTER_PASSWORD`.
- change the variables `deviceType` and  `filters` in the file `./tests/get-device-by-filters.spec.ts` accordingly.
- run the test file using `npx playwright test` or using the VSCode extension if installed

## How to setup a playwright project for the first time

- create a directory.
- inside that directory install playwright using `npm init playwright@latest`.
- this will also create an example test file and a config file.
- you can now run tests using `npx playwright test`.
- you can also install the vscode extension [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) to be able to run tests directly from vscode.
