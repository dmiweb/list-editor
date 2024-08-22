import puppeteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(50000);

describe("test list-editor ", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:9000";

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
      devtools: false,
    });

    [page] = await browser.pages();
  });

  test("test validation fields form add products", async () => {
    await page.goto(baseUrl);

    await page.waitForSelector(".products__add-btn");

    const button = await page.$(".products__add-btn");

    await button.click();

    await page.waitForSelector(".form");

    const inputName = await page.$('.form__name-input')
    const inputPrice = await page.$('.form__price-input')
    const submit = await page.$('.form__btn_save')

    submit.click()

    await page.waitForSelector(".form .form__name-input.invalid");
    await inputName.type('Samsung Galaxy');
    submit.click()

    await page.waitForSelector(".form .form__price-input.invalid");
    await inputPrice.type('Invalid value');
    submit.click()

    await page.waitForSelector(".form .form__price-input.invalid");
  });

  test("test add product", async () => {
    await page.goto(baseUrl);

    await page.waitForSelector(".products__add-btn");

    const button = await page.$(".products__add-btn");

    await button.click();

    await page.waitForSelector(".form");

    const inputName = await page.$('.form__name-input')
    const inputPrice = await page.$('.form__price-input')
    const submit = await page.$('.form__btn_save')

    await inputName.type('Samsung Galaxy');
    await inputPrice.type('80000');
    await submit.click();

    await page.waitForSelector(".product-list__item");
  });

  test("test edit product", async () => {
    await page.goto(baseUrl);

    await page.waitForSelector(".product-list__item");

    const editBtn = await page.$('.product__option_edit')
    await editBtn.click();

    await page.waitForSelector(".form");

    const inputName = await page.$('.form__name-input')
    const inputPrice = await page.$('.form__price-input')
    const submit = await page.$('.form__btn_save')


    await inputName.click({ clickCount: 2 });
    await page.keyboard.press('Backspace')
    await inputName.type('Note');
    await submit.click();

    const result = await (await inputName.getProperty("value")).jsonValue()
    expect(result).toBe('Samsung Note');
  });

  test("test remove product", async () => {
    await page.goto(baseUrl);

    await page.waitForSelector(".product-list__item");

    const removeBtn = await page.$('.product__option_delete')
    await removeBtn.click();

    await page.waitForSelector(".widget-confirm");

    const confirmBtn = await page.$('.widget-confirm__btn_close')
    await confirmBtn.click();

    const product = await page.$('.product-list__item');
    expect(product).toBe(null);
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test("should add do something", async () => {
    await page.goto(baseUrl);
  });
});
