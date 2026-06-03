// src/lib/orderExportUtils.ts
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface OrderExportOptions {
  orderId: string;
  items: any[];
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

export const exportOrder = async (order: OrderExportOptions, format: 'csv' | 'xlsx' | 'pdf' | 'jpg') => {
  try {
    switch(format) {
      case 'csv':
        // Create CSV content
        let csvContent = `"Order ID","Date","Customer","Total","Status"\n"${order.orderId}","${order.createdAt}","${order.customer || 'N/A'}","${order.totalAmount}","${order.status || 'N/A'}"`;
        csvContent += `\n\nItems:\n`;
        if (order.items && order.items.length > 0) {
          order.items.forEach(item => {
            csvContent += `"${item.itemName}","${item.quantity}","${item.unitPrice}","${item.totalPrice}"\n`;
          });
        } else {
          csvContent += '"No items"';
        }
        
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvA = document.createElement('a');
        csvA.href = csvUrl;
        csvA.download = `order-${order.orderId}.csv`;
        document.body.appendChild(csvA);
        csvA.click();
        document.body.removeChild(csvA);
        URL.revokeObjectURL(csvUrl);
        break;
        
      case 'pdf':
        // Create PDF using jsPDF
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text(`Order Report`, 20, 20);
        doc.setFontSize(16);
        doc.text(`Order ID: ${order.orderId}`, 20, 30);
        doc.text(`Date: ${order.createdAt}`, 20, 40);
        doc.text(`Customer: ${order.customer || 'N/A'}`, 20, 50);
        doc.text(`Total: $${order.totalAmount}`, 20, 60);
        doc.text(`Status: ${order.status || 'N/A'}`, 20, 70);
        
        // Add items
        doc.setFontSize(12);
        doc.text('Items:', 20, 80);
        let yPos = 90;
        if (order.items && order.items.length > 0) {
          order.items.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.itemName} x${item.quantity} @ $${item.unitPrice} = $${item.totalPrice}`, 20, yPos);
            yPos += 10;
          });
        } else {
          doc.text('No items', 20, 90);
        }
        
        doc.save(`order-${order.orderId}.pdf`);
        break;
        
      case 'jpg':
        // Create JPG using html2canvas
        // For demonstration, we'll create a simple HTML representation
        const htmlContent = `
          <div style="font-family: Arial; padding: 20px;">
            <h1>Order Report</h1>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Date:</strong> ${order.createdAt}</p>
            <p><strong>Customer:</strong> ${order.customer || 'N/A'}</p>
            <p><strong>Total:</strong> $${order.totalAmount}</p>
            <p><strong>Status:</strong> ${order.status || 'N/A'}</p>
            <h2>Items:</h2>
            <ul>
              ${order.items && order.items.length > 0 
                ? order.items.map(item => `<li>${item.itemName} x${item.quantity} @ $${item.unitPrice} = $${item.totalPrice}</li>`).join('') 
                : '<li>No items</li>'
              }
            </ul>
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
        if (order.items && order.items.length > 0) {
          order.items.forEach(item => {
            xlsxContent += `${item.itemName} x${item.quantity} @ $${item.unitPrice} = $${item.totalPrice}\n`;
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

export const exportOrdersCollection = async (collection: OrderCollectionExportOptions, format: 'csv' | 'xlsx' | 'pdf' | 'jpg') => {
  try {
    // Handle empty collection gracefully
    if (!collection.orders || collection.orders.length === 0) {
      toast.warning('No orders to export');
      return;
    }
    
    switch(format) {
      case 'csv':
        // Create CSV content for multiple orders
        let csvContent = `"Order ID","Date","Customer","Total","Status"\n`;
        collection.orders.forEach(order => {
          csvContent += `"${order.orderId || 'N/A'}","${order.createdAt || 'N/A'}","${order.customer || 'N/A'}","${order.totalAmount || 0}","${order.status || 'N/A'}"\n`;
        });
        
        csvContent += `\n\nDetailed Data:\n`;
        collection.orders.forEach(order => {
          csvContent += `Order ${order.orderId || 'N/A'}:\n`;
          if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
              csvContent += `"${item.itemName || 'N/A'}","${item.quantity || 0}","${item.unitPrice || 0}","${item.totalPrice || 0}"\n`;
            });
          } else {
            csvContent += '"No items"\n';
          }
          csvContent += '\n';
        });
        
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvA = document.createElement('a');
        csvA.href = csvUrl;
        csvA.download = `orders-export.csv`;
        document.body.appendChild(csvA);
        csvA.click();
        document.body.removeChild(csvA);
        URL.revokeObjectURL(csvUrl);
        break;
        
      case 'pdf':
        // Create PDF using jsPDF for multiple orders
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text(`${collection.title || 'Orders Report'}`, 20, 20);
        
        let yPos = 30;
        collection.orders.forEach((order, index) => {
          if (yPos > 280) { // Page break
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(16);
          doc.text(`Order ${index + 1}: ${order.orderId || 'N/A'}`, 20, yPos);
          yPos += 10;
          
          doc.setFontSize(12);
          doc.text(`Date: ${order.createdAt || 'N/A'}`, 20, yPos);
          yPos += 8;
          doc.text(`Customer: ${order.customer || 'N/A'}`, 20, yPos);
          yPos += 8;
          doc.text(`Total: $${order.totalAmount || 0}`, 20, yPos);
          yPos += 8;
          doc.text(`Status: ${order.status || 'N/A'}`, 20, yPos);
          yPos += 10;
          
          doc.text('Items:', 20, yPos);
          yPos += 8;
          
          if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
              if (yPos > 280) { // Page break
                doc.addPage();
                yPos = 20;
              }
              doc.text(`  - ${item.itemName || 'N/A'} x${item.quantity || 0} @ $${item.unitPrice || 0} = $${item.totalPrice || 0}`, 20, yPos);
              yPos += 8;
            });
          } else {
            doc.text('  No items', 20, yPos);
            yPos += 8;
          }
          yPos += 10;
        });
        
        doc.save(`orders-export.pdf`);
        break;
        
      case 'jpg':
        // Create JPG for collection using html2canvas
        const htmlContent = `
          <div style="font-family: Arial; padding: 20px;">
            <h1>${collection.title || 'Orders Report'}</h1>
            ${collection.orders.map((order, index) => `
              <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                <h2>Order ${index + 1}: ${order.orderId || 'N/A'}</h2>
                <p><strong>Date:</strong> ${order.createdAt || 'N/A'}</p>
                <p><strong>Customer:</strong> ${order.customer || 'N/A'}</p>
                <p><strong>Total:</strong> $${order.totalAmount || 0}</p>
                <p><strong>Status:</strong> ${order.status || 'N/A'}</p>
                <h3>Items:</h3>
                <ul>
                  ${order.items && order.items.length > 0 
                    ? order.items.map(item => `<li>${item.itemName || 'N/A'} x${item.quantity || 0} @ $${item.unitPrice || 0} = $${item.totalPrice || 0}</li>`).join('')
                    : '<li>No items</li>'
                  }
                </ul>
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
          
          if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
              xlsxContent += `${item.itemName || 'N/A'} x${item.quantity || 0} @ $${item.unitPrice || 0} = $${item.totalPrice || 0}\n`;
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