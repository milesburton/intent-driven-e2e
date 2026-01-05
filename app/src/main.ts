import './styles.css';
import type { OptionLeg, PricingResult, Side, OptionType } from './types';
import { parsePricingResult } from './utils/pricing';

type JsonObject = Record<string, unknown>;

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
  const state: { legs: OptionLeg[]; result: PricingResult } = {
    legs: [],
    result: { status: 'IDLE' }
  };

  const container = el('div', { class: 'container', 'data-testid': 'trade-ticket' });
  const title = el('h1');
  title.textContent = 'Trade Ticket (Options)';

  const toolbar = el('div', { class: 'toolbar' });

  const newTicketBtn = el('button', { type: 'button', 'data-testid': 'new-ticket' });
  newTicketBtn.textContent = 'New ticket';

  const addLegBtn = el('button', { type: 'button', 'data-testid': 'add-leg' });
  addLegBtn.textContent = 'Add option leg';

  const priceBtn = el('button', { type: 'button', 'data-testid': 'price' });
  priceBtn.textContent = 'Price';

  toolbar.append(newTicketBtn, addLegBtn, priceBtn);

  const table = el('table', { 'data-testid': 'legs-table' });
  const thead = el('thead');
  const headRow = el('tr');
  for (const h of ['Side', 'Type', 'Strike', 'Expiry', 'Quantity', 'Remove']) {
    const th = el('th');
    th.textContent = h;
    headRow.append(th);
  }
  thead.append(headRow);

  const tbody = el('tbody', { 'data-testid': 'legs-body' });
  table.append(thead, tbody);

  const resultsPanel = el('div', { class: 'panel', 'data-testid': 'pricing-results' });
  const resultsTitle = el('div');
  resultsTitle.textContent = 'Pricing';
  const kv = el('div', { class: 'kv' });

  const kStatus = el('div');
  kStatus.textContent = 'Status';
  const vStatus = el('div', { 'data-testid': 'pricing-status' });

  const kPv = el('div');
  kPv.textContent = 'PV';
  const vPv = el('div', { 'data-testid': 'pricing-pv' });

  const kError = el('div');
  kError.textContent = 'Error';
  const vError = el('div', { 'data-testid': 'pricing-error' });

  kv.append(kStatus, vStatus, kPv, vPv, kError, vError);
  resultsPanel.append(resultsTitle, kv);

  function renderResults(): void {
    vStatus.textContent = state.result.status;
    vPv.textContent = state.result.pv !== undefined ? String(state.result.pv) : '';
    vError.textContent = state.result.error ?? '';
  }

  function renderLegs(): void {
    tbody.textContent = '';

    state.legs.forEach((leg, idx) => {
      const row = el('tr', { 'data-testid': `leg-row-${idx}` });

      const sideSel = el('select', { 'data-testid': `leg-side-${idx}` });
      const sideBuy = el('option');
      sideBuy.value = 'BUY';
      sideBuy.textContent = 'BUY';
      const sideSell = el('option');
      sideSell.value = 'SELL';
      sideSell.textContent = 'SELL';
      sideSel.append(sideBuy, sideSell);
      sideSel.value = leg.side;

      sideSel.addEventListener('change', () => {
        const v = sideSel.value;
        if (v === 'BUY' || v === 'SELL') {
          leg.side = v as Side;
        }
      });

      const typeSel = el('select', { 'data-testid': `leg-type-${idx}` });
      const callOpt = el('option');
      callOpt.value = 'CALL';
      callOpt.textContent = 'CALL';
      const putOpt = el('option');
      putOpt.value = 'PUT';
      putOpt.textContent = 'PUT';
      typeSel.append(callOpt, putOpt);
      typeSel.value = leg.type;

      typeSel.addEventListener('change', () => {
        const v = typeSel.value;
        if (v === 'CALL' || v === 'PUT') {
          leg.type = v as OptionType;
        }
      });

      const strikeInput = el('input', { type: 'number', 'data-testid': `leg-strike-${idx}` });
      strikeInput.value = String(leg.strike);
      strikeInput.addEventListener('input', () => {
        const n = Number(strikeInput.value);
        if (Number.isFinite(n)) {
          leg.strike = n;
        }
      });

      const expiryInput = el('input', { type: 'date', 'data-testid': `leg-expiry-${idx}` });
      expiryInput.value = leg.expiry;
      expiryInput.addEventListener('input', () => {
        leg.expiry = expiryInput.value;
      });

      const qtyInput = el('input', { type: 'number', 'data-testid': `leg-qty-${idx}` });
      qtyInput.value = String(leg.quantity);
      qtyInput.addEventListener('input', () => {
        const n = Number(qtyInput.value);
        if (Number.isFinite(n)) {
          leg.quantity = n;
        }
      });

      const removeBtn = el('button', { type: 'button', 'data-testid': `leg-remove-${idx}` });
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        state.legs.splice(idx, 1);
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
    state.legs = [];
    state.result = { status: 'IDLE' };
    renderLegs();
    renderResults();
  }

  async function price(): Promise<void> {
    if (state.legs.length === 0) {
      state.result = { status: 'FAILED', error: 'No legs' };
      renderResults();
      return;
    }

    state.result = { status: 'PRICING' };
    renderResults();

    try {
      const response = await fetch('http://pricing.acmibank/price', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ legs: state.legs })
      });

      const data: unknown = await response.json();
      state.result = parsePricingResult(data);
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
    state.legs.push({
      side: 'BUY',
      type: 'CALL',
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
