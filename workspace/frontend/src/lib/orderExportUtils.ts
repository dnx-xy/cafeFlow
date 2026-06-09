// src/lib/orderExportUtils.ts
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface BusinessHeaderInfo {
  name: string;
  description?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  phone?: string;
  currencySymbol?: string;
  logoBase64?: string;
}

const loadLogoAsBase64 = async (url: string): Promise<string | null> => {
  try {
    if (url.startsWith('data:')) return url;
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const drawHeader = (doc: jsPDF, header?: BusinessHeaderInfo): number => {
  if (!header) return 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const logoX = margin + 4;
  const logoY = 6;
  const logoSize = 14;
  const textX = logoX + logoSize + 4;

  // Background with rounded corners behind entire header
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(margin, 4, contentWidth, 30, 4, 4, 'F');

  if (header.logoBase64) {
    try {
      doc.addImage(header.logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
      doc.setDrawColor(220, 220, 220);
      doc.roundedRect(logoX, logoY, logoSize, logoSize, 3, 3, 'S');
    } catch {
      doc.setFillColor(245, 158, 11);
      doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(header.name.charAt(0).toUpperCase(), logoX + logoSize / 2, logoY + logoSize / 2 + 3, { align: 'center' });
    }
  } else {
    doc.setFillColor(245, 158, 11);
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(header.name.charAt(0).toUpperCase(), logoX + logoSize / 2, logoY + logoSize / 2 + 3, { align: 'center' });
  }

  // Center name text vertically with logo (12pt font baseline offset from logo center)
  const nameBaseline = logoY + logoSize / 2 + 4;
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.text(header.name, textX, nameBaseline);

  let nextY = nameBaseline;
  if (header.description) {
    nextY += 6;
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text(header.description, textX, nextY);
  }

  const infoY = nextY + 6;
  doc.setFontSize(7);
  doc.setTextColor(130);
  const addrParts = [header.address, header.city].filter(Boolean).join(', ');
  if (addrParts) doc.text(addrParts, textX, infoY);
  if (header.phone) doc.text(`Phone: ${header.phone}`, textX, infoY + 4);

  doc.setDrawColor(220);
  doc.line(margin, 30, pageWidth - margin, 30);

  doc.setTextColor(0);
  doc.setFontSize(11);

  return 37;
};

const drawTableHeader = (doc: jsPDF, margin: number, pageWidth: number, colX: number[], y: number, headerHeight: number): number => {
  doc.setDrawColor(200);
  doc.setFillColor(60, 60, 60);
  doc.rect(margin, y, pageWidth - margin * 2, headerHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Item', colX[0] + 3, y + 6);
  doc.text('Qty', colX[1] + 3, y + 6);
  doc.text('Unit Price', colX[2] + 3, y + 6);
  doc.text('Total', colX[3] + 3, y + 6);
  return y + headerHeight;
};

export interface OrderExportOptions {
  orderId: string;
  orderItems?: any[];
  totalAmount: number;
  createdAt: string;
  customer?: string;
  email?: string;
  tableNumber?: string;
  orderType?: string;
  paymentStatus?: string;
  status?: string;
}

export interface OrderCollectionExportOptions {
  orders: OrderExportOptions[];
  title?: string;
}

export const printOrderReceipt = (order: OrderExportOptions) => {
  toast.info('Opening print dialog...');
  window.print();
};

export const exportOrder = async (order: OrderExportOptions, format: 'xlsx' | 'pdf' | 'jpg', header?: BusinessHeaderInfo) => {
  try {
    if (header?.logoUrl && !header.logoBase64) {
      header.logoBase64 = await loadLogoAsBase64(header.logoUrl) || undefined;
    }

    const cs = header?.currencySymbol || '$';

    switch(format) {
      case 'pdf':
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const colItem = 70;
        const colQty = 20;
        const colUnit = 35;
        const colTotal = pageWidth - margin - colItem - colQty - colUnit - margin;
        const colX = [margin, margin + colItem, margin + colItem + colQty, margin + colItem + colQty + colUnit];
        const rowHeight = 8;
        const dateStr = new Date().toISOString().slice(0, 10);

        let y = drawHeader(doc, header);

        doc.text(`Order ID: ${order.orderId}`, margin, y);
        y += 7;
        doc.text(`Date: ${order.createdAt}`, margin, y);
        y += 7;
        doc.text(`Customer: ${order.customer || 'N/A'}`, margin, y);
        y += 7;
        doc.text(`Status: ${order.status || 'N/A'}`, margin, y);
        y += 10;

        y = drawTableHeader(doc, margin, pageWidth, colX, y, 8);
        doc.setTextColor(0);

        if (order.orderItems && order.orderItems.length > 0) {
          order.orderItems.forEach((item) => {
            if (y > 270) {
              doc.addPage();
              y = drawTableHeader(doc, margin, pageWidth, colX, y, 8);
              doc.setTextColor(0);
            }
            doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'S');
            doc.text(item.menuItem?.name || 'Item', colX[0] + 3, y + 6);
            doc.text(String(item.quantity || 0), colX[1] + 3, y + 6);
            doc.text(`${cs}${Number(item.unitPrice || 0).toFixed(2)}`, colX[2] + 3, y + 6);
            doc.text(`${cs}${Number(item.totalPrice || 0).toFixed(2)}`, colX[3] + 3, y + 6);
            y += rowHeight;
          });
        } else {
          doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'S');
          doc.text('No items', colX[0] + 3, y + 6);
          y += rowHeight;
        }

        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'F');
        doc.text('Total', colX[0] + 3, y + 6);
        doc.text(`${cs}${Number(order.totalAmount || 0).toFixed(2)}`, colX[3] + 3, y + 6);

        doc.save(`order-${order.orderId}-${dateStr}.pdf`);
        break;
        
      case 'jpg':
        const htmlContent = `
          <div style="font-family: Arial, Helvetica, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #eee;">
            <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 2px solid #f59e0b; margin-bottom: 20px;">
              ${header?.logoBase64 ? `<img src="${header.logoBase64}" alt="" style="width: 36px; height: 36px; border-radius: 8px; object-fit: cover;" />` : ''}
              <div>
                <div style="font-size: 18px; font-weight: 700; color: #1a1a1a;">${header?.name || 'Cafe'}</div>
                ${header?.description ? `<div style="font-size: 11px; color: #999;">${header.description}</div>` : ''}
              </div>
            </div>
            <h1 style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px;">Order Report</h1>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-bottom: 16px;">
              <tr><td style="padding: 4px 8px; color: #666; width: 100px;"><strong>Order ID</strong></td><td style="padding: 4px 8px;">${order.orderId}</td></tr>
              <tr><td style="padding: 4px 8px; color: #666;"><strong>Date</strong></td><td style="padding: 4px 8px;">${order.createdAt}</td></tr>
              <tr><td style="padding: 4px 8px; color: #666;"><strong>Customer</strong></td><td style="padding: 4px 8px;">${order.customer || 'N/A'}</td></tr>
              <tr><td style="padding: 4px 8px; color: #666;"><strong>Status</strong></td><td style="padding: 4px 8px;">${order.status || 'N/A'}</td></tr>
              <tr><td style="padding: 4px 8px; color: #666;"><strong>Total</strong></td><td style="padding: 4px 8px; font-weight: 700;">${cs}${order.totalAmount}</td></tr>
            </table>
            <h2 style="font-size: 15px; font-weight: 600; color: #1a1a1a; margin: 0 0 8px;">Items</h2>
            <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 8px; text-align: left; font-weight: 600; color: #666; border-bottom: 1px solid #ddd;">Item</th>
                  <th style="padding: 8px; text-align: center; font-weight: 600; color: #666; border-bottom: 1px solid #ddd;">Qty</th>
                  <th style="padding: 8px; text-align: right; font-weight: 600; color: #666; border-bottom: 1px solid #ddd;">Price</th>
                  <th style="padding: 8px; text-align: right; font-weight: 600; color: #666; border-bottom: 1px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems && order.orderItems.length > 0 
                  ? order.orderItems.map(item => `
                    <tr>
                      <td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${item.menuItem?.name || 'Item'}</td>
                      <td style="padding: 6px 8px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity || 0}</td>
                      <td style="padding: 6px 8px; text-align: right; border-bottom: 1px solid #eee;">${cs}${Number(item.unitPrice || 0).toFixed(2)}</td>
                      <td style="padding: 6px 8px; text-align: right; border-bottom: 1px solid #eee;">${cs}${Number(item.totalPrice || 0).toFixed(2)}</td>
                    </tr>`).join('') 
                  : '<tr><td colspan="4" style="padding: 6px 8px; text-align: center; color: #999;">No items</td></tr>'
                }
              </tbody>
            </table>
          </div>
        `;
        
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        document.body.appendChild(element);
        
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `order-${order.orderId}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        document.body.removeChild(element);
        break;
        
      case 'xlsx':
        // For XLSX, you'd typically use SheetJS
        // This is a simplified approach for demonstration
        let xlsxContent = `Order ID: ${order.orderId}\nDate: ${order.createdAt}\nCustomer: ${order.customer || 'N/A'}\nTotal: ${order.totalAmount}\nStatus: ${order.status || 'N/A'}\n\nItems:\n`;
        if (order.orderItems && order.orderItems.length > 0) {
          order.orderItems.forEach(item => {
            xlsxContent += `${item.menuItem?.name || 'Item'} x${item.quantity} @ $${item.unitPrice} = $${item.totalPrice}\n`;
          });
        } else {
          xlsxContent += 'No items';
        }
        
        const xlsxBlob = new Blob([xlsxContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const xlsxUrl = URL.createObjectURL(xlsxBlob);
        const xlsxA = document.createElement('a');
        xlsxA.href = xlsxUrl;
        xlsxA.download = `order-${order.orderId}.xlsx`;
        document.body.appendChild(xlsxA);
        xlsxA.click();
        document.body.removeChild(xlsxA);
        URL.revokeObjectURL(xlsxUrl);
        break;
    }
    
    toast.success('Order exported successfully');
  } catch (error) {
    toast.error('Failed to export order');
    console.error('Export error:', error);
  }
};

export const exportOrdersCollection = async (collection: OrderCollectionExportOptions, format: 'xlsx' | 'pdf' | 'jpg', header?: BusinessHeaderInfo) => {
  try {
    // Handle empty collection gracefully
    if (!collection.orders || collection.orders.length === 0) {
      toast.warning('No orders to export');
      return;
    }

    if (header?.logoUrl && !header.logoBase64) {
      header.logoBase64 = await loadLogoAsBase64(header.logoUrl) || undefined;
    }

    const cs = header?.currencySymbol || '$';

    switch(format) {
      case 'pdf':
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const colItem = 70;
        const colQty = 20;
        const colUnit = 35;
        const colTotal = pageWidth - margin - colItem - colQty - colUnit - margin;
        const colX = [margin, margin + colItem, margin + colItem + colQty, margin + colItem + colQty + colUnit];
        const rowHeight = 8;
        const dateStr = new Date().toISOString().slice(0, 10);

        let y = drawHeader(doc, header);

        doc.setFontSize(13);
        doc.text(collection.title || 'Orders Report', margin, y);
        y += 15;

        collection.orders.forEach((order, index) => {
          if (y > 240) {
            doc.addPage();
            y = 15;
          }

          doc.setFontSize(13);
          doc.text(`Order ${index + 1}: ${order.orderId || 'N/A'}`, margin, y);
          y += 7;
          doc.setFontSize(10);
          doc.text(`Date: ${order.createdAt || 'N/A'} | Customer: ${order.customer || 'N/A'} | Status: ${order.status || 'N/A'}`, margin, y);
          y += 10;

          y = drawTableHeader(doc, margin, pageWidth, colX, y, 8);
          doc.setTextColor(0);

          if (order.orderItems && order.orderItems.length > 0) {
            order.orderItems.forEach((item) => {
              if (y > 270) {
                doc.addPage();
                y = drawTableHeader(doc, margin, pageWidth, colX, y, 8);
                doc.setTextColor(0);
              }
              doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'S');
              doc.text(item.menuItem?.name || 'Item', colX[0] + 3, y + 6);
              doc.text(String(item.quantity || 0), colX[1] + 3, y + 6);
              doc.text(`${cs}${Number(item.unitPrice || 0).toFixed(2)}`, colX[2] + 3, y + 6);
              doc.text(`${cs}${Number(item.totalPrice || 0).toFixed(2)}`, colX[3] + 3, y + 6);
              y += rowHeight;
            });
          } else {
            doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'S');
            doc.text('No items', colX[0] + 3, y + 6);
            y += rowHeight;
          }

          doc.setDrawColor(200);
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'F');
          doc.text('Total', colX[0] + 3, y + 6);
          doc.text(`${cs}${Number(order.totalAmount || 0).toFixed(2)}`, colX[3] + 3, y + 6);
          y += rowHeight + 10;
        });

        doc.save(`orders-export-${dateStr}.pdf`);
        break;
        
      case 'jpg':
        const htmlContent = `
          <div style="font-family: Arial, Helvetica, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #eee;">
            <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 2px solid #f59e0b; margin-bottom: 20px;">
              ${header?.logoBase64 ? `<img src="${header.logoBase64}" alt="" style="width: 36px; height: 36px; border-radius: 8px; object-fit: cover;" />` : ''}
              <div>
                <div style="font-size: 18px; font-weight: 700; color: #1a1a1a;">${header?.name || 'Cafe'}</div>
                ${header?.description ? `<div style="font-size: 11px; color: #999;">${header.description}</div>` : ''}
              </div>
            </div>
            <h1 style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0 0 16px;">${collection.title || 'Orders Report'}</h1>
            ${collection.orders.map((order, index) => `
              <div style="margin-bottom: 20px; border: 1px solid #eee; border-radius: 8px; padding: 16px;">
                <h2 style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 0 0 8px;">Order ${index + 1}: ${order.orderId || 'N/A'}</h2>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-bottom: 10px;">
                  <tr><td style="padding: 3px 8px; color: #666; width: 90px;"><strong>Date</strong></td><td style="padding: 3px 8px;">${order.createdAt || 'N/A'}</td></tr>
                  <tr><td style="padding: 3px 8px; color: #666;"><strong>Customer</strong></td><td style="padding: 3px 8px;">${order.customer || 'N/A'}</td></tr>
                  <tr><td style="padding: 3px 8px; color: #666;"><strong>Status</strong></td><td style="padding: 3px 8px;">${order.status || 'N/A'}</td></tr>
                  <tr><td style="padding: 3px 8px; color: #666;"><strong>Total</strong></td><td style="padding: 3px 8px; font-weight: 700;">${cs}${order.totalAmount || 0}</td></tr>
                </table>
                <h3 style="font-size: 13px; font-weight: 600; color: #1a1a1a; margin: 0 0 6px;">Items</h3>
                <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f5f5f5;">
                      <th style="padding: 6px 8px; text-align: left; font-weight: 600; color: #666; border-bottom: 1px solid #ddd;">Item</th>
                      <th style="padding: 6px 8px; text-align: center; font-weight: 600; color: #666; border-bottom: 1px solid #ddd;">Qty</th>
                      <th style="padding: 6px 8px; text-align: right; font-weight: 600; color: #666; border-bottom: 1px solid #ddd;">Price</th>
                      <th style="padding: 6px 8px; text-align: right; font-weight: 600; color: #666; border-bottom: 1px solid #ddd;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.orderItems && order.orderItems.length > 0 
                      ? order.orderItems.map(item => `
                        <tr>
                          <td style="padding: 4px 8px; border-bottom: 1px solid #eee;">${item.menuItem?.name || 'Item'}</td>
                          <td style="padding: 4px 8px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity || 0}</td>
                          <td style="padding: 4px 8px; text-align: right; border-bottom: 1px solid #eee;">${cs}${Number(item.unitPrice || 0).toFixed(2)}</td>
                          <td style="padding: 4px 8px; text-align: right; border-bottom: 1px solid #eee;">${cs}${Number(item.totalPrice || 0).toFixed(2)}</td>
                        </tr>`).join('')
                      : '<tr><td colspan="4" style="padding: 4px 8px; text-align: center; color: #999;">No items</td></tr>'
                    }
                  </tbody>
                </table>
              </div>
            `).join('')}
          </div>
        `;
        
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        document.body.appendChild(element);
        
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `orders-export.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        document.body.removeChild(element);
        break;
        
      case 'xlsx':
        // For XLSX, you'd typically use SheetJS
        // This is a simplified approach for demonstration
        let xlsxContent = `${collection.title || 'Orders Report'}\n\n`;
        collection.orders.forEach(order => {
          xlsxContent += `Order ${order.orderId || 'N/A'}:\n`;
          xlsxContent += `Date: ${order.createdAt || 'N/A'}\n`;
          xlsxContent += `Customer: ${order.customer || 'N/A'}\n`;
          xlsxContent += `Total: ${order.totalAmount || 0}\n`;
          xlsxContent += `Status: ${order.status || 'N/A'}\n`;
          xlsxContent += 'Items:\n';
          
          if (order.orderItems && order.orderItems.length > 0) {
            order.orderItems.forEach(item => {
              xlsxContent += `${item.menuItem?.name || 'Item' || 'N/A'} x${item.quantity || 0} @ $${item.unitPrice || 0} = $${item.totalPrice || 0}\n`;
            });
          } else {
            xlsxContent += 'No items\n';
          }
          xlsxContent += '\n';
        });
        
        const xlsxBlob = new Blob([xlsxContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const xlsxUrl = URL.createObjectURL(xlsxBlob);
        const xlsxA = document.createElement('a');
        xlsxA.href = xlsxUrl;
        xlsxA.download = `orders-export.xlsx`;
        document.body.appendChild(xlsxA);
        xlsxA.click();
        document.body.removeChild(xlsxA);
        URL.revokeObjectURL(xlsxUrl);
        break;
    }
    
    toast.success(`${collection.orders.length} orders exported successfully`);
  } catch (error) {
    toast.error(`Failed to export ${collection.orders.length} orders`);
    console.error('Export error:', error);
  }
};