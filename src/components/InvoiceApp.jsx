import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QR_img from "../assets/QR_img.jpeg";
import { useState } from "react";

function InvoiceApp() {
const [data, setData] = useState({
    date: new Date().toLocaleDateString(),
    billedTo: '',
    softwareName: '',
    amount: '',
    paidAmount: '',
    billedBy: 'Infosai Software Company',
    address: 'Flat Number 501, 3rd Floor, Reshim Bagh Chowk, Nagpur 440009',
    gtin: '7AZPPP2149H1ZY',
    bankName: 'Axis Bank',
    accountNo: '919020029675541',
    ifsc: 'UTIB0003653'
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Logic to generate the PDF
  const generatePDF = async () => {
    const doc = new jsPDF();
    const balance = (Number(data.amount) || 0) - (Number(data.paidAmount) || 0);

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    // Header
    doc.setFontSize(20);
    doc.text("INVOICE", 105, 20, { align: 'center' });

    // Date & Billed To
    doc.setFontSize(10);
    doc.text(`Invoice Date : ${data.date}`, 14, 35);
    
    doc.setTextColor(114, 94, 156); // Purple color
    doc.text("Billed To", 150, 40);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(data.billedTo, 150, 45);

    // Billed By Section
    doc.setFont("helvetica", "normal");
    doc.text("Billed By", 14, 55);
    doc.text(data.billedBy, 14, 60);
    doc.setFontSize(8);
    doc.text(data.address, 14, 65, { maxWidth: 80 });
    doc.text(`GTIN : ${data.gtin}`, 14, 75);

    // Main Table
    autoTable(doc, {
      startY: 85,
      head: [['Software Name', 'Amount']],
      body: [[data.softwareName, `INR ${data.amount}`]],
      headStyles: { fillColor: [22, 53, 91] }, // Dark blue
      styles: { cellPadding: 5 }
    });

    // Totals Box
    const finalY = doc.lastAutoTable.finalY;
    doc.setFillColor(240, 245, 255); // Light blue fill
    doc.rect(140, finalY, 56, 20, 'F');
    doc.setFontSize(9);
    doc.text(`Paid Amount: -${data.paidAmount} rs`, 142, finalY + 8);
    doc.text(`Balance Amount: ${balance} rs`, 142, finalY + 15);

    // Bank Details
    doc.setFontSize(10);
    doc.text("Bank Details", 14, finalY + 10);
    doc.setFontSize(8);
    doc.text(`Company Name: ${data.billedBy}`, 14, finalY + 18);
    doc.text(`Account Number: ${data.accountNo}`, 14, finalY + 23);
    doc.text(`Ifsc Code: ${data.ifsc}`, 14, finalY + 28);
    doc.text('Account Type: Current', 14, finalY + 33);
    doc.text(`Bank Name: ${data.bankName}`, 14, finalY + 38);

    const qrImg = await loadImage(QR_img);
    doc.addImage(qrImg, 'JPEG', 14, finalY + 41, 20, 20);

    doc.text(`Terms and Conditions`, 14, finalY + 80);
    doc.text(`1. Payment Invoice`, 16, finalY + 84);
    doc.text(`For emquiry reach out via email at infosaisoftwarecompany@gmail.com or call out at 9860430582`, 14, finalY + 90);

    doc.save(`${data.billedTo}_Invoice.pdf`);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Invoice Generator</h1>
        
        <div className="grid grid-cols-1 gap-4">
          <input className="border p-2 rounded" name="billedTo" placeholder="Billed To (Client Name)" onChange={handleChange} />
          <input className="border p-2 rounded" name="softwareName" placeholder="Software Name" onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <input className="border p-2 rounded" type="number" name="amount" placeholder="Total Amount" onChange={handleChange} />
            <input className="border p-2 rounded" type="number" name="paidAmount" placeholder="Paid Amount" onChange={handleChange} />
            {/* <input className="border p-2 rounded" type="number" name="balanced"s */}
          </div>
        </div>

        <button 
          onClick={generatePDF}
          className="mt-8 w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition shadow-lg"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default InvoiceApp