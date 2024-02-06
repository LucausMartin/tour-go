export type ErrorMessageType = 'username' | 'password' | 'network' | 'default' | 'register';

export const ErrorMessage = {
  ['username']: `${String.fromCodePoint(0x1f605)} 可恶，这个用户名被人占了`,
  ['password']: `${String.fromCodePoint(0x1f928)} 有点记不清密码了吗`,
  ['default']: `${String.fromCodePoint(0x1f389)} 新用户输入唯一用户名即可开始注册`,
  ['network']: `${String.fromCodePoint(0x1f611)} 乐色网络···`,
  ['register']: `${String.fromCodePoint(0x1f611)} 牢记自己的验证字符用于找回密码`
};
