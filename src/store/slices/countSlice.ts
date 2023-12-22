import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState, AppDispatch, AppGetState } from '../store';

// 为 slice state 定义一个类型
interface CounterState {
  value: number;
}

// 使用该类型定义初始 state
const initialState: CounterState = {
  value: 0
};

export const counterSlice = createSlice({
  name: 'counter',
  // `createSlice` 将从 `initialState` 参数推断 state 类型
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    // 使用 PayloadAction 类型声明 `action.payload` 的内容
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

export const incrementAsync = (amount: number) => (dispatch: AppDispatch, getState: AppGetState) => {
  console.log(getState().counter.value);
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

// 导出自动生成的 action 生成函数
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
