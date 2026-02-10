import { PDFDocument, rgb, StandardFonts, type PDFFont } from 'pdf-lib';
import { format } from 'date-fns';

import { type Contract } from '../types/contract';

interface Invoice {
  id: string;
  date: string | Date;
  dueDate: string | Date;
  hunterName: string;
  description?: string;
  amount: number;
  [key: string]: any;
}

/**
 * Generate a professional contract PDF using pdf-lib
 * @param contract - Contract data object
 * @returns PDF blob
 */
export const generateContractPDF = async (contract: Contract): Promise<Blob> => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add a page
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
    const { width, height } = page.getSize();
    
    // Define margins and spacing
    const margin = 50;
    const contentWidth = width - (margin * 2);
    let yPosition = height - margin;
    const lineHeight = 20;
    const sectionSpacing = 15;

    // Helper function to add text
    const addText = (text: string, fontSize: number, font: PDFFont, color = rgb(0, 0, 0), centerAlign = false) => {
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const xPosition = centerAlign ? (width - textWidth) / 2 : margin;
      page.drawText(text, {
        x: xPosition,
        y: yPosition,
        size: fontSize,
        font: font,
        color: color
      });
      yPosition -= lineHeight;
    };

    // Helper function to draw horizontal line
    const drawLine = (y = yPosition) => {
      page.drawLine({
        start: { x: margin, y: y },
        end: { x: width - margin, y: y },
        thickness: 1,
        color: rgb(0.2, 0.2, 0.2)
      });
      yPosition -= sectionSpacing;
    };

    // Company Header
    addText('GOODHAND OUTBACK EXPERIENCE', 18, helveticaBold, rgb(0.1, 0.3, 0.6), true);
    yPosition -= 5;
    addText('Australian Hunt Contract', 14, helveticaBold, rgb(0.2, 0.2, 0.2), true);
    yPosition -= 5;
    addText('www.goodhandoutbackexperience.com.au', 10, helveticaFont, rgb(0.4, 0.4, 0.4), true);
    yPosition -= sectionSpacing;
    
    drawLine();
    yPosition -= sectionSpacing;

    // Contract Metadata
    addText(`Contract ID: ${contract.id}`, 10, helveticaFont);
    addText(`Date: ${format(new Date(contract.createdAt || new Date()), 'MMMM dd, yyyy')}`, 10, helveticaFont);
    yPosition -= sectionSpacing;

    // Hunter Information Section
    yPosition -= sectionSpacing;
    addText('HUNTER INFORMATION', 12, helveticaBold, rgb(0.1, 0.3, 0.6));
    drawLine();
    
    addText(`Name: ${contract.hunterName}`, 10, helveticaFont);
    addText(`Email: ${contract.email}`, 10, helveticaFont);
    addText(`Phone: ${contract.phone}`, 10, helveticaFont);
    if (contract.address) {
      addText(`Address: ${contract.address}`, 10, helveticaFont);
    }
    yPosition -= sectionSpacing;

    // Hunt Details Section
    yPosition -= sectionSpacing;
    addText('HUNT DETAILS', 12, helveticaBold, rgb(0.1, 0.3, 0.6));
    drawLine();
    
    addText(`Hunt Date: ${format(new Date(contract.huntDate), 'MMMM dd, yyyy')}`, 10, helveticaFont);
    addText(`Package: ${contract.package}`, 10, helveticaFont);
    if (contract.pickupPoint) {
      addText(`Pickup Point: ${contract.pickupPoint}`, 10, helveticaFont);
    }
    if (contract.pickupNotes) {
      addText(`Pickup Notes: ${contract.pickupNotes}`, 10, helveticaFont);
    }
    if (contract.charter && contract.charter !== 'none') {
      addText(`Charter Option: ${contract.charter}`, 10, helveticaFont);
    }
    yPosition -= sectionSpacing;

    // Payment Terms Section
    yPosition -= sectionSpacing;
    addText('PAYMENT TERMS', 12, helveticaBold, rgb(0.1, 0.3, 0.6));
    drawLine();
    
    const totalAmount = contract.totalAmount || 0;
    const depositAmount = totalAmount * 0.5;
    const balanceAmount = totalAmount - depositAmount;
    
    addText(`Total Package Amount: $${totalAmount.toLocaleString()}`, 10, helveticaFont);
    addText(`Deposit Required (50%): $${depositAmount.toLocaleString()}`, 10, helveticaFont);
    addText(`Balance Due (60 days before hunt): $${balanceAmount.toLocaleString()}`, 10, helveticaFont);
    yPosition -= 5;
    addText('Payment Method: International Wire Transfer', 10, helveticaFont, rgb(0.3, 0.3, 0.3));
    yPosition -= sectionSpacing;

    // Banking Details Section
    yPosition -= sectionSpacing;
    addText('BANKING DETAILS', 12, helveticaBold, rgb(0.1, 0.3, 0.6));
    drawLine();
    
    addText('Bank: Australian and New Zealand Bank', 10, helveticaFont);
    addText('Account Name: [As per contract]', 10, helveticaFont);
    addText('SWIFT Code: [As per contract]', 10, helveticaFont);
    addText('Note: Full banking details provided in separate documentation', 9, helveticaFont, rgb(0.4, 0.4, 0.4));
    yPosition -= sectionSpacing;

    // Firearm Options Section
    yPosition -= sectionSpacing;
    addText('FIREARM OPTIONS', 12, helveticaBold, rgb(0.1, 0.3, 0.6));
    drawLine();
    
    const firearmText = contract.firearmOption === 'company' 
      ? 'Use Company Rifles (Included in package)' 
      : 'Import Own Rifles';
    addText(`Selected Option: ${firearmText}`, 10, helveticaFont);
    
    if (contract.firearmOption === 'own') {
      yPosition -= 5;
      // Warning box for own firearms
      const warningY = yPosition;
      page.drawRectangle({
        x: margin,
        y: warningY - 35,
        width: contentWidth,
        height: 40,
        color: rgb(1, 0.95, 0.8),
        borderColor: rgb(0.9, 0.7, 0),
        borderWidth: 1
      });
      yPosition -= 10;
      addText('IMPORTANT: Firearm permit forms must be submitted at least', 9, helveticaBold, rgb(0.6, 0.4, 0));
      addText('8 weeks prior to hunt date. Failure to comply may result in denial of entry.', 9, helveticaBold, rgb(0.6, 0.4, 0));
      yPosition -= 10;
    }
    yPosition -= sectionSpacing;

    // Trophy Processing Section
    if (contract.trophyProcessing) {
      yPosition -= sectionSpacing;
      addText('TROPHY PROCESSING', 12, helveticaBold, rgb(0.1, 0.3, 0.6));
      drawLine();
      
      addText('Included Services:', 10, helveticaBold);
      addText('  • Field preparation', 9, helveticaFont);
      addText('  • Skull boiling and cleaning', 9, helveticaFont);
      yPosition -= 5;
      addText('Not Included: Skin preparation and shipping', 9, helveticaFont, rgb(0.4, 0.4, 0.4));
      addText('Note: Shipping arranged through professional taxidermy agency', 9, helveticaFont, rgb(0.4, 0.4, 0.4));
      yPosition -= sectionSpacing;
    }

    // Terms and Conditions Section
    yPosition -= sectionSpacing;
    addText('TERMS AND CONDITIONS', 12, helveticaBold, rgb(0.1, 0.3, 0.6));
    drawLine();
    
    const terms = [
      '1. This contract is subject to the standard terms and conditions of Goodhand Outback Experience.',
      '2. Cancellations must be made in writing and are subject to cancellation fees.',
      '3. The client is responsible for obtaining all necessary licenses and permits.',
      '4. Weather conditions may affect hunt schedules. Alternative arrangements will be made.',
      '5. All hunters must comply with Australian hunting regulations and safety requirements.'
    ];
    
    terms.forEach(term => {
      const words = term.split(' ');
      let line = '';
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const testWidth = helveticaFont.widthOfTextAtSize(testLine, 9);
        
        if (testWidth > contentWidth && line !== '') {
          addText(line, 9, helveticaFont);
          line = word + ' ';
        } else {
          line = testLine;
        }
      });
      
      if (line !== '') {
        addText(line, 9, helveticaFont);
      }
    });

    yPosition -= sectionSpacing * 2;

    // Custom Notes Section
    if (contract.customNotes) {
      yPosition -= sectionSpacing;
      addText('SPECIAL NOTES', 12, helveticaBold, rgb(0.1, 0.3, 0.6));
      drawLine();
      addText(contract.customNotes, 9, helveticaFont);
      yPosition -= sectionSpacing;
    }

    // Signature Section
    yPosition -= sectionSpacing * 2;
    
    // Hunter Signature
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: margin + 200, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0)
    });
    yPosition -= lineHeight;
    addText('Hunter Signature', 9, helveticaBold);
    addText('Date: _______________', 8, helveticaFont);

    // Company Signature (right side)
    const rightSignatureX = width - margin - 200;
    page.drawLine({
      start: { x: rightSignatureX, y: yPosition + lineHeight * 2 },
      end: { x: rightSignatureX + 200, y: yPosition + lineHeight * 2 },
      thickness: 1,
      color: rgb(0, 0, 0)
    });
    
    page.drawText('Karl Goodhand (Director)', {
      x: rightSignatureX,
      y: yPosition + lineHeight,
      size: 9,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    page.drawText('Goodhand Outback Experience', {
      x: rightSignatureX,
      y: yPosition,
      size: 8,
      font: helveticaFont,
      color: rgb(0, 0, 0)
    });

    // Footer
    yPosition = 50;
    const footerText = 'Lot 208 Ninnis Court, Howard Springs, NT 0835 | Email: Karlgoodhand@icloud.com';
    const footerWidth = helveticaFont.widthOfTextAtSize(footerText, 8);
    page.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: yPosition,
      size: 8,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4)
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    
    // Convert to Blob
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate contract PDF');
  }
};

