// src/types/index.ts
// 模块: 全局类型定义
// 功能: 项目通用的 TypeScript 类型

// 用户类型
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'ADMIN' | 'SELLER' | 'VIEWER';
    createdAt: string;
  }
  
  // 认证状态类型
  export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
  }
  
  // 导航项类型
  export interface NavItem {
    title: string;
    href: string;
    icon?: string;
    children?: NavItem[];
  }
  
  // UI 状态类型
  export interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'system';
  }