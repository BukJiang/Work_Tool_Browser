import * as fs from 'fs';
import * as readline from 'readline';

export class FileUtil {
  // 定义读取文件的函数
  static readTxtLine = async (filePath: string): Promise<string[]> => {
    const lines: string[] = [];
    try {
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        console.error('[FileUtil] 文件不存在:', filePath);
        return;
      }

      // 创建读取流
      const fileStream = fs.createReadStream(filePath);
      // 使用 readline 逐行读取
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity, // 支持 \r\n 作为换行符
      });
      for await (const line of rl) {
        lines.push(line);
      }
    } catch (e) {
      console.error('[FileUtil] 读取文件时出错:', e);
    }
    return lines;
  };
}
