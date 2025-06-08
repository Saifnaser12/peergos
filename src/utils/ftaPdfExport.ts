import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TFunction } from 'i18next';

interface CompanyInfo {
  name: string;
  trn: string;
  taxPeriod: string;
  submissionDate?: string;
}

interface CITData {
  revenue: number;
  expenses: number;
  netProfit: number;
  taxableIncome: number;
  citPayable: number;
  effectiveRate: number;
  smallBusinessReliefApplied: boolean;
  taxAdjustments?: number;
  exemptIncome?: number;
  carriedForwardLosses?: number;
  isQFZP?: boolean;
  qualifyingIncome?: number;
  nonQualifyingIncome?: number;
}

interface VATData {
  standardRatedSales: number;
  zeroRatedSales: number;
  exemptSales: number;
  purchasesWithVAT: number;
  outputVAT: number;
  inputVAT: number;
  netVAT: number;
  isRefundable: boolean;
}

interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  isBalanced: boolean;
}

class FTAPDFExporter {
  private doc: jsPDF;
  private isRTL: boolean;
  private t: TFunction;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor(t: TFunction, isRTL: boolean = false) {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    this.t = t;
    this.isRTL = isRTL;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = 20;
  }

  private addFTAHeader(title: string) {
    // FTA Header Background
    this.doc.setFillColor(0, 85, 164); // FTA Blue
    this.doc.rect(0, 0, this.pageWidth, 35, 'F');

    // UAE Government Logo area
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(this.margin, 8, 30, 20, 'F');
    this.doc.setFontSize(8);
    this.doc.setTextColor(0, 85, 164);
    this.doc.text('UAE', this.margin + 15, 18, { align: 'center' });

    // FTA Title
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    const ftaTitle = this.isRTL ? 'الهيئة الاتحادية للضرائب' : 'Federal Tax Authority';
    this.doc.text(ftaTitle, this.pageWidth - this.margin, 18, { align: 'right' });

    // Document Title
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(title, this.pageWidth - this.margin, 28, { align: 'right' });

    // Reset colors
    this.doc.setTextColor(0, 0, 0);
  }

