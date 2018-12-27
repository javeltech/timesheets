const startTime = document.querySelector('#startTime');
const endTime = document.querySelector('#endTime');

document.querySelector('#submit-time').addEventListener('submit', (e) => {
  if (startTime.value && endTime.value){
    if (startTime.value > endTime.value){
      alert('please provide a valid satrt and stop time');
    }
  }
  console.log('test');
  e.preventDefault();
})
