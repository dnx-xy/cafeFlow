import { CartItem } from '@/hooks/useMenuCart';

export function generateWhatsAppMessage(
  items: CartItem[],
  tableId: string,
  orderNotes: string,
  cafeName: string,
  phoneNumber?: string,
): string {
  const lines: string[] = ['Hello.'];
  lines.push('');
  lines.push(`Cafe: ${cafeName}`);
  lines.push(`Table: ${tableId}`);
  lines.push('');
  lines.push('Order:');
  items.forEach(item => {
    const custom = item.customization ? Object.values(item.customization).filter(Boolean).join(', ') : '';
    lines.push(`* ${item.name} x${item.quantity}${custom ? ` (${custom})` : ''}`);
  });
  if (orderNotes) {
    lines.push('');
    lines.push(`Notes: ${orderNotes}`);
  }
  lines.push('');
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  lines.push(`Total: $${total.toFixed(2)}`);

  const message = encodeURIComponent(lines.join('\n'));
  const wa = phoneNumber || '6281234567890';
  return `https://wa.me/${wa}?text=${message}`;
}
