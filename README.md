# Moolchand's Grocery Store - Website

## How to open it in VS Code
1. Install VS Code (code.visualstudio.com).
2. Unzip this folder, then in VS Code: File > Open Folder > choose `moolchands-website`.
3. Install the extension **Live Server** (Extensions icon on the left, search "Live Server").
4. Right-click `index.html` > **Open with Live Server**. The shop opens in your browser.
   (You can also just double-click `index.html`.)

## Change your shop details
Open `js/config.js` and edit:
- `WA_NUMBER`  - your WhatsApp number with country code, no + or spaces (example: 919876543210)
- `PHONE_TEXT` - phone number shown on the website
- `ADDRESS`    - your shop address
- `MAPS_LINK`  - your Google Maps link

## Owner panel
Click **Owner panel** on the website. Demo password: `moolchand123`
(change it in `js/app.js`, search for `moolchand123`).
There you can change stock (+ / -), prices, add or delete products, upload product photos, and see orders.

## Files
- `index.html` - page structure
- `css/style.css` - colours and design (change colours at the top, `:root`)
- `js/config.js` - your shop details
- `js/app.js` - products, cart, WhatsApp order, owner panel

## Note
This version saves data in the browser (localStorage), so stock changes are visible only on that
computer/browser. To share one stock with all customers, the Node.js backend version is needed.
