const result = document.getElementById('result');
const historyEl = document.getElementById('history');
const keys = document.querySelector('.keys');

let expression = '';
let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');

function updateDisplay(){
  result.value = expression || '0';
  historyEl.textContent = history.slice(-1)[0] || '';
}

function safeEval(expr){
  // Eval limitado: reemplaza símbolos por JS válidos
  try{
    const sanitized = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/%/g,'/100');
    // NO usar eval en producción; aquí para demo local.
    const val = Function('"use strict";return (' + sanitized + ')')();
    return val;
  }catch(e){
    return 'Error';
  }
}

keys.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const val = btn.dataset.value;
  const action = btn.dataset.action;

  if(action === 'clear'){ expression=''; updateDisplay(); return; }
  if(action === 'del'){ expression = expression.slice(0,-1); updateDisplay(); return; }
  if(action === 'equal'){
    const res = safeEval(expression);
    history.push(`${expression} = ${res}`);
    localStorage.setItem('calcHistory', JSON.stringify(history));
    expression = String(res);
    updateDisplay();
    return;
  }
  // numbers or operators
  expression += val;
  updateDisplay();
});

// keys with keyboard
window.addEventListener('keydown', e=>{
  const allowed = "0123456789.+-*/%";
  if(allowed.includes(e.key)){
    expression += e.key;
    updateDisplay();
  } else if(e.key === 'Enter'){ 
    const res = safeEval(expression);
    history.push(`${expression} = ${res}`);
    localStorage.setItem('calcHistory', JSON.stringify(history));
    expression = String(res);
    updateDisplay();
  } else if(e.key === 'Backspace'){ expression = expression.slice(0,-1); updateDisplay(); }
  else if(e.key === 'Escape'){ expression=''; updateDisplay(); }
});

updateDisplay();
