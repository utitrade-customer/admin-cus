import * as FileSaver from 'file-saver';
import { StatisticsResponse } from 'hooks/statistic/model';
import * as XLSX from 'xlsx';
interface ExportCSVProps {
  csvData: any[] | StatisticsResponse[];
  fileName: string;
}
export const exportFileExcel = ({ csvData, fileName }: ExportCSVProps) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const ws = XLSX.utils.json_to_sheet(csvData, {
    cellStyles: true,
  });
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};
