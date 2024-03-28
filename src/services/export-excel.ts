// import fs from "fs";
// import mime from "mime";
// import {Model, Schema} from "mongoose";
import {utils, WorkBook, WorkSheet, write} from "xlsx";
import {UserInterface} from "types/userInterface";

export class ExportService {

    private readonly exportPath: string;
    async exportAllUserDataToExcel(userData: UserInterface[]): Promise<string> {
        const workbook: WorkBook = utils.book_new();
        const worksheet: WorkSheet = utils.json_to_sheet(
            userData.map((user, index) => {
                return {
                    "STT": index + 1,
                    "Tên người dùng": user.fullName,
                    email: user.email,
                    // role: user.role,
                    "Số điện thoại": user.phone,
                    "Số dư": user.balance,
                    "Số đơn": user.orders,
                    "Doanh thu": user.revenue,
                    "loại khách hàng": user.isLoyalCustomer ? "Khách hàng thân thiết" : "Khách hàng mới",
                    "Đia chỉ": user.address || "N/A",
                    "Tên ngân hàng": user.bankingInfo.bank || "",
                    "Số tài khoản": user.bankingInfo.accountNumber || "",
                    "Tên chủ tài khoản": user.bankingInfo.accountName || "",
                    "Trạng thái": user.status ? "Đã kích hoạt" : "Chưa kích hoạt",
                }
            }));
        utils.book_append_sheet(workbook, worksheet, 'nguoidung');
        // const filePath: string = path.join(process.cwd(), 'public/storage/temp/thongtinnguoidung.xlsb');
        // writeFile(workbook, filePath);
        return write(workbook, {type: "buffer", bookType: "xlsb"});
    }

    exportDataForVisualization(data: Record<string, any>[], name: string): any {
        const workbook: WorkBook = utils.book_new();
        const worksheet: WorkSheet = utils.json_to_sheet(data);
        utils.book_append_sheet(workbook, worksheet, name);
        return write(workbook, {type: "buffer", bookType: "xlsb"});
    }
    // public downloadFile(filePath: string, response: Response): void {
    //     const filename = path.basename(filePath);
    //     const mimetype = mime.getType(filePath);
    //     response.setHeader('Content-disposition', 'attachment; filename=' + filename);
    //     response.setHeader('Content-type', mimetype as string);
    //     const filestream = fs.createReadStream(filePath);
    //     filestream.pipe(response).on('finish', () => {
    //         fs.unlink(filePath, (err) => {
    //             // if (err) this.Logger.error(err);
    //         });
    //     });
    // }

}