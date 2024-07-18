const CARD_IMG = [
    "bear",
    "camel",
    "cat",
    "chick",
    "chicken",
    "cockroach",
    "cow",
    "dolphin",
    "elephant",
    "fish",
    "frog",
    "horse",
    "kitty",
    "koala",
    "monkey",
    "penguin",
    "pig",
    "porcupine",
    "puffer-fish",
    "rabbit",
    "rat-head",
    "shell",
    "snail",
    "snake",
    "squid",
    "tiger",
    "whale",
  ];

  const BOARD_SIZE = 24;

  let stage = 1; // 게임 스테이지
  let time = 100; // 남은 시간
  let timer = 0;
  let isFlip = false; // 카드 뒤집기 가능 여부

  let cardDeck = [];  // 카드 덱을 담아줄 배열

  //카드 화면 세팅
  const gameBoard = document.getElementsByClassName("game__board")[0];
  const cardBack = document.getElementsByClassName("card__back");
  const cardFront = document.getElementsByClassName("card__front");

  function startGame(){
    //1.카드 덱 생성
    makeCardDeck();
    //2. 생성한 덱을 화면에 세팅
    settingCardDeck();
    //3. 최초 1회 전체 카드를 보여줌
    showCardDeck();

  }

  function showCardDeck(){
    let cnt = 0;
    let showCardPromise = new Promise((resolve, reject)=>{
      let showCardTimer = setInterval(() => {
        cardBack[cnt].style.transform = "rotateY(180deg)";
        cardFront[cnt++].style.transform = "rotateY(0deg)";        
        if(cnt === cardDeck.length){
          clearInterval(showCardTimer);
          resolve();
        }
      }, 100);
    });

    showCardPromise.then(()=>{
      setTimeout(()=>{
        //카드 숨기기
        hideCardDeck();
      }, 500);
    })
  };

  function hideCardDeck(){
    for(let i=0; i<cardDeck.length; i++){
      cardBack[i].style.transform = "rotateY(0deg)";
      cardFront[i].style.transform = "rotateY(-180deg)";
    }

    setTimeout(()=>{
      isFlip = true;
      startTimer();
    }, 100);
  }

  function startTimer(){
    timer = setInterval(()=> {
      playerTime.innerHTML = --time;
      if(time === 0){
        clearInterval(timer);
        stopGame();
      }
    }, 1000);
  }

  gameBoard.addEventListener("click", function(e){
    if(!isFlip) return;

    if(e.target.parentNode.className ==="card"){
      let clickCardId = e.target.parentNode.dataset.id;
      if(cardDeck[clickCardId].isOpen == false){
        openCard(clickCardId);
      }
    }
  });

  function openCard(id){
    cardBack[id].style.transform = "rotateY(180deg)";
    cardFront[id].style.transform = "rotateY(0deg)";

    cardDeck[id].isOpen = true;

    //선택한 카드가 첫번째 카드인지, 두번째 카드인지 판단
    let openCardIndexArr = getOpenCardArr(id);

    //두번의 선택인 경우 카드 일치 여부를 확인
    //일치 여부 확인 전까지는 카드 뒤집기 불가능
    if(openCardIndexArr.length ===2){
      isFlip = false;
      checkCardMatch(openCardIndexArr);
    }
  }

  function checkCardMatch(indexArr){
    let firstCard = cardDeck[indexArr[0]];
    let secondCard = cardDeck[indexArr[1]];

    if(firstCard.card === secondCard.card){
      //카드 일치 처리
      firstCard.isMatch = true;
      secondCard.isMatch = true;
      matchCard();
    }else{
      //카드가 불일치 할 경우
      firstCard.isOpen = false;
      secondCard.isOpen = false;
      closeCard(indexArr);
    }
  }

  function closeCard(indexArr){
    setTimeout(()=> {
      for(let i=0; i<indexArr.length; i++){
        cardBack[indexArr[i]].style.transform = "rotateY(0deg)";
        cardFront[indexArr[i]].style.transform = "rotateY(180deg)";
      }
      isFlip = true;
    }, 800);
  }

  //카드 일치 처리
  function matchCard(){
    if(checkClear() == true){
      clearStage();
      return;
    }

    // 바로 뒤집으면 오류가 가끔 발생해서 0.1초 후에 뒤집기 가능하도록
    setTimeout(()=>{
      isFlip = true;
    }, 100);
  }

  //스테이지 클리어
  function clearStage(){

  }

  // 모든 카드를 다 찾았는지 확인
  function checkClear(){
    let isClear = true;
    cardDeck.forEach((ele)=>{
      if(ele.isMatch === false){
        isClear = false;
        return;
      }
    });
    return isClear;
  }

  function getOpenCardArr(id){
    let openCardIndexArr = [];

    //반복문을 돌면서 isOpen이 true, isMatch가 false인 칻의 인덱스를 배열에 저장
    cardDeck.forEach((ele,idx)=>{
      if(ele.isOpen === false || ele.isMatch === true){
        return;
      }
      openCardIndexArr.push(idx);
    });
    return openCardIndexArr;
  }


  //미완성
  function stopGame(){
    showGameResult();
  }

  function showGameResult(){

  }


  function settingCardDeck(){
    for(let i=0; i<BOARD_SIZE; i++){
      console.log(BOARD_SIZE)
      gameBoard.innerHTML = 
        gameBoard.innerHTML +
        `
          <div class="card" data-id ="${i}" data-card"${cardDeck[i].card}">
            <div class="card__back"></div>
            <div class="card__front"></div>
          </div>
        `;
        cardFront[i].style.backgroundImage =`url('img/card-pack/${cardDeck[i].card}.png')`;
    }
    
  }

  function makeCardDeck(){
    let randomNumberArr = [];
    for(let i=0; i<BOARD_SIZE/2; i++){
      let randomNumber = getRandom(27,0);

      //중복검사
      //randomNumberArr 안에 랜덤 값이 없으면 추가
      //randomNumberArr 안에 랜덤 값이 없으면 i-1추가
      //[0,24,2,5,3,7]
      if(randomNumberArr.indexOf(randomNumber) === -1){  // 이미 뽑은 숫자가 있으면...중복이면 다시 뽑음..
        randomNumberArr.push(randomNumber);
      }else{
        i--;   // 중복있으면 for문 한 번 더 돌도록..
      }
    }

    // 카드는 두 장씩 필요하니까 복사
    randomNumberArr.push(...randomNumberArr);  // 배열을 풀어서 복사하기 (붙여넣기...2장씩 필요함)

    // 카드 섞기
    let shuffleArr = shuffle(randomNumberArr);

    //섞은 값으르 세팅
    for(let i=0; i< BOARD_SIZE; i++){
      cardDeck.push({
        card : CARD_IMG[shuffleArr[i]],
        isOpen : false,
        isMatch : false
      });
    }
    console.log(cardDeck);
    return cardDeck;
  }
  function shuffle(array){
    return array.sort(()=> Math.random() - 0.5);
  }
  
  function getRandom(max,min){
    return parseInt(Math.random() * (max-min)) + min;
  }

  const playerTime = document.getElementById("player-time");
  const playerStage = document.getElementById("player-stage");

  window.onload = function(){
    playerTime.innerHTML = time;
    playerStage.innerHTML = stage;
    startGame();
  }