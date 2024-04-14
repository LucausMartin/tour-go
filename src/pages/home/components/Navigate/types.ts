import {
  MdOutlineAccountCircle,
  MdOutlineAccountBalance,
  MdOutlineReorder,
  MdAddCircleOutline,
  MdOutlineMessage
} from 'react-icons/md';
import type { IconType } from 'react-icons';

export type NavListKeys = 'discover' | 'publish' | 'me' | 'more' | 'message' | 'newPlan';

interface NavItem {
  title: string;
  icon: IconType;
  key: NavListKeys;
}

export const NavList: NavItem[] = [
  {
    title: '发现',
    icon: MdOutlineAccountBalance,
    key: 'discover'
  },
  {
    title: '创建',
    icon: MdAddCircleOutline,
    key: 'newPlan'
  },
  {
    title: '计划',
    icon: MdAddCircleOutline,
    key: 'publish'
  },
  {
    title: '消息',
    icon: MdOutlineMessage,
    key: 'message'
  },
  {
    title: '我',
    icon: MdOutlineAccountCircle,
    key: 'me'
  },
  {
    title: '更多',
    icon: MdOutlineReorder,
    key: 'more'
  }
];
