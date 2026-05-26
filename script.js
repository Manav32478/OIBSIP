const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let current = '';
let prev = null;
let op = null;

function updateDisplay(v){ display.textContent = v; }
// Also update accessible label for screen readers
function setA11yDisplay(v){
  try{ display.setAttribute('aria-label', 'Calculator display: ' + v); }catch(e){}
}

function compute(a, b, operator){
  a = parseFloat(a); b = parseFloat(b);
  if(isNaN(a) || isNaN(b)) return '';
  switch(operator){
    case 'add': return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide': return b === 0 ? 'Error' : a / b;
    case 'percent': return (a * b) / 100;
  }
}

keys.addEventListener('click', e => {
  const t = e.target;
  if(!t.matches('button')) return;

  if(t.classList.contains('num')){
    const n = t.dataset.num;
    if(n === '.' && current.includes('.')) return;
    if(current === '0' && n !== '.') current = n; else current = current + n;
    updateDisplay(current);
    setA11yDisplay(current);
    return;
  }

  const action = t.dataset.action;
  if(action === 'clear'){
    current = '';
    prev = null; op = null; updateDisplay('0'); setA11yDisplay('0'); return;
  }
  if(action === 'back'){
    current = current.slice(0,-1);
    updateDisplay(current || '0'); setA11yDisplay(current || '0'); return;
  }
  if(action === 'percent'){
    if(current){ current = String(parseFloat(current)/100); updateDisplay(current); setA11yDisplay(current);} return;
  }

  if(action === 'equals'){
    if(prev != null && op && current !== ''){
      const res = compute(prev, current, op);
      current = String(res);
      prev = null; op = null;
      updateDisplay(current);
      setA11yDisplay(current);
    }
    return;
  }

  // operator buttons
  if(['add','subtract','multiply','divide'].includes(action)){
    if(current === '' && prev == null) return;
    if(prev == null){ prev = current || '0'; current = ''; op = action; updateDisplay(prev); setA11yDisplay(prev); }
    else if(current !== ''){ const res = compute(prev, current, op); prev = String(res); current = ''; op = action; updateDisplay(prev); setA11yDisplay(prev);} else { op = action; }
  }
});

// keyboard support
window.addEventListener('keydown', e => {
  const k = e.key;
  if((/\d/).test(k)) document.querySelector(`button[data-num="${k}"]`)?.click();
  if(k === '.') document.querySelector(`button[data-num="."]`)?.click();
  if(k === 'Enter' || k === '=') document.querySelector(`button[data-action="equals"]`)?.click();
  if(k === 'Backspace') document.querySelector(`button[data-action="back"]`)?.click();
  if(k === 'c' || k === 'C') document.querySelector(`button[data-action="clear"]`)?.click();
  if(k === '+') document.querySelector(`button[data-action="add"]`)?.click();
  if(k === '-') document.querySelector(`button[data-action="subtract"]`)?.click();
  if(k === '*') document.querySelector(`button[data-action="multiply"]`)?.click();
  if(k === '/') document.querySelector(`button[data-action="divide"]`)?.click();
});
