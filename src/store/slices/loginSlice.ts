// import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import type { RootState, AppDispatch, AppGetState } from '../store';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// 为 slice state 定义一个类型
interface LoginState {
  value: 'ready' | 'login' | 'logout';
}

// 使用该类型定义初始 state
const initialState: LoginState = {
  value: 'logout'
};

export const loginSlice = createSlice({
  name: 'loginer',
  // `createSlice` 将从 `initialState` 参数推断 state 类型
  initialState,
  reducers: {
    readyLoginAction: state => {
      state.value = 'ready';
    },
    loginAction: state => {
      state.value = 'login';
    },
    logoutAction: state => {
      state.value = 'logout';
    }
    // 使用 PayloadAction 类型声明 `action.payload` 的内容
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // }
  }
});

// export const incrementAsync = (amount: number) => (dispatch: AppDispatch, getState: AppGetState) => {
//   console.log(getState().counter.value);
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// 导出自动生成的 action 生成函数
export const { loginAction, logoutAction, readyLoginAction } = loginSlice.actions;

// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectLogin = (state: RootState) => state.loginer.value;

export default loginSlice.reducer;