  private addCompanySection(companyInfo: CompanyInfo, yPosition: number): number {
    const startY = yPosition;

    // Company Information Section
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    const companyTitle = this.isRTL ? 'معلومات الشركة' : 'Company Information';
    this.doc.text(companyTitle, this.margin, startY);

    // Draw section border
    this.doc.setDrawColor(0, 85, 164);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, startY + 3, this.pageWidth - 2 * this.margin, 25);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);

    // Company details
    const details = [
      [this.isRTL ? 'اسم الشركة:' : 'Company Name:', companyInfo.name],
      [this.isRTL ? 'الرقم الضريبي:' : 'TRN:', companyInfo.trn],
      [this.isRTL ? 'الفترة الضريبية:' : 'Tax Period:', companyInfo.taxPeriod],
      [this.isRTL ? 'تاريخ التقديم:' : 'Submission Date:', companyInfo.submissionDate || new Date().toLocaleDateString()]
    ];

    details.forEach((detail, index) => {
      const y = startY + 8 + (index * 4);
      this.doc.text(detail[0], this.margin + 5, y);
      this.doc.text(detail[1], this.margin + 60, y);
    });

    return startY + 35;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.isRTL ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(amount);
  }

  private addDeclarationSection(yPosition: number): number {
    const declarationText = this.isRTL
      ? 'أقر بأن المعلومات المقدمة في هذا الإقرار صحيحة وكاملة وفقاً لأفضل معرفتي واعتقادي، وأن جميع المبالغ محسوبة وفقاً لقانون ضريبة القيمة المضافة ولوائحه التنفيذية.'
      : 'I declare that the information provided in this return is true and complete to the best of my knowledge and belief, and that all amounts have been computed in accordance with the VAT Law and its Executive Regulations.';

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    // Declaration box
    this.doc.setDrawColor(100, 100, 100);
    this.doc.rect(this.margin, yPosition, this.pageWidth - 2 * this.margin, 25);

    // Declaration text
    const lines = this.doc.splitTextToSize(declarationText, this.pageWidth - 2 * this.margin - 10);
    this.doc.text(lines, this.margin + 5, yPosition + 8);

    // Signature line
    const signatureY = yPosition + 35;
    this.doc.line(this.margin, signatureY, this.margin + 60, signatureY);
    this.doc.text(this.isRTL ? 'التوقيع والتاريخ' : 'Signature & Date', this.margin, signatureY + 5);

    return signatureY + 15;
  }

  private addQFZPFooter(): void {
    // Check if company is a Free Zone QFZP
    const setupData = localStorage.getItem('setupData');
    let isQFZP = false;
    
    if (setupData) {
      try {
        const parsed = JSON.parse(setupData);
        isQFZP = parsed.isQFZP || false;
      } catch (error) {
        console.warn('Error parsing setup data for QFZP footer:', error);
      }
    }

    if (isQFZP) {
      // Add QFZP footer note
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'italic');
      this.doc.setTextColor(128, 128, 128); // Grey color
      
      const footerText = this.isRTL
        ? 'هذا الكيان هو شخص منطقة حرة مؤهل (QFZP) بموجب المادة 18 من المرسوم بقانون اتحادي رقم (47) لسنة 2022.'
        : 'This entity is a Qualifying Free Zone Person (QFZP) under Article 18 of Federal Decree-Law No. (47) of 2022.';
      
      const footerY = this.pageHeight - 15;
      
      if (this.isRTL) {
        this.doc.text(footerText, this.pageWidth - this.margin, footerY, { align: 'right' });
      } else {
        this.doc.text(footerText, this.pageWidth - this.margin, footerY, { align: 'right' });
      }
      
      // Reset text color to black
      this.doc.setTextColor(0, 0, 0);
    }
  }

  generateCITPDF(companyInfo: CompanyInfo, citData: CITData): jsPDF {
    const title = this.isRTL ? 'إقرار ضريبة الشركات' : 'Corporate Income Tax Return';
    this.addFTAHeader(title);

    let currentY = 45;
    currentY = this.addCompanySection(companyInfo, currentY);

    // CIT Calculation Section
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    const calcTitle = this.isRTL ? 'حساب ضريبة الشركات' : 'Corporate Income Tax Calculation';
    this.doc.text(calcTitle, this.margin, currentY);

    const tableData = [
      [this.isRTL ? 'الإيرادات' : 'Revenue', this.formatCurrency(citData.revenue)],
      [this.isRTL ? 'المصروفات' : 'Expenses', this.formatCurrency(citData.expenses)],
      [this.isRTL ? 'الربح الصافي' : 'Net Profit', this.formatCurrency(citData.netProfit)],
      [this.isRTL ? 'الدخل الخاضع للضريبة' : 'Taxable Income', this.formatCurrency(citData.taxableIncome)],
      [this.isRTL ? 'ضريبة الشركات المستحقة' : 'CIT Payable', this.formatCurrency(citData.citPayable)],
      [this.isRTL ? 'المعدل الفعلي' : 'Effective Rate', `${citData.effectiveRate.toFixed(2)}%`]
    ];

    (this.doc as any).autoTable({
      startY: currentY + 5,
      head: [[this.isRTL ? 'البيان' : 'Description', this.isRTL ? 'المبلغ' : 'Amount']],
      body: tableData,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 85, 164], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: this.margin, right: this.margin }
    });

    currentY = (this.doc as any).lastAutoTable.finalY + 10;

    // Small Business Relief Notice
    if (citData.smallBusinessReliefApplied) {
      this.doc.setFillColor(240, 248, 255);
      this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 15, 'F');
      this.doc.setFontSize(10);
      const reliefText = this.isRTL 
        ? 'تم تطبيق إعفاء الشركات الصغيرة' 
        : 'Small Business Relief Applied';
      this.doc.text(reliefText, this.margin + 5, currentY + 8);
      currentY += 20;
    }

    this.addDeclarationSection(currentY);
    this.addQFZPFooter();

    return this.doc;
  }

  generateVATPDF(companyInfo: any, vatData: any): jsPDF {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VAT Return', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Company Information
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Company: ${companyInfo.name}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`TRN: ${companyInfo.trn}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Tax Period: ${companyInfo.taxPeriod}`, margin, yPosition);
    yPosition += 20;

    // VAT Summary
    pdf.setFont('helvetica', 'bold');
    pdf.text('VAT Summary', margin, yPosition);
    yPosition += 15;

    pdf.setFont('helvetica', 'normal');
    const summaryData = [
      ['Standard-rated Sales', `AED ${vatData.standardRatedSales.toLocaleString()}`],
      ['Zero-rated Sales', `AED ${vatData.zeroRatedSales.toLocaleString()}`],
      ['Exempt Sales', `AED ${vatData.exemptSales.toLocaleString()}`],
      ['Purchases with VAT', `AED ${vatData.purchasesWithVAT.toLocaleString()}`],
      ['Output VAT', `AED ${vatData.outputVAT.toLocaleString()}`],
      ['Input VAT', `AED ${vatData.inputVAT.toLocaleString()}`]
    ];

    summaryData.forEach(([label, value]) => {
      pdf.text(label, margin, yPosition);
      pdf.text(value, pageWidth - margin - 50, yPosition);
      yPosition += 10;
    });

    // Designated Zone Reverse Charge Section
    if (vatData.isDesignatedZone && vatData.designatedZoneImports > 0) {
      yPosition += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reverse Charge Summary - Designated Zone', margin, yPosition);
      yPosition += 15;

      pdf.setFont('helvetica', 'normal');
      const reverseChargeVAT = vatData.designatedZoneImports * 0.05;
      const reverseChargeData = [
        ['Mainland Imports to Designated Zone', `AED ${vatData.designatedZoneImports.toLocaleString()}`],
        ['Reverse Charge VAT Applied', `AED ${reverseChargeVAT.toLocaleString()}`],
        ['Note', 'VAT on mainland supplies reverse-charged under UAE VAT Law']
      ];

      reverseChargeData.forEach(([label, value]) => {
        pdf.text(label, margin, yPosition);
        if (label !== 'Note') {
          pdf.text(value, pageWidth - margin - 50, yPosition);
        } else {
          pdf.setFontSize(10);
          pdf.text(value, margin, yPosition + 5);
          pdf.setFontSize(12);
          yPosition += 5;
        }
        yPosition += 10;
      });
      yPosition += 10;
    }

    // Final VAT Due
    pdf.setFont('helvetica', 'bold');
    pdf.text(vatData.isRefundable ? 'VAT Refundable:' : 'VAT Payable:', margin, yPosition);
    pdf.text(`AED ${vatData.netVAT.toLocaleString()}`, pageWidth - margin - 50, yPosition);

    // Add QFZP footer if applicable
    this.addQFZPFooterToPDF(pdf);

    return pdf;
  }

  private addQFZPFooterToPDF(pdf: jsPDF): void {
    // Check if company is a Free Zone QFZP
    const setupData = localStorage.getItem('setupData');
    let isQFZP = false;
    
    if (setupData) {
      try {
        const parsed = JSON.parse(setupData);
        isQFZP = parsed.isQFZP || false;
      } catch (error) {
        console.warn('Error parsing setup data for QFZP footer:', error);
      }
    }

    if (isQFZP) {
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      
      // Add QFZP footer note
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(128, 128, 128); // Grey color
      
      const footerText = this.isRTL
        ? 'هذا الكيان هو شخص منطقة حرة مؤهل (QFZP) بموجب المادة 18 من المرسوم بقانون اتحادي رقم (47) لسنة 2022.'
        : 'This entity is a Qualifying Free Zone Person (QFZP) under Article 18 of Federal Decree-Law No. (47) of 2022.';
      
      const footerY = pageHeight - 15;
      pdf.text(footerText, pageWidth - margin, footerY, { align: 'right' });
      
      // Reset text color to black
      pdf.setTextColor(0, 0, 0);
    }
  }

  generateFinancialsPDF(companyInfo: CompanyInfo, financialData: FinancialData): jsPDF {
    const title = this.isRTL ? 'البيانات المالية' : 'Financial Statements';
    this.addFTAHeader(title);

    let currentY = 45;
    currentY = this.addCompanySection(companyInfo, currentY);

    // Financial Summary Section
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    const summaryTitle = this.isRTL ? 'الملخص المالي' : 'Financial Summary';
    this.doc.text(summaryTitle, this.margin, currentY);

    // P&L Summary
    const plData = [
      [this.isRTL ? 'إجمالي الإيرادات' : 'Total Revenue', this.formatCurrency(financialData.totalRevenue)],
      [this.isRTL ? 'إجمالي المصروفات' : 'Total Expenses', this.formatCurrency(financialData.totalExpenses)],
      [this.isRTL ? 'صافي الدخل' : 'Net Income', this.formatCurrency(financialData.netIncome)]
    ];

    (this.doc as any).autoTable({
      startY: currentY + 5,
      head: [[this.isRTL ? 'قائمة الدخل' : 'Income Statement', this.isRTL ? 'المبلغ' : 'Amount']],
      body: plData,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      margin: { left: this.margin, right: this.margin }
    });

    currentY = (this.doc as any).lastAutoTable.finalY + 10;

    // Balance Sheet Summary
    const bsData = [
      [this.isRTL ? 'إجمالي الأصول' : 'Total Assets', this.formatCurrency(financialData.totalAssets)],
      [this.isRTL ? 'إجمالي الخصوم' : 'Total Liabilities', this.formatCurrency(financialData.totalLiabilities)],
      [this.isRTL ? 'إجمالي حقوق الملكية' : 'Total Equity', this.formatCurrency(financialData.totalEquity)]
    ];

    (this.doc as any).autoTable({
      startY: currentY,
      head: [[this.isRTL ? 'الميزانية العمومية' : 'Balance Sheet', this.isRTL ? 'المبلغ' : 'Amount']],
      body: bsData,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [239, 246, 255] },
      margin: { left: this.margin, right: this.margin }
    });

    currentY = (this.doc as any).lastAutoTable.finalY + 10;

    // Balance Check
    const balanceColor = financialData.isBalanced ? [34, 197, 94] : [239, 68, 68];
    this.doc.setFillColor(balanceColor[0], balanceColor[1], balanceColor[2]);
    this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 15, 'F');
    this.doc.setFontSize(12);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');

    const balanceText = financialData.isBalanced 
      ? (this.isRTL ? 'الميزانية متوازنة' : 'BALANCE SHEET BALANCED')
      : (this.isRTL ? 'الميزانية غير متوازنة' : 'BALANCE SHEET NOT BALANCED');

    this.doc.text(balanceText, this.pageWidth / 2, currentY + 8, { align: 'center' });
    this.doc.setTextColor(0, 0, 0);

    this.addQFZPFooter();

    return this.doc;
  }
}

export { FTAPDFExporter, type CompanyInfo, type CITData, type VATData, type FinancialData };