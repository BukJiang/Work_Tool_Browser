import { chromium, Page } from 'playwright';
import { Injectable } from '@nestjs/common';
import { FileUtil } from '@/app/util/file.util';
import { ThreadUtil } from '@/app/util/thread.util';
import { BrowserContext } from '@playwright/test';

@Injectable()
export class BombService {
  // COOKIE
  private COOKIE = {
    SECKEY_ABVK:
      'oSwma3nC47OpL5RMIY74fx9hK/toBcCiHnA/Gsh8srFn2/TIOK9hli2f/m/bPB7D8V/BHONA9ntUAUATrK/8cw==',
    XFI: 'a4bd2430-a69d-11ef-8d97-cb2d5958c94e',
    BMAP_SECKEY:
      'P1bXQOn4jxiQD683QbWN_jZhPIfLxobvhPbPGvq2V0suYKKLjpgFX3fmVIaJdyz3u1WnEwA5C4ic61iEN999jWkxFXM0sx5IzJMWxvFzWL0P5wAQxaSb2LZlMf51cJGGcIu9-xszDSOSpwV97B24wPj_RpWK6EKpJ4M3SnRKKnRlOMIdbmoFe76zpBV1nFbd',
    XFCS: 'BFECDC968710F421D62DD81CFED93227BA5F24C0DBC28781D81B194001FE7CE7',
    XFT: 'YbnW5WuSKPJZ9ey4lluVcNv0FPttRsACaywiaRhGD7o=',
    BIDUPSID: '7E865CE81E0E0A3E38EA989198EDAFC3',
    PSTM: '1717216847',
    BAIDUID: 'E7FFD12827A2E805A37B37B6D1641D1C:SL=0:NR=10:FG=1',
    __bid_n: '18fd1dc8a1701447fc9eb4',
    BAIDU_WISE_UID: 'wapp_1724463486266_853',
    H_WISE_SIDS_BFESS: '60360_60677_60720_60751',
    MCITY: '-194:',
    H_WISE_SIDS: '60843',
    BAIDUID_BFESS: 'E7FFD12827A2E805A37B37B6D1641D1C:SL=0:NR=10:FG=1',
    IV: 'FF8D986E8E4D59EC8E374480EC9E1C6E',
    ZFY: 'HZ0ShNLlwz7aktO0LUoXm300fczI6MVU4XDy:AApKf6A:C',
    H_PS_PSSID: '61027_60851_61129_61128_61114_61140_61160_61167_61175',
    delPer: '0',
    PSINO: '3',
    BDORZ: 'B490B5EBF6F3CD402E515D22BCDA1598',
    RT: '"z=1&dm=baidu.com&si=2c0f426e-1bd8-4544-8fe4-549ece5ab769&ss=m3oira0a&sl=1f&tt=jun&bcn=https://fclog.baidu.com/log/weirwood?type=perf&ld=80hpz"',
    BA_HECTOR: '0ga4042ga10ga525ag8g8k2kaqh5mg1jjpjg31v',
    ab_sr:
      '1.0.1_ODJkMWU0MzdlMGVkMGZkYTFkM2MwYzBhZTI1ZTk0MGE1YWVhNjU5ZDM5ZGI2NDAxYzYxNmMxZmE2YTc2YmYwNTUwMzA3MTcxMGMxMzY3MjU1OGQwMDBjMTNhZjEzMTkzMGQ4ZmM5Zjg1YTBhY2I4NjBjZjkxM2Q5ZjA3YzZmMDRlYzg0MjJlMTM1OGJkNmMwYzlkMzNjMjE0NTQ5MzczZQ==',
  };

  // 队列
  private QUEUE: number = 0;

  // 话术
  private SCRIPT: string[] = [
    '我老公最近会突然视力模糊、头疼头晕，偶尔还会感觉右侧无力。早晚才会，晚上出现比较多',
    '爱喝酒、抽烟，上个月还咳出了点血',
    '姓魏 18250807756',
    '怎么约医生',
  ];

  /**
   * 执行
   */
  invoke = async () => {
    // 读取莆田系医院网址
    const lines = await FileUtil.readTxtLine(
      'E:\\Project\\T`_Browser\\assist\\莆田系医院网址.txt',
    );

    let idx = 820;
    const intervalId = setInterval(() => {
      console.log('--', idx);
      if (idx >= lines.length) {
        clearInterval(intervalId);
        console.log('-- END --');
        return;
      }
      if (this.QUEUE >= 15) {
        return;
      }
      this.QUEUE = this.QUEUE + 1;
      this.execute(lines[idx]);
      idx = idx + 1;
    }, 3000);
  };

  /**
   * 执行
   */
  execute = async (url: string) => {
    // 启动
    const browserContext = await this.launch();
    try {
      // 新页面
      const page = await this.newPage(url, browserContext);
      // 话术
      for await (const text of this.SCRIPT) {
        await this.sendText(text, page);
      }
    } catch (e) {
      console.error('[Execute]', e);
    } finally {
      // Close
      await ThreadUtil.sleep(3 * 1000);
      await browserContext.close();
      this.QUEUE = this.QUEUE - 1;
    }
  };

  /**
   * 启动
   */
  launch = async (): Promise<BrowserContext> => {
    const browser = await chromium.launch({
      headless: true,
      slowMo: 100,
    });
    return await browser.newContext({
      viewport: {
        width: 400,
        height: 800,
      },
      isMobile: true,
      userAgent:
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
    });
  };

  /**
   * 新页面
   */
  newPage = async (url: string, browserContext: BrowserContext) => {
    // 添加Cookie
    const cookies = Object.entries(this.COOKIE).map((x) => {
      const [key, value] = x;
      return {
        name: key,
        value: value,
        url: url,
      };
    });
    await browserContext.addCookies(cookies);
    // NewPage
    const page = await browserContext.newPage();
    // Goto
    await page.goto(url);
    // Display
    await this.display(page);
    return page;
  };

  /**
   * 发送信息
   */
  sendText = async (text: string, page: Page) => {
    try {
      await ThreadUtil.sleep(Math.floor(Math.random() * 5 + 3) * 1000);
      // 定位数据框
      await this.display(page);
      await page.locator('.imlp-component-newtypebox-textarea').fill(text);
      // 点击发送
      await this.display(page);
      await page.locator('.imlp-component-newtypebox-send').click({
        force: true,
      });
    } catch (e) {
      console.error('[SendText]', 'Error', text, e);
    }
  };

  /**
   * Display
   */
  display = async (page: Page) => {
    try {
      await page.evaluate(() => {
        const elements = document.querySelectorAll('.passMod_dialog-wrapper');
        elements.forEach((element) => {
          (element as HTMLElement).style.display = 'none';
        });
      });
    } catch (e) {}
    try {
      await page.evaluate(() => {
        const elements = document.querySelectorAll('.imlp-component-mask');
        elements.forEach((element) => {
          (element as HTMLElement).style.display = 'none';
        });
      });
    } catch (e) {}
  };
}
