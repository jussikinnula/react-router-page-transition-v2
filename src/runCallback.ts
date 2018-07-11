export default (callback?: Function) => {
  return new Promise(async (resolve) => {
    if (callback) await callback();
    return resolve();
  });
};
