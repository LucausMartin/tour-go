export type ErrorMessageType =
  | 'password'
  | 'network'
  | 'default'
  | 'register'
  | 'usernameEmpty'
  | 'passwordEmpty'
  | 'confirmPassword'
  | 'certifyCharactersEmpty'
  | 'certifyCharactersViolation'
  | 'nameEmpty';

export const ErrorMessage = {
  ['password']: `${String.fromCodePoint(0x1f928)} 用户存在哦，但有点记不清密码了吗`,
  ['default']: `${String.fromCodePoint(0x1f389)} 新用户输入唯一用户名即可开始注册`,
  ['network']: `${String.fromCodePoint(0x1f611)} 乐色网络···`,
  ['register']: `${String.fromCodePoint(0x1f611)} 牢记自己的验证字符用于找回密码`,
  ['usernameEmpty']: `${String.fromCodePoint(0x1fae5)} 用户名不能为空`,
  ['passwordEmpty']: `${String.fromCodePoint(0x1fae5)} 密码不能为空`,
  ['confirmPassword']: `${String.fromCodePoint(0x1fae3)} 验证密码和密码不一致`,
  ['certifyCharactersEmpty']: `${String.fromCodePoint(0x1fae5)} 验证字符不能为空`,
  ['certifyCharactersViolation']: `${String.fromCodePoint(0x1f921)} 验证字符不能包含特殊字符`,
  ['nameEmpty']: `${String.fromCodePoint(0x1fae5)} 名字不能为空`
};
