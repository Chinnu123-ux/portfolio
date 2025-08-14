// Modal control
document.getElementById('profilePhoto').addEventListener('click',()=>{
  document.getElementById('profileModal').classList.add('show');
});
function closeModal(id){ document.getElementById(id).classList.remove('show'); }

function startGame(gameName){
  const mount=document.getElementById('gameMount');
  const title=document.getElementById('gameTitle');
  mount.innerHTML=''; 
  document.getElementById('gameModal').classList.add('show');

  // MEMORY GAME
  if(gameName==='memory'){
    title.textContent='Memory Game';
    let moves=0, matched=0;
    const movesDisplay=document.createElement('p');
    movesDisplay.className='text-yellow-400 font-semibold';
    movesDisplay.textContent='Moves: 0';
    mount.appendChild(movesDisplay);

    const emojis=['🍎','🍌','🍇','🍓','🍍','🥝','🍒','🍉'];
    const cards=[...emojis,...emojis];
    cards.sort(()=>Math.random()-0.5);

    const grid=document.createElement('div');
    grid.className='grid grid-cols-4 gap-2 mt-2';
    let memoryFlipped=[], memoryLock=false;

    cards.forEach(emoji=>{
      const card=document.createElement('div');
      card.textContent='❓';
      card.className='bg-gray-800 p-6 rounded-lg flex items-center justify-center cursor-pointer text-2xl hover:bg-gray-700';
      card.onclick=()=>{
        if(memoryLock||card.textContent!=='❓') return;
        card.textContent=emoji; memoryFlipped.push(card); moves++; movesDisplay.textContent='Moves: '+moves;
        if(memoryFlipped.length===2){
          memoryLock=true;
          setTimeout(()=>{
            if(memoryFlipped[0].textContent!==memoryFlipped[1].textContent){
              memoryFlipped[0].textContent='❓';
              memoryFlipped[1].textContent='❓';
            } else {
              matched+=2;
              if(matched===cards.length){
                setTimeout(()=>alert('🎉 You Win! Total Moves: '+moves),200);
              }
            }
            memoryFlipped=[]; memoryLock=false;
          },700);
        }
      };
      grid.appendChild(card);
    });
    mount.appendChild(grid);
  }

  // CLASSIC NOKIA SNAKE
  else if(gameName==='snake'){
    title.textContent='Classic Snake Game';
    const canvas=document.createElement('canvas');
    canvas.width=400; canvas.height=400;
    canvas.className='bg-gray-800 rounded-lg';
    mount.appendChild(canvas);
    const ctx=canvas.getContext('2d');

    const box=20;
    let snake=[{x:8*box,y:8*box}];
    let food={x:Math.floor(Math.random()*20)*box, y:Math.floor(Math.random()*20)*box};
    let dir='RIGHT', score=0;
    let gameInterval;

    document.onkeydown=e=>{
      if(e.key==='ArrowUp'&&dir!=='DOWN') dir='UP';
      if(e.key==='ArrowDown'&&dir!=='UP') dir='DOWN';
      if(e.key==='ArrowLeft'&&dir!=='RIGHT') dir='LEFT';
      if(e.key==='ArrowRight'&&dir!=='LEFT') dir='RIGHT';
    };

    function draw(){
      ctx.fillStyle='#1f2937';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='red';
      ctx.fillRect(food.x, food.y, box, box);
      ctx.fillStyle='#facc15';
      snake.forEach(s=>ctx.fillRect(s.x, s.y, box, box));

      let head={x:snake[0].x, y:snake[0].y};
      if(dir==='UP') head.y-=box;
      if(dir==='DOWN') head.y+=box;
      if(dir==='LEFT') head.x-=box;
      if(dir==='RIGHT') head.x+=box;

      if(head.x<0||head.y<0||head.x>=canvas.width||head.y>=canvas.height||snake.some(s=>s.x===head.x&&s.y===head.y)){
        clearInterval(gameInterval);
        alert('💀 Game Over! Score: '+score);
        return;
      }

      if(head.x===food.x && head.y===food.y){
        snake.unshift(head);
        score++;
        do{ food={x:Math.floor(Math.random()*20)*box, y:Math.floor(Math.random()*20)*box}; }
        while(snake.some(s=>s.x===food.x && s.y===food.y));
      } else {
        snake.pop();
        snake.unshift(head);
      }

      ctx.fillStyle='white';
      ctx.font='16px Arial';
      ctx.fillText('Score: '+score, 10, 20);
    }

    gameInterval=setInterval(draw,150);
  }

  // TIC-TAC-TOE
  else if(gameName==='tic'){
    title.textContent='Tic-Tac-Toe';
    let moves=0, turn='X';
    const movesDisplay=document.createElement('p');
    movesDisplay.className='text-yellow-400 font-semibold';
    movesDisplay.textContent='Moves: 0';
    mount.appendChild(movesDisplay);

    const grid=document.createElement('div');
    grid.className='grid grid-cols-3 gap-2 mt-2';
    let cells=[];

    function checkWinner(){
      const combos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for(let c of combos){
        if(cells[c[0]].textContent && cells[c[0]].textContent===cells[c[1]].textContent && cells[c[0]].textContent===cells[c[2]].textContent){
          return cells[c[0]].textContent;
        }
      }
      return moves===9?'Draw':null;
    }

    for(let i=0;i<9;i++){
      const cell=document.createElement('div');
      cell.className='w-20 h-20 bg-gray-800 flex items-center justify-center text-3xl cursor-pointer hover:bg-gray-700';
      cell.onclick=()=>{
        if(cell.textContent) return;
        cell.textContent=turn; moves++; movesDisplay.textContent='Moves: '+moves;
        let winner=checkWinner();
        if(winner){ setTimeout(()=>alert(winner==='Draw'?'Draw!':'Winner: '+winner),100); }
        turn=turn==='X'?'O':'X';
      };
      grid.appendChild(cell); cells.push(cell);
    }
    mount.appendChild(grid);
  }

  // NUMBER GUESS
  else if(gameName==='number'){
    title.textContent='Number Guess Game';
    const target=Math.floor(Math.random()*50)+1; let attempts=0;

    const input=document.createElement('input');
    input.type='number'; input.min='1'; input.max='50'; input.placeholder='1-50';
    input.className='p-2 rounded-md text-black';
    const button=document.createElement('button');
    button.textContent='Guess'; button.className='ml-2 px-3 py-1 bg-yellow-400 text-black rounded-md glow';
    const result=document.createElement('p'); result.className='text-yellow-400 mt-2';

    button.onclick=()=>{
      attempts++; const val=parseInt(input.value);
      if(val===target){ result.textContent='✅ Correct! Attempts: '+attempts; }
      else if(val<target){ result.textContent='Too low! Attempts: '+attempts; }
      else{ result.textContent='Too high! Attempts: '+attempts; }
    };

    mount.appendChild(input); mount.appendChild(button); mount.appendChild(result);
  }
}
