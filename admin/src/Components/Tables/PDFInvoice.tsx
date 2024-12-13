import React from "react";
import { jsPDF } from "jspdf"
import fontRoboto from "./font";

interface BillDetail {
    menuItemID: number;
    menuItemName: string;
    quantity: number;
    price: number;
    size: string;
    total: number;
    tableBillDetailID: number
}

interface CalculateBillResponse {
    totalAmount: number;
    totalAfterVoucher: number | null;
    deposit: number;
    timeOut: string;
    timeIn: string;
    table: string;
    finalTotal: number
    billDetails: BillDetail[];
}

interface PDFInvoiceComponentProps {
    data: CalculateBillResponse | null;
}

const PDFInvoice: React.FC<PDFInvoiceComponentProps> = ({ data }) => {
    const generatePDF = (data: CalculateBillResponse) => {

        console.log(data);

        const { totalAmount, totalAfterVoucher, deposit, billDetails, timeOut, timeIn, table, finalTotal } = data;

        console.log(totalAfterVoucher, totalAmount, deposit);


        const doc = new jsPDF();
        doc.addFileToVFS("Roboto-Regular.ttf", `${fontRoboto.fontRegular}`);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

        doc.addFileToVFS("Roboto-Bold.ttf", `${fontRoboto.fontBold}`);
        doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

        let y = 20;
        const pageHeight = doc.internal.pageSize.getHeight();
        const marginBottom = 20; // Khoảng cách dưới cùng

        // Thêm logo SAVORY
        const logoTexts = "SAVORY";
        doc.setFontSize(36); // Kích thước font lớn
        doc.setFont("Roboto", "bold"); // Font chữ in đậm
        const logoWidths = doc.getTextWidth(logoTexts);
        const pageWidths = doc.internal.pageSize.getWidth();
        const logoXs = (pageWidths - logoWidths) / 2; // Căn giữa logo
        doc.text(logoTexts, logoXs, y);

        doc.setFont("Roboto", "normal");

        y += 15

        doc.setFontSize(16);

        // Căn giữa tiêu đề
        const title = "HÓA ĐƠN THANH TOÁN";
        const titleWidth = doc.getTextWidth(title);
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleX = (pageWidth - titleWidth) / 2; // Tính toán vị trí x
        doc.text(title, titleX, y);

        y += 10;
        doc.setFontSize(12);
        doc.text(`Số bàn: ${table}`, 20, y);

        y += 10;
        doc.text(`Thời gian vào: ${timeIn}`, 20, y);

        y += 10;
        doc.text(`Thời gian ra: ${timeOut}`, 20, y);

        y += 10;
        doc.text(`Tổng tiền: ${Number(totalAmount).toLocaleString()} VND`, 20, y);

        if (totalAfterVoucher) {
            y += 10;
            doc.text(`Giảm giá: ${Number(totalAfterVoucher).toLocaleString()} VND`, 20, y);
        }

        if (deposit) {
            y += 10;
            doc.text(`Đặt cọc: ${Number(deposit).toLocaleString()} VND`, 20, y);
        }

        // Bắt đầu vẽ bảng
        y += 20;
        doc.setFontSize(14);
        doc.text(`Chi tiết hóa đơn:`, 20, y);
        y += 10;

        // Vẽ tiêu đề bảng
        const startX = 20;
        const columnWidths = [100, 20, 30]; // Chiều rộng các cột
        const headers = ["Tên món", "SL", "Tổng"];

        // Vẽ tiêu đề
        headers.forEach((header, i) => {
            doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
        });

        y += 15;
        // Vẽ đường viền cho tiêu đề
        doc.line(startX, y - 10, startX + columnWidths.reduce((a, b) => a + b, 0), y - 10); // Đường ngang

        billDetails.forEach(detail => {
            // Kiểm tra xem các thuộc tính có tồn tại không
            const menuItemName = detail.menuItemName || '';
            const quantity = detail.quantity !== undefined ? detail.quantity.toString() : '0'; // Đảm bảo số lượng có giá trị
            const total = detail.total !== undefined ? `${Number(detail.total).toLocaleString()} VND` : '0 VND'; // Đảm bảo tổng có giá trị

            const detailData = [menuItemName, quantity, total];

            detailData.forEach((item, i) => {
                // Nếu là tên món, chia thành nhiều dòng
                if (i === 0) {
                    const lines = doc.splitTextToSize(item, columnWidths[i]);
                    lines.forEach((line: string) => {
                        if (y + 10 > pageHeight - marginBottom) {
                            doc.addPage();
                            y = 20;
                        }
                        doc.text(line, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
                    });
                } else {
                    doc.text(item, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
                }
            });

            y += 15;

            doc.line(startX, y - 10, startX + columnWidths.reduce((a, b) => a + b, 0), y - 10); // Đường ngang
        })

        y += 10;
        doc.text(`Tổng thanh toán: ${Number(finalTotal).toLocaleString()} VND`, 20, y)

        y += 20;

        // Căn giữa tiêu đề
        const titleend = "Cảm ơn và hẹn gặp lại quý khách!";
        const titleendWidth = doc.getTextWidth(titleend);
        const pageendWidth = doc.internal.pageSize.getWidth();
        const titleendX = (pageendWidth - titleendWidth) / 2; // Tính toán vị trí x
        doc.text(titleend, titleendX, y);

        doc.save(`${data.table}.pdf`);
    };

    React.useEffect(() => {
        if (data) {
            generatePDF(data)
        }
    }, [data]);

    return null;
}

export default PDFInvoice;

