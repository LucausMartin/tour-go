import { MdOutlineAccountCircle, MdOutlineAccountBalance, MdOutlineReorder, MdAddCircleOutline } from 'react-icons/md';
import type { IconType } from 'react-icons';

export type NavListKeys = 'discover' | 'publish' | 'me' | 'more';

interface NavItem {
  title: string;
  Icon: IconType;
  key: NavListKeys;
}

export const NavList: NavItem[] = [
  {
    title: '发现',
    Icon: MdOutlineAccountBalance,
    key: 'discover'
  },
  {
    title: '发布',
    Icon: MdAddCircleOutline,
    key: 'publish'
  },
  {
    title: '我',
    Icon: MdOutlineAccountCircle,
    key: 'me'
  },
  {
    title: '更多',
    Icon: MdOutlineReorder,
    key: 'more'
  }
];
