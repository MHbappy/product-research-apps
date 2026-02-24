package com.bappy.application.payment.service;

import com.bappy.application.payment.entity.PaymentTransaction;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    private static final Color HEADER_BG_COLOR = new Color(240, 240, 240);
    private static final Color BORDER_COLOR = new Color(200, 200, 200);
    private static final Font TITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, Color.BLACK);
    private static final Font SUBTITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.DARK_GRAY);
    private static final Font HEADER_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
    private static final Font NORMAL_FONT = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
    private static final Font BOLD_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);

    public byte[] generateInvoicePdf(PaymentTransaction transaction) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter writer = PdfWriter.getInstance(document, out);

            document.open();

            // 1. Header Section
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{1, 1});

            // Left: Company Info
            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(Rectangle.NO_BORDER);
            companyCell.addElement(new Paragraph("Multi-Tenant SaaS", SUBTITLE_FONT));
            companyCell.addElement(new Paragraph("123 Innovation Drive", NORMAL_FONT));
            companyCell.addElement(new Paragraph("Tech City, TC 94043", NORMAL_FONT));
            companyCell.addElement(new Paragraph("support@multitenant.com", NORMAL_FONT));
            headerTable.addCell(companyCell);

            // Right: Invoice Title & Meta
            PdfPCell metaCell = new PdfPCell();
            metaCell.setBorder(Rectangle.NO_BORDER);
            metaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            
            Paragraph title = new Paragraph("INVOICE", TITLE_FONT);
            title.setAlignment(Element.ALIGN_RIGHT);
            metaCell.addElement(title);
            
            Paragraph invoiceNo = new Paragraph("Invoice #: " + transaction.getTransactionId().substring(0, Math.min(transaction.getTransactionId().length(), 8)).toUpperCase(), NORMAL_FONT);
            invoiceNo.setAlignment(Element.ALIGN_RIGHT);
            metaCell.addElement(invoiceNo);

            Paragraph date = new Paragraph("Date: " + transaction.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")), NORMAL_FONT);
            date.setAlignment(Element.ALIGN_RIGHT);
            metaCell.addElement(date);
            
            headerTable.addCell(metaCell);

            document.add(headerTable);
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            // 2. Bill To & Payment Info
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(20f);

            // Bill To
            PdfPCell billToCell = new PdfPCell();
            billToCell.setBorder(Rectangle.NO_BORDER);
            billToCell.addElement(new Paragraph("BILL TO:", BOLD_FONT));
            
            String userName = (transaction.getUser().getFirstName() != null ? transaction.getUser().getFirstName() : "") + 
                              " " + 
                              (transaction.getUser().getLastName() != null ? transaction.getUser().getLastName() : "");
            if (userName.trim().isEmpty()) userName = "Valued Customer";
            
            billToCell.addElement(new Paragraph(userName, NORMAL_FONT));
            billToCell.addElement(new Paragraph(transaction.getUser().getEmail(), NORMAL_FONT));
            infoTable.addCell(billToCell);

            // Payment Details
            PdfPCell paymentCell = new PdfPCell();
            paymentCell.setBorder(Rectangle.NO_BORDER);
            paymentCell.addElement(new Paragraph("PAYMENT METHOD:", BOLD_FONT));
            paymentCell.addElement(new Paragraph(transaction.getGateway().name(), NORMAL_FONT));
            paymentCell.addElement(new Paragraph("Status: " + transaction.getStatus(), NORMAL_FONT));
            infoTable.addCell(paymentCell);

            document.add(infoTable);

            // 3. Line Items Table
            PdfPTable table = new PdfPTable(new float[]{4, 1, 2}); // Description, Qty, Amount
            table.setWidthPercentage(100);
            table.setHeaderRows(1);

            // Headers
            addHeaderCell(table, "Description");
            addHeaderCell(table, "Qty");
            addHeaderCell(table, "Amount");

            // Row 1
            addCell(table, transaction.getDescription(), Element.ALIGN_LEFT);
            addCell(table, "1", Element.ALIGN_CENTER);
            addCell(table, formatCurrency(transaction.getAmount(), transaction.getCurrency()), Element.ALIGN_RIGHT);

            // Empty rows filler (functional spacer)
            PdfPCell spacer = new PdfPCell(new Phrase(" "));
            spacer.setBorder(Rectangle.LEFT | Rectangle.RIGHT);
            spacer.setColspan(3);
            spacer.setMinimumHeight(200f); // Give it some height for look
            table.addCell(spacer);

            // Last line border closure
            PdfPCell bottomLine = new PdfPCell();
            bottomLine.setBorder(Rectangle.TOP);
            bottomLine.setColspan(3);
            table.addCell(bottomLine);

            document.add(table);

            // 4. Totals
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(100);
            totalTable.setWidths(new float[]{4, 2});

            PdfPCell emptyCell = new PdfPCell();
            emptyCell.setBorder(Rectangle.NO_BORDER);
            totalTable.addCell(emptyCell);

            PdfPTable subTotalTable = new PdfPTable(2);
            subTotalTable.setWidthPercentage(100);
            
            // Subtotal
            addSubTotalRow(subTotalTable, "Subtotal:", formatCurrency(transaction.getAmount(), transaction.getCurrency()));
            addSubTotalRow(subTotalTable, "Tax (0%):", formatCurrency(java.math.BigDecimal.ZERO, transaction.getCurrency()));
            
            // Grand Total
            PdfPCell totalLabel = new PdfPCell(new Phrase("Total:", BOLD_FONT));
            totalLabel.setBorder(Rectangle.TOP);
            totalLabel.setPaddingTop(5);
            subTotalTable.addCell(totalLabel);

            PdfPCell totalValue = new PdfPCell(new Phrase(formatCurrency(transaction.getAmount(), transaction.getCurrency()), BOLD_FONT));
            totalValue.setBorder(Rectangle.TOP);
            totalValue.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalValue.setPaddingTop(5);
            subTotalTable.addCell(totalValue);

            PdfPCell subTotalCell = new PdfPCell(subTotalTable);
            subTotalCell.setBorder(Rectangle.NO_BORDER);
            totalTable.addCell(subTotalCell);

            document.add(totalTable);
            
            // Footer
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);
            Paragraph footer = new Paragraph("Thank you for your business!", SUBTITLE_FONT);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }

    private void addHeaderCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, HEADER_FONT));
        cell.setBackgroundColor(HEADER_BG_COLOR);
        cell.setPadding(8);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, NORMAL_FONT));
        cell.setPadding(8);
        cell.setHorizontalAlignment(align);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private void addSubTotalRow(PdfPTable table, String label, String value) {
        PdfPCell cell1 = new PdfPCell(new Phrase(label, NORMAL_FONT));
        cell1.setBorder(Rectangle.NO_BORDER);
        table.addCell(cell1);

        PdfPCell cell2 = new PdfPCell(new Phrase(value, NORMAL_FONT));
        cell2.setBorder(Rectangle.NO_BORDER);
        cell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell2);
    }
    
    private String formatCurrency(java.math.BigDecimal amount, String currency) {
        return amount.setScale(2, java.math.RoundingMode.HALF_UP) + " " + currency;
    }
}
