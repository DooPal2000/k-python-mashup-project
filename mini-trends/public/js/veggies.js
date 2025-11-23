const veggieFiles = [
  '/img/vegetable1.svg',
  '/img/vegetable2.svg',
  '/img/vegetable3.svg',
  // 더 추가
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// 야채 객체 데이터
const veggies = [];

function createVeggies() {
  const container = document.getElementById('veggie-container');
  for (let i = 0; i < veggieFiles.length; i++) {
    const img = document.createElement('img');
    img.src = veggieFiles[i];
    img.style.position = 'absolute';
    img.style.width = '48px';
    img.style.left = randomInt(0, container.offsetWidth - 48) + 'px';
    img.style.top = randomInt(0, container.offsetHeight - 48) + 'px';
    container.appendChild(img);

    veggies.push({
      img: img,
      x: parseInt(img.style.left, 10),
      y: parseInt(img.style.top, 10),
      dx: randomInt(1, 3),    // 속도
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }
}

function animateVeggies() {
  const container = document.getElementById('veggie-container');
  for (let i = 0; i < veggies.length; i++) {
    let veg = veggies[i];
    veg.x += veg.dx * veg.direction;
    if (veg.x < 0 || veg.x > container.offsetWidth - 48) veg.direction *= -1; // 충돌시 방향 전환
    veg.img.style.left = veg.x + 'px';
  }
}

window.onload = () => {
  createVeggies();
  setInterval(animateVeggies, 30); // 30ms마다 위치 변경
};