/**
 * Generate invoice PDF
 * @param invoice - Invoice data object
 * @returns PDF blob
 */
export const generateInvoicePDF = async (invoice: Invoice): Promise<Blob> => {
  try {
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    
    const margin = 50;
    let yPosition = height - margin;
    const lineHeight = 20;

    // Invoice Header
    page.drawText('INVOICE', {
      x: margin,
      y: yPosition,
      size: 24,
      font: helveticaBold,
      color: rgb(0.1, 0.3, 0.6)
    });
    
    yPosition -= 30;
    
    // Company details
    page.drawText('Goodhand Outback Experience', {
      x: margin,
      y: yPosition,
      size: 12,
      font: helveticaBold
    });
    
    yPosition -= lineHeight;
    page.drawText('Lot 208 Ninnis Court, Howard Springs, NT 0835', {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont
    });
    
    // Invoice details (right side)
    const rightColumnX = width - margin - 200;
    page.drawText(`Invoice #: ${invoice.id}`, {
      x: rightColumnX,
      y: height - margin,
      size: 10,
      font: helveticaFont
    });
    
    page.drawText(`Date: ${format(new Date(invoice.date), 'MMM dd, yyyy')}`, {
      x: rightColumnX,
      y: height - margin - lineHeight,
      size: 10,
      font: helveticaFont
    });
    
    page.drawText(`Due Date: ${format(new Date(invoice.dueDate), 'MMM dd, yyyy')}`, {
      x: rightColumnX,
      y: height - margin - lineHeight * 2,
      size: 10,
      font: helveticaFont
    });

    yPosition -= 60;
    
    // Bill To section
    page.drawText('BILL TO:', {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaBold
    });
    
    yPosition -= lineHeight;
    page.drawText(invoice.hunterName, {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont
    });

    yPosition -= 60;

    // Line items table
    page.drawRectangle({
      x: margin,
      y: yPosition - 5,
      width: width - margin * 2,
      height: 25,
      color: rgb(0.9, 0.9, 0.9)
    });
    
    page.drawText('Description', {
      x: margin + 10,
      y: yPosition,
      size: 10,
      font: helveticaBold
    });
    
    page.drawText('Amount', {
      x: width - margin - 100,
      y: yPosition,
      size: 10,
      font: helveticaBold
    });
    
    yPosition -= 30;
    
    // Invoice items
    page.drawText(invoice.description || 'Hunt Package Payment', {
      x: margin + 10,
      y: yPosition,
      size: 10,
      font: helveticaFont
    });
    
    page.drawText(`$${invoice.amount.toLocaleString()}`, {
      x: width - margin - 100,
      y: yPosition,
      size: 10,
      font: helveticaFont
    });
    
    yPosition -= 40;
    
    // Total
    page.drawLine({
      start: { x: width - margin - 200, y: yPosition + 10 },
      end: { x: width - margin, y: yPosition + 10 },
      thickness: 2,
      color: rgb(0, 0, 0)
    });
    
    page.drawText('Total Due:', {
      x: width - margin - 200,
      y: yPosition - 10,
      size: 12,
      font: helveticaBold
    });
    
    page.drawText(`$${invoice.amount.toLocaleString()}`, {
      x: width - margin - 100,
      y: yPosition - 10,
      size: 12,
      font: helveticaBold
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw new Error('Failed to generate invoice PDF');
  }
};

export default {
  generateContractPDF,
  generateInvoicePDF
};
