# 使用 promise 封装 xlsx（包含表头数据）

[xlsx](https://www.npmjs.com/package/xlsx): v0.15.6

## 目的

根据业务需求，在处理 xlsx 文件数据前，要先检查一下表头（第一行数据）是否正确。但 [xlsx](https://www.npmjs.com/package/xlsx).utils.sheet_to_json 有个小 bug，如果表头对应列无数据，则表头对应的 key 也不存在。

基于以上问题，我们需要解析表格元数据，提取出表头。

并且使用 promise 封装，和 xlsx 文件数据一起返回。

## 实现

promise 最终状态始终为 resolve，处理成功返回 sheetName: { list, title }，处理失败返回 false。

```ts
import XLSX from 'xlsx';

export const fileToJson = function (
  file: Blob,
  opts?: XLSX.Sheet2JSONOpts
) {
  return new Promise(function (resolve, reject) {
    try {
      let reader = new FileReader();

      reader.onload = function (ev) {
        let result = ev.target?.result;
        let data = XLSX.read(result, { type: 'binary' });
        let json: { [key in string]: object } = {};
        for (let k in data.Sheets) {
          let sheet = data.Sheets[k];
          let title = Object.keys(sheet)
            .filter((key) => /^[A-Z]+1$/.test(key))  // 筛选表头
            .map((key) => sheet[key].v);  // 返回表头文本
          json[k] = {
            list: XLSX.utils.sheet_to_json(sheet, opts),
            title,
          };
        }
        resolve(json);
      };

      reader.readAsBinaryString(file);

    } catch (err) {
      resolve(false);
    }
  });
};

```

## 使用

```js
import { fileToJson } from './xlsx_utils';

handleXLSX = (e) => {
  fileToJson(e.target.files[0])
    .then(v => {
      if (v) {
        console.log(v);
      }
    })
}

<input type='file' onChange={this.handleXLSX} />
```

<br />

[whosmeya.com](https://www.whosmeya.com/)
