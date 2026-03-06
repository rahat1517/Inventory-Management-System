/* =========================================
   InventoryPro — Global JavaScript
   ========================================= */

// ── SET TODAY'S DATE everywhere ──
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('topbarDate');
  if (el) {
    const opts = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    el.textContent = new Date().toLocaleDateString('en-GB', opts);
  }

  // Set default date inputs to today
  document.querySelectorAll('input[type="date"].today').forEach(inp => {
    inp.value = new Date().toISOString().split('T')[0];
  });

  // Auto-dismiss flash messages
  setTimeout(() => {
    document.querySelectorAll('.flash').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-6px)';
      el.style.transition = 'all .3s';
      setTimeout(() => el.remove(), 300);
    });
  }, 4500);
});

// ── MODALS ──
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── FLASH CLOSE BUTTON ──
document.addEventListener('click', e => {
  if (e.target.classList.contains('flash-close') || e.target.closest('.flash-close')) {
    const flash = e.target.closest('.flash');
    if (flash) flash.remove();
  }
});

// ── MOBILE SIDEBAR TOGGLE ──
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}

// ── PURCHASE INVOICE: Dynamic rows ──
function addPurchaseRow() {
  const tbody = document.getElementById('purchaseRows');
  if (!tbody) return;
  const clone = tbody.querySelector('.purchase-row').cloneNode(true);
  clone.querySelectorAll('input').forEach(inp => {
    inp.value = inp.classList.contains('row-qty') ? '1' : '0.00';
  });
  clone.querySelector('select').value = '';
  tbody.appendChild(clone);
}

function removePurchaseRow(btn) {
  const rows = document.querySelectorAll('.purchase-row');
  if (rows.length > 1) {
    btn.closest('tr').remove();
    updatePurchaseTotal();
  }
}

function purchaseProductChange(sel) {
  const row = sel.closest('tr');
  const opt = sel.options[sel.selectedIndex];
  const cost = parseFloat(opt.dataset.cost) || 0;
  if (cost > 0) row.querySelector('.row-cost').value = cost.toFixed(2);
  calcPurchaseRow(row.querySelector('.row-qty'));
}

function calcPurchaseRow(inp) {
  const row  = inp.closest('tr');
  const qty  = parseFloat(row.querySelector('.row-qty').value)  || 0;
  const cost = parseFloat(row.querySelector('.row-cost').value) || 0;
  row.querySelector('.row-total').value = (qty * cost).toFixed(2);
  updatePurchaseTotal();
}

function updatePurchaseTotal() {
  let total = 0;
  document.querySelectorAll('.row-total').forEach(el => total += parseFloat(el.value) || 0);
  const el = document.getElementById('purchaseGrandTotal');
  if (el) el.textContent = '৳' + total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}

// ── SALE INVOICE: Dynamic rows ──
function addSaleRow() {
  const tbody = document.getElementById('saleRows');
  if (!tbody) return;
  const clone = tbody.querySelector('.sale-row').cloneNode(true);
  clone.querySelectorAll('input').forEach(inp => {
    if (inp.classList.contains('row-qty')) inp.value = '1';
    else if (inp.classList.contains('row-avail')) inp.value = '—';
    else inp.value = '0.00';
  });
  clone.querySelector('select').value = '';
  tbody.appendChild(clone);
}

function removeSaleRow(btn) {
  const rows = document.querySelectorAll('.sale-row');
  if (rows.length > 1) {
    btn.closest('tr').remove();
    updateSaleTotal();
  }
}

function saleProductChange(sel) {
  const row   = sel.closest('tr');
  const opt   = sel.options[sel.selectedIndex];
  const price = parseFloat(opt.dataset.price) || 0;
  const stock = opt.dataset.stock;
  row.querySelector('.row-price').value = price.toFixed(2);
  row.querySelector('.row-avail').value = stock !== undefined ? stock : '—';
  calcSaleRow(row.querySelector('.row-qty'));
}

function calcSaleRow(inp) {
  const row   = inp.closest('tr');
  const qty   = parseFloat(row.querySelector('.row-qty').value)   || 0;
  const price = parseFloat(row.querySelector('.row-price').value) || 0;
  row.querySelector('.row-total').value = (qty * price).toFixed(2);
  updateSaleTotal();
}

function updateSaleTotal() {
  let total = 0;
  document.querySelectorAll('.row-total').forEach(el => total += parseFloat(el.value) || 0);
  const el = document.getElementById('saleGrandTotal');
  if (el) el.textContent = '৳' + total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}
