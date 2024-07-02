document.getElementById('rollButton').addEventListener('click', () => {
    const dice = document.getElementById('dice');
    const randomX = Math.floor(Math.random() * 4) * 90;
    const randomY = Math.floor(Math.random() * 4) * 90;
    const randomZ = Math.floor(Math.random() * 4) * 90;
    dice.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg) rotateZ(${randomZ}deg)`;
  });