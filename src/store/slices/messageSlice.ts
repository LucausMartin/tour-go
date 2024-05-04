// import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import type { RootState, AppDispatch, AppGetState } from '../store';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface List {
  message_id: string;
  message_content: string;
  user_name_send: string;
  user_name_receive: string;
  time: string;
  type: string;
  read: number;
}

// 为 slice state 定义一个类型
interface MessageState {
  value: {
    count: number;
    typeList: {
      comments: {
        count: number;
        list: List[];
      };
      likeCollects: {
        count: number;
        list: List[];
      };
      fans: {
        count: number;
        list: List[];
      };
      shares: {
        count: number;
        list: List[];
      };
    };
  };
}

// 使用该类型定义初始 state
const initialState: MessageState = {
  value: {
    count: 0,
    typeList: {
      comments: {
        count: 0,
        list: []
      },
      likeCollects: {
        count: 0,
        list: []
      },
      fans: {
        count: 0,
        list: []
      },
      shares: {
        count: 0,
        list: []
      }
    }
  }
};

export const messageSlice = createSlice({
  name: 'messager',
  // `createSlice` 将从 `initialState` 参数推断 state 类型
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // 直接替换成新的数据
      state.value = action.payload;
    }
  }
});

// export const incrementAsync = (amount: number) => (dispatch: AppDispatch, getState: AppGetState) => {
//   console.log(getState().counter.value);
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// 导出自动生成的 action 生成函数
export const { addMessage } = messageSlice.actions;

// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectMessage = (state: RootState) => state.messager.value;

export default messageSlice.reducer;
