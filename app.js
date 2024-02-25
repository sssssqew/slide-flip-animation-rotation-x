const main = document.querySelector('main')
const sections = main.querySelectorAll('section')
const clientHeight = document.documentElement.clientHeight // 브라우저 높이
const scrollHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
)
const scrollRange = scrollHeight - clientHeight // 세로방향 스크롤 범위
const scrollRangeOfOneSection = scrollRange / (sections.length - 1) // 하나의 섹션에 대한 스크롤 범위
const speedOfSlide = 0.2
let index = 0, timer, angle = 0

function trotthling(handler, e){   // 100ms 동안 이벤트 금지하기 (자연스러운 슬라이드 효과 연출)
  if(!timer){
    timer = setTimeout(function(){
      handler(e)
      timer = null 
    }, 100)
  }
}

function initializeStyle(sections){      // 섹션의 기존스타일 초기화 (다른 슬라이드 숨기기)
  for(let i=0; i<sections.length; i++){ 
    const section = sections[i]
    section.style.opacity = '0'
    section.style.transform = 'translateX(-50%)'
    setTimeout(function(){ // 부드러운 화면 전환을 위한 타이머 적용
      section.style.transition = 'none'
    }, 100)
  }
}

function changeSlide(e){
  console.log('scroll', e.deltaY)
  
  if(e.deltaY > 0){ // 스크롤을 내린 경우
    angle += parseInt(e.deltaY * speedOfSlide) // 스크롤을 내린 거리의 speedOfSlide 비율만큼만 angle 값 증가
    console.log(angle)

    if(angle > 360){ // 다음 슬라이드의 flip 을 위한 angle 초기화 
      angle = 0
      initializeStyle(sections) // angle 이 360도에서 0도로 갑자기 변할때 트랜지션이 적용되어 있어서 슬라이드가 빠르게 돌면서 로테이션되는데 이를 방지하고자 트랜지션을 제거함
    }

    if(Math.abs(angle - 90) < 30){ // 90도 +-10도 근처에서 코드블럭 실행
      angle += 180 // 다음 슬라이드의 위상은 270도부터 시작해야 하므로 180도 증가 (슬라이드 flip)
      index++ // 다음 슬라이드 선택을 위한 인덱스값 증가 
      if(index > sections.length - 1){
        index = 0
      }
      setTimeout(function(){ // 부드러운 화면 전환을 위한 타이머 설정후 초기화 적용하기
        initializeStyle(sections)
      }, 60)
    }
    console.log(index)
    
    // agnle 이 270보다 커질때 화면전환하면 화면이 뚝뚝 끊기면서 갑자기 바뀌므로 40도 정도 여유를 두고 부드럽게 전환되도록 함
    const section = sections[index]
    if(angle > 230 || angle > 0){   // angle 이 360도에서 0도로 바뀌고 나서 다시 부드럽게 회전할 수 있도록 트랜지션 적용함
      setTimeout(function(){        // 슬라이드 flip 후 자연스러운 슬라이드 움직임을 위한 트랜지션 재설정
        section.style.transition = '1s ease-in-out' 
      }, 50)
    } 
    section.style.opacity = '1'
    section.style.transform = `translateX(-50%) rotateY(${parseInt(angle)}deg)`
  }
}

document.addEventListener('wheel', (e) => trotthling(changeSlide, e))