const ErrorMessage = (message: string, time: number) => {
  const error = document.createElement('div');
  error.className = 'error-message';
  error.innerText = message;
  document.body.appendChild(error);
  const showTimer = setTimeout(() => {
    error.className = 'error-message-show';
    clearTimeout(showTimer);
  }, 100);
  const transitionTimer = setTimeout(() => {
    error.className = 'error-message';
    clearTimeout(transitionTimer);
  }, time);

  const removeTimer = setTimeout(() => {
    document.body.removeChild(error);
    clearTimeout(removeTimer);
  }, time + 500);
};

export { ErrorMessage };
