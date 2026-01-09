import type { Page, Route, Request } from "playwright";
import type { RequestFormApp } from "../shared/domain/request-form-app.interface";
import type { RequestItem, ComputeResult } from "../shared/domain/models";
import type { ComputeInterceptor } from "../shared/interfaces/compute-interceptor";
import { FormPage } from "../driver/page-objects/form-page";
import { safeJsonParse } from "../shared/helpers/utils";

export class ChromiumFormApp implements RequestFormApp {
  private readonly form: FormPage;

  public constructor(
    private readonly page: Page,
    private readonly baseUrl: string,
    private readonly computeInterceptor: ComputeInterceptor,
  ) {
    this.form = new FormPage(page);
  }

  public async init(): Promise<void> {
    await this.installComputeInterceptor();
    await this.form.goto(this.baseUrl);
  }

  public async startNewRequest(): Promise<void> {
    await this.form.startNewRequest();
  }

  public async addItem(item: RequestItem): Promise<void> {
    const index = await this.form.items.addItem();
    await this.form.items.fillItem(index, item);
  }

  public async compute(): Promise<ComputeResult> {
    await this.form.clickCompute();

    await this.page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="result-status"]');
      const t = el?.textContent?.trim();
      return t === "COMPLETED" || t === "FAILED";
    });

    return await this.form.results.read();
  }

  private async installComputeInterceptor(): Promise<void> {
    const expected = this.computeInterceptor.expectedUrl;

    await this.page.route(expected, async (route: Route, request: Request) => {
      if (request.method() !== "POST") {
        await route.fallback();
        return;
      }

      const postData = request.postData() ?? "";
      const payload: unknown = safeJsonParse(postData);

      this.computeInterceptor.onRequest?.(payload);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(this.computeInterceptor.response),
      });
    });
  }
}
