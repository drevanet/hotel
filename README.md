# Velora Hotel — Next.js + Tailwind + Paystack

A responsive hotel website starter with homepage, room/suite packages, amenities, offers, location/directions, contact form, and a booking checkout flow. Room rates are displayed in USD; checkout charges NGN using a configurable business-approved exchange rate. Payment confirmation is verified server-side through Paystack, and a booking receipt is emailed using Resend.

## Included
- Next.js App Router + TypeScript + Tailwind CSS v4
- Four room packages with USD per-night rates and Unsplash-hosted room photography
- Booking form with date, guest, room and contact validation
- Paystack NGN transaction initialization, verification, and signed webhook endpoint
- PostgreSQL + Prisma booking records
- Receipt email on verified successful payment; contact enquiry email
- Responsive navigation and dedicated pages for Rooms, Amenities, Offers, Location, and Contact

## Requirements
- Node.js 20.9+
- PostgreSQL database (Neon, Supabase, Railway, etc.)
- Paystack account/API keys
- Resend account and a verified sender domain/address

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set every required value.
3. Create a PostgreSQL database and set `DATABASE_URL`.
4. Generate Prisma client and create the schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the app:
   ```bash
   npm run dev
   ```
6. Visit `http://localhost:3000` and test with Paystack **test** keys first.

## Environment variables
- `PAYSTACK_SECRET_KEY`: server-only Paystack secret. Never use a secret key in a `NEXT_PUBLIC_` variable.
- `NEXT_PUBLIC_SITE_URL`: canonical site URL, e.g. `http://localhost:3000` locally and your HTTPS domain in production.
- `USD_TO_NGN`: configured NGN amount for one USD. The operator must update this rate when appropriate. This starter does not fetch FX rates automatically.
- `NEXT_PUBLIC_DISPLAY_RATE`: same number as `USD_TO_NGN`, used only for the checkout estimate shown in the browser.
- `DATABASE_URL`: persistent PostgreSQL connection string.
- `RESEND_API_KEY`, `RECEIPT_FROM_EMAIL`: send receipts and contact emails. The sender must be verified by Resend.
- `NEXT_PUBLIC_HOTEL_EMAIL`, `NEXT_PUBLIC_HOTEL_PHONE`, `NEXT_PUBLIC_HOTEL_ADDRESS`: actual property contact details and address. `NEXT_PUBLIC_HOTEL_EMAIL` receives contact enquiries.

## Paystack setup
1. Add `https://YOUR_DOMAIN/api/paystack/webhook` as a webhook URL in your Paystack dashboard.
2. Keep Paystack keys in server environment variables only. Use test mode before going live.
3. The success page calls `/api/paystack/verify`, which checks the reference, transaction status, currency, and exact amount against the database. The webhook independently validates Paystack's HMAC SHA-512 signature and checks the amount/currency.
4. The receipt email is sent after a verified successful payment. Configure Resend sender DNS/domain first.

## Before using for real hotel reservations
This is a source-code starter, not a fully operational property-management system. It does **not** yet check live room inventory, prevent overlapping bookings, automatically apply offer discounts, calculate local taxes, issue refunds, or provide an admin dashboard. Add inventory/availability locking and a cancellation/refund policy before taking live bookings. Email retry/idempotency should be hardened for production (e.g. transactional outbox/queue) so transient mail failures can be retried without duplicate receipts. Confirm the legal business name, property address, rates, taxes, currency conversion policy and consumer terms. Replace the sample room photography with images you own or are licensed to use; Unsplash URLs are remote and may change.

## Deployment
Deploy on Vercel or another Node-compatible host. Configure all environment variables and a persistent hosted PostgreSQL database in the hosting dashboard. Build command is `prisma generate && next build`. Do not select `public` as the output directory; Next.js manages its own build output. Add your production domain to `NEXT_PUBLIC_SITE_URL` and configure the Paystack webhook after deployment.

## Updated visual design and suite galleries

The site now uses a modern editorial design system with warm ivory surfaces, deep charcoal-green, muted champagne accents, oversized typography and generous spacing. Each room type has a multi-image carousel with previous/next controls and pagination dots. Images are remote Unsplash URLs and should be replaced with property-owned or properly licensed room photography before launch.

## Optional cab transfer booking

Guests can add a private transfer during the hotel booking checkout. The add-on includes vehicle choice, pickup and destination addresses, pickup date/time, and cab fare in the total Paystack amount. The default sample fares are configured server-side in `app/api/bookings/initialize/route.ts`:

- Private sedan: NGN 25,000
- Executive SUV: NGN 40,000
- Premium van: NGN 65,000

These are illustrative fares. Update them to match your actual transfer service and availability. The transfer is stored with the hotel booking and included in the email receipt. It is currently a booking request/add-on, not a dispatch integration with a live cab fleet or driver-tracking provider.

After adding the new Prisma fields, run `npx prisma generate` and `npx prisma db push` against your configured database before testing the booking flow.
