import { Resend } from 'resend';
import type { Booking } from '@prisma/client';
export async function sendBookingReceipt(booking: Booking) {
  if (!process.env.RESEND_API_KEY || !process.env.RECEIPT_FROM_EMAIL) throw new Error('Receipt email is not configured');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const money = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(booking.amountNaira);
  const date = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const result = await resend.emails.send({
    from: process.env.RECEIPT_FROM_EMAIL, to: booking.email,
    subject: `Booking confirmed — ${booking.reference}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#1f2937"><div style="background:#163b32;color:white;padding:28px"><p style="letter-spacing:3px">VELORA HOTEL</p><h1>You're confirmed.</h1><p>Thank you, ${escapeHtml(booking.fullName)}. We look forward to welcoming you.</p></div><div style="padding:28px;border:1px solid #e5e7eb"><h2>Booking receipt</h2><p><b>Booking reference:</b> ${escapeHtml(booking.reference)}</p><p><b>Room:</b> ${escapeHtml(booking.roomName)}</p><p><b>Check-in:</b> ${date(booking.checkIn)}</p><p><b>Check-out:</b> ${date(booking.checkOut)}</p><p><b>Guests:</b> ${booking.guests}</p><p><b>Nights:</b> ${booking.nights}</p>${booking.cabService ? `<hr/><h3>Private cab transfer</h3><p><b>Vehicle:</b> ${escapeHtml(booking.cabType || 'Private cab')}</p><p><b>Pickup:</b> ${escapeHtml(booking.cabPickup || '')}</p><p><b>Destination:</b> ${escapeHtml(booking.cabDropoff || '')}</p><p><b>Pickup time:</b> ${booking.cabPickupTime ? date(booking.cabPickupTime) + ' ' + booking.cabPickupTime.toISOString().slice(11,16) + ' UTC' : 'To be confirmed'}</p><p><b>Transfer fare:</b> ${new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(booking.cabAmountNaira)}</p>` : ''}<hr/><h2>Total paid: ${money}</h2><p><b>Payment status:</b> PAID</p><p>Please keep this email for your records. Contact the hotel if you need to amend your stay.</p></div><p style="color:#6b7280;font-size:12px">This receipt was sent automatically after payment confirmation.</p></div>`
  });
  if (result.error) throw new Error(result.error.message);
}
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c] || c)); }
