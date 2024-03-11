interface MessageOptions {
  message: string;
  duration: number;
}
function ErrorMessage(options: MessageOptions) {
  console.log('ErrorMessage');
  return new Promise((resolve, reject) => {
    if (!options.message) {
      reject(new Error('message is required'));
    }
    const div = document.createElement('div');
    div.classList.add('error-message');
    div.innerHTML = options.message;
    document.body.appendChild(div);
    setTimeout(() => {
      div.classList.add('top-[20px]');
    }, 0);
    setTimeout(() => {
      div.classList.remove('top-[20px]');
    }, options.duration);
    setTimeout(() => {
      div.remove();
    }, options.duration + 2000);
    resolve(true);
  });
}

export { ErrorMessage };
