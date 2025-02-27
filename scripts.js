document.addEventListener('DOMContentLoaded', () => {
    const pasta = document.getElementById('pasta');
    const scoreDisplay = document.getElementById('score');
    const pointsPerClickDisplay = document.getElementById('pointsPerClick');
    const pointsPerSecondDisplay = document.getElementById('pointsPerSecond');
    const multiplierDisplay = document.getElementById('multiplier');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
  
    let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
    let pointsPerClick = localStorage.getItem('pointsPerClick') ? parseInt(localStorage.getItem('pointsPerClick')) : 1;
    let multiplier = localStorage.getItem('multiplier') ? parseFloat(localStorage.getItem('multiplier')) : 1.00;
    let pointsPerSecond = localStorage.getItem('pointsPerSecond') ? parseInt(localStorage.getItem('pointsPerSecond')) : 0;
  
    scoreDisplay.textContent = score;
    pointsPerClickDisplay.textContent = pointsPerClick;
    multiplierDisplay.textContent = multiplier;
    pointsPerSecondDisplay.textContent = pointsPerSecond;
  
    pasta.addEventListener('click', () => {
      score += Math.floor(pointsPerClick * multiplier);
      scoreDisplay.textContent = score;
      localStorage.setItem('score', score);
      updateUpgradeButtons();
      createPastaRain();
    });
  
    setInterval(() => {
      score += pointsPerSecond;
      scoreDisplay.textContent = score;
      localStorage.setItem('score', score);
      updateUpgradeButtons();
    }, 1000);
  
    fetch('data/upgrades.json')
      .then(response => response.json())
      .then(data => {
        upgradeButtons.forEach(button => {
          const upgradeId = button.getAttribute('id');
          const upgradeInfo = data.names.find(name => name[upgradeId]);
          const upgradeName = upgradeInfo[upgradeId];
  
          const storedLevel = localStorage.getItem(`upgradeLevel-${upgradeId}`);
          const level = storedLevel ? parseInt(storedLevel) : 1;
          const cost = localStorage.getItem(`upgradeCost-${upgradeId}`) ? parseInt(localStorage.getItem(`upgradeCost-${upgradeId}`)) : button.getAttribute('data-cost');
  
          button.textContent = `${upgradeName} (Level ${level} - ${cost} points)`;
          button.setAttribute('data-cost', cost);
          button.setAttribute('data-level', level);
  
          if (level > 5) {
            button.disabled = true;
            button.classList.add('disabled');
            button.textContent = `Max Level Reached`;
          }
        });
  
        setupUpgradeButtons(data); // Pass data to the setup function
      })
      .catch(error => console.error('Error fetching upgrade names:', error));
  
    function setupUpgradeButtons(data) {
      upgradeButtons.forEach(button => {
        const upgradeValue = parseInt(button.getAttribute('data-upgrade'));

        switch (parseInt(button.getAttribute('data-type'))) {
          case 1:
            button.classList.add('reg-upg')
            break
          case 2:
            button.classList.add('cps-upg')
            break
          case 3:
            button.classList.add('mpc-upg')
          default:
            button.classList.add('reg-upg')
            break
        }
  
        button.addEventListener('click', () => {
          let cost = parseInt(button.getAttribute('data-cost'));
          let level = parseInt(button.getAttribute('data-level'));
          const upgradeId = button.getAttribute('id');
          const upgradeInfo = data.names.find(name => name[upgradeId]);
  
          if (level >= 6) {
            return;
          }
  
          if (score >= cost && level <= 5) {
            score -= cost;
            if (upgradeInfo.type === 'click') {
              pointsPerClick += upgradeInfo.value;
              pointsPerClickDisplay.textContent = pointsPerClick;
            } else if (upgradeInfo.type === 'cps') {
              pointsPerSecond += upgradeInfo.value;
              pointsPerSecondDisplay.textContent = pointsPerSecond;
              localStorage.setItem('pointsPerSecond', pointsPerSecond);
            } else if (upgradeInfo.type === 'mpc') {
              multiplier += (upgradeInfo.value / 5);
              multiplierDisplay.textContent = multiplier;
              localStorage.setItem('multiplier', multiplier);
            }
            
            scoreDisplay.textContent = score;
            localStorage.setItem('score', score);
            localStorage.setItem('pointsPerClick', pointsPerClick);
  
            level += 1; // Increment level
          }
  
          if (level <= 5) {
            cost = Math.floor(cost * 1.5);
            button.setAttribute('data-cost', cost);
            button.setAttribute('data-level', level);
            localStorage.setItem(`upgradeLevel-${button.getAttribute('id')}`, level);
            localStorage.setItem(`upgradeCost-${button.getAttribute('id')}`, cost);
            const upgradeName = upgradeInfo[upgradeId];
            button.textContent = `${upgradeName} (Level ${level} - ${cost} points)`;
          }
  
          if (level >= 6) {
            button.disabled = true;
            button.classList.add('disabled');
            button.textContent = `Max Level Reached`;
            localStorage.setItem(`upgradeLevel-${button.getAttribute('id')}`, 6); // Ensure it stays disabled
            location.reload(true)
          }
          updateUpgradeButtons();
        });
      });
  
      updateUpgradeButtons();
    }
  
    function updateUpgradeButtons() {
      upgradeButtons.forEach(button => {
        const cost = parseInt(button.getAttribute('data-cost'));
        const level = parseInt(button.getAttribute('data-level'));
  
        if (level >= 6) { // Ensure it stays disabled
          button.disabled = true;
          button.classList.add('disabled');
          button.textContent = `Max Level Reached`;
        } else if (score >= cost) {
          button.classList.remove('disabled');
          button.disabled = false;
        } else {
          button.classList.add('disabled');
          button.disabled = true;
        }
      });
    }

    // Function to create pasta rain effect
    function createPastaRain() {
        const pastaRain = document.createElement('div');
        pastaRain.classList.add('pasta-rain');
        document.body.appendChild(pastaRain);
        
        // Randomize the starting position of the falling pasta
        pastaRain.style.left = `${Math.random() * 100}vw`;
        
        // Remove the element after the animation ends
        pastaRain.addEventListener('animationend', () => {
            pastaRain.remove();
        });
    }
    document.getElementById('gotoinfo').addEventListener('click', function() {
      window.location.href = '/info'
    })
});
