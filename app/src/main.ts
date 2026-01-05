import './styles.css';
import type { RequestItem, ComputeResult, Direction, Kind } from './types';
import { parseComputeResult } from './utils/compute';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      node.setAttribute(k, v);
    }
  }
  return node;
}

function createApp(root: HTMLElement): void {
  const state: { items: RequestItem[]; result: ComputeResult } = {
    items: [],
    result: { status: 'IDLE' }
  };

  const container = el('div', { class: 'container', 'data-testid': 'request-form' });
  const title = el('h1');
  title.textContent = 'Request Form';

  const toolbar = el('div', { class: 'toolbar' });

  const newTicketBtn = el('button', { type: 'button', 'data-testid': 'new-request' });
  newTicketBtn.textContent = 'New request';

  const addLegBtn = el('button', { type: 'button', 'data-testid': 'add-item' });
  addLegBtn.textContent = 'Add item';

  const priceBtn = el('button', { type: 'button', 'data-testid': 'compute' });
  priceBtn.textContent = 'Compute';

  toolbar.append(newTicketBtn, addLegBtn, priceBtn);

  const table = el('table', { 'data-testid': 'items-table' });
  const thead = el('thead');
  const headRow = el('tr');
  for (const h of ['Direction', 'Category', 'Value', 'Date', 'Quantity', 'Remove']) {
    const th = el('th');
    th.textContent = h;
    headRow.append(th);
  }
  thead.append(headRow);

  const tbody = el('tbody', { 'data-testid': 'items-body' });
  table.append(thead, tbody);

  const resultsPanel = el('div', { class: 'panel', 'data-testid': 'compute-results' });
  const resultsTitle = el('div');
  resultsTitle.textContent = 'Results';
  const kv = el('div', { class: 'kv' });

  const kStatus = el('div');
  kStatus.textContent = 'Status';
  const vStatus = el('div', { 'data-testid': 'result-status' });

  const kPv = el('div');
  kPv.textContent = 'Value';
  const vPv = el('div', { 'data-testid': 'result-value' });

  const kError = el('div');
  kError.textContent = 'Error';
  const vError = el('div', { 'data-testid': 'result-error' });

  kv.append(kStatus, vStatus, kPv, vPv, kError, vError);
  resultsPanel.append(resultsTitle, kv);

  function renderResults(): void {
    vStatus.textContent = state.result.status;
    vPv.textContent = state.result.pv !== undefined ? String(state.result.pv) : '';
    vError.textContent = state.result.error ?? '';
  }

  function renderLegs(): void {
    tbody.textContent = '';

    state.items.forEach((item, idx) => {
      const row = el('tr', { 'data-testid': `item-row-${idx}` });

      const sideSel = el('select', { 'data-testid': `item-side-${idx}` });
      const sideIn = el('option');
      sideIn.value = 'IN';
      sideIn.textContent = 'IN';
      const sideOut = el('option');
      sideOut.value = 'OUT';
      sideOut.textContent = 'OUT';
      sideSel.append(sideIn, sideOut);
      sideSel.value = item.side;

      sideSel.addEventListener('change', () => {
        const v = sideSel.value;
        if (v === 'IN' || v === 'OUT') {
          item.side = v as Direction;
        }
      });

      const typeSel = el('select', { 'data-testid': `item-type-${idx}` });
      const aOpt = el('option');
      aOpt.value = 'A';
      aOpt.textContent = 'A';
      const bOpt = el('option');
      bOpt.value = 'B';
      bOpt.textContent = 'B';
      typeSel.append(aOpt, bOpt);
      typeSel.value = item.type;

      typeSel.addEventListener('change', () => {
        const v = typeSel.value;
        if (v === 'A' || v === 'B') {
          item.type = v as Kind;
        }
      });

      const strikeInput = el('input', { type: 'number', 'data-testid': `item-strike-${idx}` });
      strikeInput.value = String(item.strike);
      strikeInput.addEventListener('input', () => {
        const n = Number(strikeInput.value);
        if (Number.isFinite(n)) {
          item.strike = n;
        }
      });

      const expiryInput = el('input', { type: 'date', 'data-testid': `item-expiry-${idx}` });
      expiryInput.value = item.expiry;
      expiryInput.addEventListener('input', () => {
        item.expiry = expiryInput.value;
      });

      const qtyInput = el('input', { type: 'number', 'data-testid': `item-qty-${idx}` });
      qtyInput.value = String(item.quantity);
      qtyInput.addEventListener('input', () => {
        const n = Number(qtyInput.value);
        if (Number.isFinite(n)) {
          item.quantity = n;
        }
      });

      const removeBtn = el('button', { type: 'button', 'data-testid': `item-remove-${idx}` });
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        state.items.splice(idx, 1);
        renderLegs();
      });

      const tdSide = el('td');
      tdSide.append(sideSel);
      const tdType = el('td');
      tdType.append(typeSel);
      const tdStrike = el('td');
      tdStrike.append(strikeInput);
      const tdExpiry = el('td');
      tdExpiry.append(expiryInput);
      const tdQty = el('td');
      tdQty.append(qtyInput);
      const tdRemove = el('td');
      tdRemove.append(removeBtn);

      row.append(tdSide, tdType, tdStrike, tdExpiry, tdQty, tdRemove);
      tbody.append(row);
    });
  }

  function reset(): void {
    state.items = [];
    state.result = { status: 'IDLE' };
    renderLegs();
    renderResults();
  }

  async function price(): Promise<void> {
    if (state.items.length === 0) {
      state.result = { status: 'FAILED', error: 'No items' };
      renderResults();
      return;
    }

    state.result = { status: 'PRICING' };
    renderResults();

    try {
      const response = await fetch('http://service.local/compute', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items: state.items })
      });

      const data: unknown = await response.json();
      state.result = parseComputeResult(data);
      renderResults();
    } catch (e: unknown) {
      state.result = {
        status: 'FAILED',
        error: e instanceof Error ? e.message : 'Unknown error'
      };
      renderResults();
    }
  }

  newTicketBtn.addEventListener('click', () => reset());

  addLegBtn.addEventListener('click', () => {
    state.items.push({
      side: 'IN',
      type: 'A',
      strike: 100,
      expiry: '2026-06-01',
      quantity: 1
    });
    renderLegs();
  });

  priceBtn.addEventListener('click', () => void price());

  reset();

  container.append(title, toolbar, table, resultsPanel);
  root.append(container);
}

const mount = document.getElementById('app');
if (!mount) {
  throw new Error('Missing app root');
}
createApp(mount);
