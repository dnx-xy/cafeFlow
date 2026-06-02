import { CartItem } from '@/hooks/useMenuCart';
import { formatIDR } from './format-idr';

export function generateWhatsAppMessage(
  items: CartItem[],
  tableId: string,
  orderNotes: string,
  cafeName: string,
  phoneNumber?: string,
): string {
  const lines: string[] = ['Halo, saya mau pesan.'];
  lines.push('');
  lines.push(`Cafe: ${cafeName}`);
  lines.push(`Meja: ${tableId}`);
  lines.push('');
  lines.push('Pesanan:');
  items.forEach(item => {
    const custom = item.customization ? Object.values(item.customization).filter(Boolean).join(', ') : '';
    lines.push(`* ${item.name} x${item.quantity}${custom ? ` (${custom})` : ''} = ${formatIDR(item.price * item.quantity)}`);
  });
  if (orderNotes) {
    lines.push('');
    lines.push(`Catatan: ${orderNotes}`);
  }
  lines.push('');
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  lines.push(`Total: ${formatIDR(total)}`);

  const message = encodeURIComponent(lines.join('\n'));
  const wa = phoneNumber || '6281234567890';
  return `https://wa.me/${wa}?text=${message}`;
}
