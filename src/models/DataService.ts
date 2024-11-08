import fs from "fs";

export class DataService {
  async readData(filePath: string): Promise<any> {
    try {
      // log("readData: ", filePath);
      const jsonData = fs.readFileSync(filePath, "utf8");
      // log(jsonData);
      const data = JSON.parse(jsonData);
      // log(data);
      // log("-----------------------------------------");
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async writeData(data: any, filePath: string) {
    // const oldData = readData(filePath);
    const jsonData = JSON.stringify(data, null, 4);
    try {
      fs.writeFileSync(filePath, jsonData, "utf8");
      console.log("Данные успешно сохранены в файл:", filePath);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
